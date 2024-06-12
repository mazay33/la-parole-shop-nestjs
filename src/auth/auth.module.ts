import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AtStrategy } from './strategies/as.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
  imports: [forwardRef(() => UsersModule), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AtStrategy, RtStrategy],
})
export class AuthModule {}
