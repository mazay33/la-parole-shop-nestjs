import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  role: string;

  @Expose()
  @ApiProperty()
  activationLink: string;

  @Expose()
  @ApiProperty()
  isActivated: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updateAt: Date;

  @Exclude()
  hash: string;

  @Exclude()
  hashedRt: string;

  @Exclude()
  password: string;
}
