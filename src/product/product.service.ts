import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
    return await this.prisma.product.findMany({
      include: { img: true, sub_categories: true },
    });
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id,
      },
      include: {
        category: {
          select: { name: true },
        },
        sub_categories: true,
        cup_sizes: true,
        clothing_sizes: true,
        underbust_sizes: true,
        variations: true,
        info: true,
        img: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Товар не найден');
    }
    return product;
  }
}
