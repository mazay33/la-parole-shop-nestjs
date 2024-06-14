import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductInfoDto {
  @ApiProperty({
    example: 'Product Title',
    description: 'The title of the product',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Product description',
    description: 'The description of the product',
  })
  @IsString()
  description: string;
}
