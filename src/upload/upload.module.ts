import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: UploadService,
    }),
  ],
  providers: [UploadService],
  exports: [MulterModule],
})
export class UploadModule {}
