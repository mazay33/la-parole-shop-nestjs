import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';

@Module({
  providers: [SizesService],
  controllers: [SizesController]
})
export class SizesModule {}
