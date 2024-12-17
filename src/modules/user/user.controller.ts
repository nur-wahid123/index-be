import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';
import { SetRole } from 'src/commons/decorators/role.decorator';
import { Roles } from 'src/enums/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { FilterDto } from 'src/commons/dto/filter.dto';
import { PermissionGuard } from 'src/commons/guards/permission.guard';

@UseGuards(JwtAuthGuard, PermissionGuard)
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SetRole(Roles.SUPERADMIN)
  @Get('list')
  findAll(@Query() query: FilterDto, @Query() pageOptionsDto: PageOptionsDto) {
    return this.userService.findAllUser(query, pageOptionsDto);
  }

  @SetRole(Roles.SUPERADMIN)
  @Post('create')
  create(@Body() createUserDto: CreateUserDto, @Payload() payload: JwtPayload) {
    return this.userService.createUser(createUserDto, payload.sub);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id);
  }

  @SetRole(Roles.ADMIN, Roles.SUPERADMIN)
  @Patch('self-update')
  selfUpdate(
    @Payload() payload: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(payload.sub, updateUserDto, payload.sub);
  }

  @SetRole(Roles.SUPERADMIN)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Payload() payload: JwtPayload,
  ) {
    try {
      return this.userService.updateUser(+id, updateUserDto, payload.sub);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error bro');
    }
  }

  @SetRole(Roles.SUPERADMIN)
  @Delete('remove/:id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.userService.removeUser(+id, payload.sub);
  }
}
