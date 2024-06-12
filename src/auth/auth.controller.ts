import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import type { Tokens } from './types';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      example: {
        access_token: 'string',
        refresh_token: 'string',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User with the given email already exists',
    schema: {
      example: {
        statusCode: 400,
        message: 'User with the given email already exists',
      },
    },
  })
  registration(@Body() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.registration(userDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'password123',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'string',
        refresh_token: 'string',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or password',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid email or password',
      },
    },
  })
  login(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<Tokens> {
    return this.authService.login(email, password);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    schema: {
      example: {
        access_token: 'string',
        refresh_token: 'string',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Invalid refresh token',
    schema: {
      example: {
        statusCode: 403,
        message: 'Invalid refresh token',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiBasicAuth()
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: true,
    },
  })
  @ApiBasicAuth()
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Get('me')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Get current user successful',
    schema: {
      example: {
        id: 'string',
        email: 'string',
        username: 'string',
      },
    },
  })
  @ApiBasicAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  me(@GetCurrentUserId() userId: string) {
    return this.authService.me(userId);
  }
}
