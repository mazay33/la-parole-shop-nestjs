import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addProductToCart(userId: string, productId: number, count: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    const cartItem = await this.prisma.cartProduct.findFirst({
      where: {
        cartId: cart.userId,
        productId: productId,
      },
    });

    if (cartItem) {
      return this.prisma.cartProduct.update({
        where: {
          UniqueCartItem: {
            cartId: cart.userId,
            productId: productId,
          },
        },
        data: { count: cartItem.count + count },
      });
    } else {
      return this.prisma.cartProduct.create({
        data: {
          cartId: cart.userId,
          productId: productId,
          count: count,
        },
      });
    }
  }

  async removeProductFromCart(userId: string, productId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartProduct.findFirst({
      where: {
        cartId: cart.userId,
        productId: productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found in cart');
    }

    return this.prisma.cartProduct.delete({
      where: {
        UniqueCartItem: {
          cartId: cart.userId,
          productId: productId,
        },
      },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return this.prisma.cartProduct.deleteMany({
      where: {
        cartId: cart.userId,
      },
    });
  }

  async getCart(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getCartTotalPrice(userId: string) {
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

    return cart.cartProducts.reduce(
      (total, item) => total + item.product.price * item.count,
      0,
    );
  }
}
