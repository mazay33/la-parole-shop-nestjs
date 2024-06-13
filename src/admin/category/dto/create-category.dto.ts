import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty()
  @ApiProperty({ example: 'test', description: 'Название категории' })
  name: string;

  @IsString({ message: 'Должно быть строкой' })
  @IsOptional()
  @ApiProperty({ example: 'test', description: 'Описание категории' })
  description?: string;
}
