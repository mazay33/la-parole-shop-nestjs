import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role: Role;
}
