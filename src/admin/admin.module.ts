import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/user.admin.module';
import { AdminProductModule } from './product/product.admin.module';

@Module({
  imports: [AdminUserModule, AdminProductModule],
})
export class AdminModule {}
