import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

  async getSubCategories() {
    return await this.prisma.subCategory.findMany();
  }
}
