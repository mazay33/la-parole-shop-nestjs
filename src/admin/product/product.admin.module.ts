import { Module } from '@nestjs/common';
import { AdminProductController } from './product.admin.controller';
import { AdminProductService } from './product.admin.service';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [AdminProductController],
  providers: [AdminProductService, ProductService],
})
export class AdminProductModule {}
