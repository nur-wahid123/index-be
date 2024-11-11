import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/repositories/user.repository';
import HashPassword from 'src/commons/utils/hash-password.util';

@Module({
  providers: [UserService, UserRepository, HashPassword],
  controllers: [UserController],
})
export class UserModule {}
