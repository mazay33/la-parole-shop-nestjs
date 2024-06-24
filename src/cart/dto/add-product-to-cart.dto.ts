import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class AddProductToCartDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsOptional()
  configurataionId?: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsOptional()
  cupSizeId?: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsOptional()
  clothingSizeId?: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsOptional()
  beltSizeId?: number;
}
