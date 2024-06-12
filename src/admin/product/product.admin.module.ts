import { Module } from '@nestjs/common';
import { AdminProductController } from './product.admin.controller';
import { AdminProductService } from './product.admin.service';

@Module({
  controllers: [AdminProductController],
  providers: [AdminProductService],
})
export class AdminProductModule {}
