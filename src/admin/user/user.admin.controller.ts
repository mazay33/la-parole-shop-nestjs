import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminUserService } from './user.admin.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/get-current-user-role.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Admin User')
@Controller('admin/user')
export class AdminUserController {
  constructor(private userService: AdminUserService) {}

  @Get('list')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: [UserDto],
    description: 'Get all users',
  })
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Get user by id',
  })
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Put(':id/role')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Update user role',
  })
  @ApiBody({ type: UpdateUserRoleDto })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserDto> {
    return await this.userService.updateUserRole(id, updateUserRoleDto.role);
  }
}
