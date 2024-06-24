import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductService } from 'src/product/product.service';

@Module({
  providers: [CartService, ProductService],
  controllers: [CartController],
})
export class CartModule {}
