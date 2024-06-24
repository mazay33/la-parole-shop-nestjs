import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductConfigurationDto {
  @ApiProperty({
    example: 'SKU12345',
    description: 'The SKU of the product',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 100,
    description: 'The price of the product',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Test',
  })
  @IsString()
  name: string;
}
