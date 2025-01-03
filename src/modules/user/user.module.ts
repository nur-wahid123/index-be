import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/repositories/user.repository';
import HashPassword from 'src/commons/utils/hash-password.util';
import { JwtModule } from '@nestjs/jwt';
import { SchoolProfileRepository } from 'src/repositories/school-profile.repository';

@Module({
  providers: [
    UserService,
    UserRepository,
    HashPassword,
    SchoolProfileRepository,
  ],
  controllers: [UserController],
  imports: [
    JwtModule.register({
      secret: process.env.USER_KEY_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class UserModule {}
