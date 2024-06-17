import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ProductVariationDto } from './product-variation.dto';
import { ProductInfoDto } from './product-info.dto';

export class CreateProductDto {
  @ApiProperty({
    example: 'BLACK PEARL',
    description: 'Наименование продукта',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 5700, description: 'Цена продукта' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'Скидка на продукт в процентах',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  discount?: number;

  @ApiProperty({
    example: 50,
    description: 'Количество на складе',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  stock?: number;

  @ApiProperty({
    example: true,
    description: 'Наличие продукта',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: 'SKU12345',
    description: 'Артикул продукта',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 1, description: 'Категория продукта - ID' })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    example: [1, 2],
    description: 'Подкатегории продукта - IDs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  subCategoryIds?: number[];

  @ApiProperty({
    type: [ProductInfoDto],
  })
  @IsOptional()
  @IsArray()
  info?: ProductInfoDto[];

  @ApiProperty({
    type: [ProductVariationDto],
  })
  @IsOptional()
  @IsArray()
  variations?: ProductVariationDto[];

  @ApiProperty({ example: [1, 2], description: 'Cup sizes', required: false })
  @IsOptional()
  @IsArray()
  cup_sizes?: number[];

  @ApiProperty({
    example: [1, 2],
    description: 'Underbust sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  underbust_sizes?: number[];

  @ApiProperty({
    example: [1, 2],
    description: 'Clothing sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  clothing_sizes?: number[];
}
