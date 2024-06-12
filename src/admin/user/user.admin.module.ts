import { Module } from '@nestjs/common';
import { AdminUserController } from './user.admin.controller';
import { AdminUserService } from './user.admin.service';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
})
export class AdminUserModule {}
