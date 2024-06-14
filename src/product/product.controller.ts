import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

@ApiTags('Product')
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
