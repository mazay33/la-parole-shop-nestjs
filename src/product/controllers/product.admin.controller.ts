import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '../product.service';
import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/upload/config/multer-config';
import { Product, ProductConfiguration } from '@prisma/client';
import { ProductConfigurationDto } from '../dto/product-configuration.dto';

@ApiTags('Admin Product')
@Controller('admin/product')
@ApiBearerAuth()
export class ProductAdminController {
  constructor(private productService: ProductService) {}

  @Post('')
  @ApiOperation({ summary: 'Создание нового продукта' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Продукт успешно создан',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление выбранного продукта' })
  @ApiResponse({
    status: 200,
    description: 'Продукт успешно удален',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ id: number }> {
    const ProductId = await this.productService.deleteProduct(id);

    return { id: ProductId };
  }

  @Post('/:id/configuration')
  @ApiOperation({ summary: 'Добавление конфигурации для продукта' })
  @ApiBody({ type: ProductConfigurationDto })
  @ApiResponse({
    status: 200,
    description: 'The configuration have been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProductConfiguration(
    @Param('id', ParseIntPipe) id: number,
    @Body() productConfigurationDto: ProductConfigurationDto,
  ): Promise<ProductConfiguration> {
    return await this.productService.createProductConfiguration(
      id,
      productConfigurationDto,
    );
  }

  @Put('/:id/configuration/:configurationId')
  @ApiOperation({ summary: 'Обновление конфигурации для продукта' })
  @ApiBody({ type: ProductConfigurationDto })
  @ApiResponse({
    status: 200,
    description: 'The configuration have been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async updateProductConfiguration(
    @Param('id', ParseIntPipe) id: number,
    @Param('configurationId', ParseIntPipe) configurationId: number,
    @Body() productConfigurationDto: Partial<ProductConfigurationDto>,
  ): Promise<ProductConfiguration> {
    return await this.productService.updateProductConfiguration(
      id,
      configurationId,
      productConfigurationDto,
    );
  }

  @Delete('/:id/configuration/:configurationId')
  @ApiOperation({ summary: 'Удаление конфигурации для продукта' })
  @ApiResponse({
    status: 200,
    description: 'The configuration have been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteProductConfiguration(
    @Param('id', ParseIntPipe) id: number,
    @Param('configurationId', ParseIntPipe) configurationId: number,
  ): Promise<ProductConfiguration> {
    return await this.productService.deleteProductConfiguration(
      id,
      configurationId,
    );
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
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async uploadPhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<boolean> {
    if (!files || files.length === 0) {
      throw new Error('Files are not provided');
    }

    const filenames = files.map((file) => file.filename);
    await this.productService.updateProductPhoto(id, filenames);

    return true;
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
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async replacePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('photoId', ParseIntPipe) photoId: number,
    @UploadedFiles() file: Express.Multer.File[],
  ): Promise<boolean> {
    if (!file || file.length === 0) {
      throw new Error('File is not provided');
    }

    const filename = file[0].filename;
    await this.productService.replaceProductPhoto(id, photoId, filename);

    return true;
  }

  @Delete(':id/photo/:photoId')
  @ApiOperation({ summary: 'Удаление определенной фотографии продукта' })
  @ApiResponse({
    status: 200,
    description: 'The photo has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deletePhoto(
    @Param('id', ParseIntPipe) id: number,
    @Param('photoId', ParseIntPipe) photoId: number,
  ): Promise<boolean> {
    await this.productService.deleteProductPhoto(id, photoId);

    return true;
  }

  @Delete(':id/photo')
  @ApiOperation({ summary: 'Удаление всех фотографий продукта' })
  @ApiResponse({
    status: 200,
    description: 'All photos have been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteAllPhotos(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    await this.productService.deleteAllProductPhotos(id);

    return true;
  }
}
