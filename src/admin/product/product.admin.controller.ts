import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { multerConfig } from 'src/upload/config/multer-config'; // Импортируем конфигурацию Multer
import { RolesGuard } from 'src/common/guards';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/get-current-user-role.decorator';

@ApiTags('Admin Product')
@Controller('admin/product')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminProductController {
  constructor(private productService: AdminProductService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.createProduct(createProductDto);
  }

  @Put(':id/upload')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @ApiOperation({ summary: 'Upload photos for the product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The photos have been successfully uploaded.',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ProductEntity> {
    if (!files || files.length === 0) {
      throw new Error('Files are not provided');
    }

    const filenames = files.map((file) => file.filename);
    return await this.productService.updateProductPhoto(id, filenames);
  }

  @Put(':id/photo/:photoId')
  @UseInterceptors(FilesInterceptor('file', 1, multerConfig))
  @ApiOperation({ summary: 'Replace a specific photo for the product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully replaced.',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async replacePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('photoId', ParseIntPipe) photoId: number,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<ProductEntity> {
    if (!file || file.length === 0) {
      throw new Error('File is not provided');
    }

    const filename = file[0].filename;
    return await this.productService.replaceProductPhoto(id, photoId, filename);
  }

  @Delete(':id/photo/:photoId')
  @ApiOperation({ summary: 'Delete a specific photo for the product' })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully deleted.',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deletePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('photoId', ParseIntPipe) photoId: number,
  ): Promise<ProductEntity> {
    return await this.productService.deleteProductPhoto(id, photoId);
  }

  @Delete(':id/photos')
  @ApiOperation({ summary: 'Delete all photos for the product' })
  @ApiResponse({
    status: 200,
    description: 'All photos have been successfully deleted.',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteAllPhotos(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return await this.productService.deleteAllProductPhotos(id);
  }
}
