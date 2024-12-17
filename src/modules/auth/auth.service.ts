import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { UserLoginDto } from './dto/login-user.dto';
import HashPassword from 'src/commons/utils/hash-password.util';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/commons/types/token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly hashPassword: HashPassword,
  ) {}

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    const user: User = await this.usersService.findByUsername(
      userLoginDto.username,
    );

    if (
      userLoginDto !== undefined &&
      user &&
      (await this.hashPassword.compare(userLoginDto.password, user.password))
    ) {
      const result = user;
      delete result.password;
      return result;
    }
    throw new ForbiddenException('Username Or Password are incorrect');
  }

  getProfile(userId: number) {
    return this.usersService.findById(userId);
  }

  async login(dto: UserLoginDto): Promise<Token> {
    try {
      const user: User = await this.usersService.findByUsername(dto.username);
      if (!user) {
        throw new ForbiddenException('Username Or Password are incorrect');
      }

      const payload = await this.validateUser(dto);

      const token = await this.getToken(payload);
      return token;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getToken(user: User): Promise<Token> {
    const payload = {
      username: user.username,
      name: user.name,
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.USER_KEY_SECRET,
      expiresIn: process.env.EXPIRY_TOKEN_TIME || '2h',
    });
    return { access_token: token };
  }

  logout() {
    return { message: 'logout success' };
  }
}
