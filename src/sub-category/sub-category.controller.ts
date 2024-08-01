import { Controller, Get } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { Public } from '@common/decorators';

@Controller('sub-category')
@Public()
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @Get('list')
  async getSubCategories() {
    return await this.subCategoryService.getSubCategories();
  }
}
