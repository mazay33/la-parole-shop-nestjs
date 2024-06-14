import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminUserService {
  constructor(private prisma: PrismaService) {}

  // async getUserByEmail(email: string): Promise<UserDto> {
  //   const user = await this.prisma.user.findUnique({ where: { email } });
  //   return plainToInstance(UserDto, user);
  // }

  // async getUserById(id: string): Promise<UserDto> {
  //   const user = await this.prisma.user.findUnique({ where: { id } });
  //   return plainToInstance(UserDto, user);
  // }
  // async getUsers() {
  //   const users = await this.prisma.user.findMany();
  //   return plainToInstance(UserDto, users);
  // }

  // async updateUserRole(id: string, role: Role): Promise<UserDto> {
  //   const user = await this.prisma.user.update({
  //     where: { id },
  //     data: { role },
  //   });
  //   return plainToInstance(UserDto, user);
  // }
}
