import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/commons/auth/jwt.strategy';
import HashPassword from 'src/commons/utils/hash-password.util';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    HashPassword,
    UserRepository,
  ],
  imports: [
    JwtModule.register({
      secret: process.env.USER_KEY_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
