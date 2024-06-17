import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './controllers/product.public.controller';
import { ProductAdminController } from './controllers/product.admin.controller';

@Module({
  controllers: [ProductController, ProductAdminController],
  providers: [ProductService],
})
export class ProductModule {}
