import { Module } from '@nestjs/common';
import { CategoryController } from './category.admin.controller';
import { CategoryService } from './category.admin.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
