import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { Public } from '@common/decorators';

@ApiTags('Product Public')
@Controller('product')
@Public()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortType', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'sku', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'subCategoryIds', required: false, type: [Number] })
  async getProducts(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortType') sortType?: 'asc' | 'desc',
    @Query('name') name?: string,
    @Query('sku') sku?: string,
    @Query('categoryId', new ParseIntPipe({ optional: true }))
    categoryId?: number,
    @Query('subCategoryId', new ParseIntPipe({ optional: true }))
    subCategoryId?: number,
  ) {
    return await this.productService.getProducts(
      page,
      pageSize,
      sortBy,
      sortType,
      name,
      sku,
      categoryId,
      subCategoryId,
    );
  }

  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }
}
