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
import { multerConfig } from 'src/upload/config/multer-config';
import { RolesGuard } from 'src/common/guards';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/get-current-user-role.decorator';
import { UpdateProductDto } from './dto/update-product.dro';

@ApiTags('Admin Product')
@Controller('admin/product')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminProductController {
  constructor(private productService: AdminProductService) {}

  @Post('')
  @ApiOperation({ summary: 'Создание нового продукта' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Продукт успешно создан',
    type: ProductEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.createProduct(createProductDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление продукта' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Продукт успешно обновлен',
    type: ProductEntity,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление выбранного продукта' })
  @ApiResponse({
    status: 200,
    description: 'Продукт успешно удален',
    type: ProductEntity,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return await this.productService.deleteProduct(id);
  }

  @Post(':id/photo')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @ApiOperation({ summary: 'Добавление фотографий для продукта' })
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
  @ApiOperation({ summary: 'Обновление определенной фотографии продукта' })
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
  @ApiOperation({ summary: 'Удаление определенной фотографии продукта' })
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

  @Delete(':id/photo')
  @ApiOperation({ summary: 'Удаление всех фотографий продукта' })
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
