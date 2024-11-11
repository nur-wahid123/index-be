import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { Response } from 'express';
import { JwtPayload } from './jwt-payload.interface';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { Token } from 'src/commons/types/token.type';
import { HttpExceptionFilter } from 'src/commons/filters/http-exception.filter';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() req: UserLoginDto): Promise<Token> {
    return this.authService.login(req);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Payload() payload: JwtPayload) {
    return payload;
  }

  @Delete('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.send({ message: 'Logout Successfull' });
  }
}
