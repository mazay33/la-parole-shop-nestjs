import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: UploadService,
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [MulterModule],
})
export class UploadModule {}
