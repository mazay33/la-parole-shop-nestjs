import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Prisma } from '@prisma/client';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  @Public()
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Get(':id')
  @Public()
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }
}
