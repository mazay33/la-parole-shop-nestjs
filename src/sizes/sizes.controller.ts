import { Controller, Get } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('Sizes')
@Public()
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @ApiResponse({
    status: 200,
    description: 'Список размеров',
  })
  @Get('list')
  getSizesList() {
    return this.sizesService.getSizesList();
  }
}
