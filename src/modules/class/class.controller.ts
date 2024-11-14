import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { QueryClassDto } from './dto/query-class.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@UseGuards(JwtAuthGuard)
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  createClass(
    @Body() createClassDto: CreateClassDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.classService.createClass(createClassDto, +payload.sub);
  }

  @Get('list')
  findAllClass(
    @Query() query: QueryClassDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.classService.findAllClass(query, pageOptionsDto);
  }

  @Get('detail/:id')
  findClass(@Param('id') id: string) {
    return this.classService.findClass(+id);
  }

  @Patch('update/:id')
  updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.classService.updateClass(+id, updateClassDto, +payload.sub);
  }

  @Delete('delete/:id')
  removeClass(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.classService.removeClass(+id, +payload.sub);
  }
}
