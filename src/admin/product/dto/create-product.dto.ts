import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  sku?: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  discount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty()
  stock?: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isAvailable: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  categoryId: number;
}
