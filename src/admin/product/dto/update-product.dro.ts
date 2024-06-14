import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    example: 'Updated Product Name',
    description: 'The updated name of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 150,
    description: 'The updated price of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: 20,
    description: 'The updated discount on the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    example: 100,
    description: 'The updated stock quantity of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({
    example: true,
    description: 'Is the product available?',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: 'SKU54321',
    description: 'The updated SKU of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    example: 2,
    description: 'The updated category ID of the product',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({
    example: [2, 3],
    description: 'The updated sub-category IDs of the product',
    required: false,
  })
  @IsOptional()
  @IsArray()
  subCategoryIds?: number[];

  @ApiProperty({
    example: [],
    description: 'Updated product images',
    required: false,
  })
  @IsOptional()
  @IsArray()
  img?: any[];

  @ApiProperty({
    example: [],
    description: 'Updated product info',
    required: false,
  })
  @IsOptional()
  @IsArray()
  info?: any[];

  @ApiProperty({
    example: [],
    description: 'Updated product variations',
    required: false,
  })
  @IsOptional()
  @IsArray()
  variations?: any[];

  @ApiProperty({
    example: [],
    description: 'Updated cup sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  cup_sizes?: any[];

  @ApiProperty({
    example: [],
    description: 'Updated underbust sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  underbust_sizes?: any[];

  @ApiProperty({
    example: [],
    description: 'Updated clothing sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  clothing_sizes?: any[];
}
