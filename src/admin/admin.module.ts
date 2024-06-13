import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/user.admin.module';
import { AdminProductModule } from './product/product.admin.module';
import { CategoryModule } from './category/category.admin.module';

@Module({
  imports: [AdminUserModule, AdminProductModule, CategoryModule],
})
export class AdminModule {}
