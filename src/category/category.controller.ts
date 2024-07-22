import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Public } from '@common/decorators';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('list')
  @Public()
  async getCategories() {
    return await this.categoryService.getCategories();
  }
}
