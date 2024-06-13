import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { promisify } from 'util';
import { unlink } from 'fs';

const unlinkAsync = promisify(unlink);

@Injectable()
export class AdminProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    if (!createProductDto.categoryId) {
      throw new NotFoundException('Category not found');
    }
    return this.prisma.product.create({
      data: createProductDto,
    });
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
