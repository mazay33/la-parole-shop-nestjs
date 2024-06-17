import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { promisify } from 'util';
import { unlink } from 'fs';

const unlinkAsync = promisify(unlink);

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProducts(
    page?: number,
    pageSize?: number,
    sortBy?: string,
    sortType?: 'asc' | 'desc',
    name?: string,
    sku?: string,
  ) {
    const totalProducts = await this.prisma.product.count({
      where: {
        name: { contains: name, mode: 'insensitive' },
        sku: { contains: sku, mode: 'insensitive' },
      },
    });

    // Если параметры не указаны, устанавливаем значения по умолчанию
    const currentPage = page ?? 1;
    const currentPageSize = pageSize ?? totalProducts;

    const skip = (currentPage - 1) * currentPageSize;
    const take = currentPageSize;

    // Устанавливаем сортировку по умолчанию, если параметры не указаны
    const orderBy = sortBy ? { [sortBy]: sortType ?? 'asc' } : undefined;

    const products = await this.prisma.product.findMany({
      skip,
      take,
      orderBy,
      where: {
        name: { contains: name, mode: 'insensitive' },
        sku: { contains: sku, mode: 'insensitive' },
      },

      include: { img: true, sub_categories: true, category: true },
    });

    return {
      data: products,
      total: totalProducts,
      page: currentPage,
      pageSize: currentPageSize,
      totalPages: Math.ceil(totalProducts / currentPageSize),
    };
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

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    if (!createProductDto.categoryId) {
      throw new NotFoundException('Category not found');
    }
    const newProduct = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        sku: createProductDto.sku,
        price: createProductDto.price,
        discount: createProductDto.discount,
        stock: createProductDto.stock,
        isAvailable: createProductDto.isAvailable,
        categoryId: createProductDto.categoryId,

        sub_categories: {
          connect: createProductDto.subCategoryIds.map((subCategory) => ({
            id: subCategory,
          })),
        },

        cup_sizes: {
          connect: createProductDto.cup_sizes.map((size) => ({ id: size })),
        },

        clothing_sizes: {
          connect: createProductDto.clothing_sizes.map((size) => ({
            id: size,
          })),
        },

        underbust_sizes: {
          connect: createProductDto.underbust_sizes.map((size) => ({
            id: size,
          })),
        },
      },

      include: {
        img: true,
        category: true,
        sub_categories: true,
        cup_sizes: true,
        clothing_sizes: true,
        underbust_sizes: true,
        variations: true,
      },
    });

    if (createProductDto.variations) {
      createProductDto.variations.forEach(async (variation) => {
        await this.prisma.productVariation.create({
          data: {
            ...variation,
            productId: newProduct.id,
          },
        });
      });
    }

    if (createProductDto.info) {
      createProductDto.info.forEach(async (info) => {
        await this.prisma.productInfo.create({
          data: {
            ...info,
            productId: newProduct.id,
          },
        });
      });
    }

    return await this.getProductById(newProduct.id);
  }

  async deleteProduct(id: number): Promise<number> {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    return product.id;
  }

  async updateProductPhoto(id: number, filenames: string[]): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.productImage.createMany({
      data: filenames.map((filename) => ({
        url: filename,
        productId: id,
      })),
    });

    return this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });
  }

  async replaceProductPhoto(
    id: number,
    photoId: number,
    filename: string,
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const photo = product.img.find((image) => image.id === photoId);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Remove the old photo file
    await unlinkAsync(`./uploads/${photo.url}`);

    // Update the photo in the database
    await this.prisma.productImage.update({
      where: { id: photoId },
      data: { url: filename },
    });

    return this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });
  }

  async deleteProductPhoto(id: number, photoId: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const photo = product.img.find((image) => image.id === photoId);
    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    // Remove the photo file
    await unlinkAsync(`./uploads/${photo.url}`);

    // Remove the photo from the database
    await this.prisma.productImage.delete({
      where: { id: photoId },
    });

    return this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });
  }

  async deleteAllProductPhotos(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Remove all photo files
    await Promise.all(
      product.img.map((photo) => unlinkAsync(`./uploads/${photo.url}`)),
    );

    // Remove all photos from the database
    await this.prisma.productImage.deleteMany({
      where: { productId: id },
    });

    return this.prisma.product.findUnique({
      where: { id },
      include: { img: true },
    });
  }
}
