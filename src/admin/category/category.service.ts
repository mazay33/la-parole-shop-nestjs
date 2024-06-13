import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(categoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: categoryDto,
    });
  }

  async updateCategory(id: number, categoryDto: CreateCategoryDto) {
    return await this.prisma.category.update({
      where: {
        id,
      },
      data: categoryDto,
    });
  }
}
