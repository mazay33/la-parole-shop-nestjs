import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { Public } from '@common/decorators';

@ApiTags('Product Public')
@Controller('product')
@Public()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }
}
