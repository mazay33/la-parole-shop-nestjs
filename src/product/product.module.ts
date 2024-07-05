import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './controllers/product.public.controller';
import { ProductAdminController } from './controllers/product.admin.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [ProductController, ProductAdminController],
  providers: [ProductService],
  imports: [CacheModule.register()],
})
export class ProductModule {}
