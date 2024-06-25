import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartProduct } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
  ) {}

  async addProductToCart(
    userId: string,
    productId: number,
    quantity: number,
    configurationId?: number,
    beltSizeId?: number,
    clothingSizeId?: number,
    cupSizeId?: number,
  ): Promise<CartProduct> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    if (!beltSizeId && !clothingSizeId && !cupSizeId) {
      throw new BadRequestException(
        'Belt size, clothing size or cup size is required',
      );
    }

    const product = await this.productService.getProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.productConfigurations.length > 0) {
      if (!configurationId) {
        throw new BadRequestException(
          'Configuration ID is required for this product',
        );
      }

      const isProductConfigurationExist = product.productConfigurations.some(
        (configuration) => configuration.id === configurationId,
      );

      if (!isProductConfigurationExist) {
        throw new NotFoundException('Product configuration not found');
      }
    } else {
      configurationId = null;
    }

    return this.prisma.$transaction(async (prisma) => {
      let cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
        });
      }

      const cartItem = await prisma.cartProduct.findFirst({
        where: {
          cartId: userId,
          productId,
          productConfigurationId: configurationId,
          beltSizeId,
          clothingSizeId,
          cupSizeId,
        },
      });

      console.log('cartItem', cartItem);

      if (cartItem) {
        return prisma.cartProduct.update({
          where: {
            id: cartItem.id,
          },
          data: { quantity: cartItem.quantity + quantity },
        });
      } else {
        return prisma.cartProduct.create({
          data: {
            cartId: userId,
            productId,
            productConfigurationId: configurationId,
            beltSizeId,
            clothingSizeId,
            cupSizeId: cupSizeId,
            quantity,
          },
        });
      }
    });
  }

  async removeProductFromCart(
    userId: string,
    cartProductId: number,
  ): Promise<{ message: string }> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartProduct.findUnique({
      where: {
        id: cartProductId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    await this.prisma.cartProduct.delete({
      where: {
        id: cartProductId,
      },
    });

    return {
      message: `Product ${cartProductId} removed from cart successfully`,
    };
  }

  async clearCart(userId: string): Promise<{ message: string }> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartProduct.deleteMany({
      where: {
        cartId: userId,
      },
    });

    return {
      message: 'Cart cleared successfully',
    };
  }

  async getCartProducts(userId: string) {
    const cartProducts = await this.prisma.cartProduct.findMany({
      where: { cartId: userId },
      include: {
        product: {
          include: {
            images: true,
            productConfigurations: {
              select: {
                id: true,
                name: true,
                price: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!cartProducts) {
      throw new NotFoundException('Cart not found');
    }

    return cartProducts;
  }

  async getCartSummary(
    userId: string,
  ): Promise<{ totalPrice: number; totalQuantity: number }> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const totalPrice = cart.cartProducts.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    const totalQuantity = cart.cartProducts.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      totalPrice,
      totalQuantity,
    };
  }
}
