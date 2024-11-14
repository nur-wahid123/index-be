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
import { SubjectsService } from './subjects.service';
import {
  CreateBatchSubjectDto,
  CreateSubjectDto,
} from './dto/create-subject.dto';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import QuerySubjectDto from './dto/query-subject.dto';

@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('create')
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.subjectsService.createSubject(createSubjectDto, +payload.sub);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.subjectsService.updateSubject(
      +id,
      updateSubjectDto,
      +payload.sub,
    );
  }
  @Post('create-batch')
  batchCreate(@Body() createSubjectDto: CreateBatchSubjectDto) {
    return this.subjectsService.batchCreate(createSubjectDto);
  }

  @Get('list')
  findAll(
    @Query() query: QuerySubjectDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.subjectsService.findAll(query, pageOptionsDto);
  }

  @Get('detail/:id')
  find(@Param('id') id: string) {
    return this.subjectsService.find(+id);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.subjectsService.removeSubject(+id, +payload.sub);
  }
}
