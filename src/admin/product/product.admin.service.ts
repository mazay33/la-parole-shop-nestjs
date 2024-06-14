import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { promisify } from 'util';
import { unlink } from 'fs';
import { ProductEntity } from './entity/product.entity';
import { UpdateProductDto } from './dto/update-product.dro';
import { ProductService } from 'src/product/product.service';

const unlinkAsync = promisify(unlink);

@Injectable()
export class AdminProductService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
  ) {}

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

    return await this.productService.getProductById(newProduct.id);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {},
    });
    return product;
  }

  async deleteProduct(id: number): Promise<ProductEntity> {
    const product = await this.prisma.product.delete({
      where: { id },
    });
    return product;
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
