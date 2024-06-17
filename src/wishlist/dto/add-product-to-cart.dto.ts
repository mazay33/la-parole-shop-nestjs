import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class AddProductToWishlistDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(99)
  count: number;
}
