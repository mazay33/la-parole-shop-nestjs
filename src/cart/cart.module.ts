import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductService } from 'src/product/product.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [CartService, ProductService],
  controllers: [CartController],
  imports: [CacheModule.register()],
})
export class CartModule {}
