import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}
  async addProductToWishlist(userId: string, productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    console.log(product);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: {
          userId,
        },
      });
    }

    if (wishlist) {
      const existingWishlistProduct =
        await this.prisma.wishlistProduct.findFirst({
          where: {
            wishlist: {
              userId,
            },
            product: {
              id: productId,
            },
          },
        });

      if (existingWishlistProduct) {
        throw new ConflictException('Товар уже добавлен в избранное');
      }

      const wishlistProduct = await this.prisma.wishlistProduct.create({
        data: {
          wishlist: {
            connect: {
              userId: userId,
            },
          },
          product: {
            connect: {
              id: productId,
            },
          },
        },
      });
      return wishlistProduct;
    }
  }

  async removeProductFromWishlist(userId: string, productId: number) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    const wishlistItem = await this.prisma.wishlistProduct.findFirst({
      where: {
        wishlistId: wishlist.userId,
        productId: productId,
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    return this.prisma.wishlistProduct.delete({
      where: {
        UniqueWishlistItem: {
          wishlistId: wishlist.userId,
          productId: productId,
        },
      },
    });
  }

  async clearWishlist(userId: string) {
    const wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return this.prisma.wishlistProduct.deleteMany({
      where: {
        wishlistId: wishlist.userId,
      },
    });
  }

  async getWishlist(userId: string) {
    return this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        wishlistProducts: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
                subCategories: true,
              },
            },
            wishlist: false,
          },
        },
      },
    });
  }
}
