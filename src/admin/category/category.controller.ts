import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/get-current-user-role.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('category')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Admin Category')
@ApiBearerAuth()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, createCategoryDto);
  }
}
