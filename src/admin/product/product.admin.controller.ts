import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminProductService } from './product.admin.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductEntity } from './entity/product.entity';

@ApiTags('Admin Product')
@Controller('admin/product')
export class AdminProductController {
  constructor(private productService: AdminProductService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        sku: {
          type: 'string',
        },
        price: {
          type: 'number',
        },
        discount: {
          type: 'number',
        },
        stock: {
          type: 'number',
        },
        isAvailable: {
          type: 'boolean',
        },
        categoryId: {
          type: 'number',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    // Добавляем путь к загруженному файлу в DTO
    createProductDto.img = [file.filename];
    return await this.productService.createProduct(createProductDto);
  }
}
