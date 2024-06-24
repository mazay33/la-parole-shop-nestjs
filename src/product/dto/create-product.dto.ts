import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

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
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  discount: number;

  @ApiProperty({
    example: 50,
    description: 'Количество на складе',
    required: false,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  stock: number;

  @ApiProperty({
    example: true,
    description: 'Наличие продукта',
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    example: 'SKU12345',
    description: 'Артикул продукта',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  sku: string;

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
    example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    description: 'Cup sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  cupSizes: number[];

  @ApiProperty({
    example: [1, 2],
    description: 'Clothing sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  clothingSizes: number[];

  @ApiProperty({
    example: [1, 2],
    description: 'Belt sizes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  beltSizes: number[];
}
