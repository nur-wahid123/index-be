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
import { StudyGroupsService } from './study-groups.service';
import { BatchLinkSubjectDto, LinkSubjectDto } from './dto/link-subject.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { FilterDto } from 'src/commons/dto/filter.dto';
@UseGuards(JwtAuthGuard)
@Controller('study-groups')
export class StudyGroupsController {
  constructor(private readonly studyGroupsService: StudyGroupsService) {}

  @Post('create')
  create(
    @Body() createStudyGroupDto: CreateStudyGroupDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.studyGroupsService.createStudyGroup(
      createStudyGroupDto,
      +payload.sub,
    );
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() createStudyGroupDto: CreateStudyGroupDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.studyGroupsService.updateStudyGroup(
      +id,
      createStudyGroupDto,
      +payload.sub,
    );
  }

  @Post('link-subject')
  linkSubject(
    @Body() subjectDto: LinkSubjectDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.studyGroupsService.linkSubject(subjectDto, +payload.sub);
  }

  @Post('detach-subject')
  detachSubject(
    @Body() subjectDto: LinkSubjectDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.studyGroupsService.detachSubject(subjectDto, +payload.sub);
  }

  @Post('link-batch-subject')
  linkBatchSubject(
    @Body() subjectDto: BatchLinkSubjectDto,
    @Payload() payload: JwtPayload,
  ) {
    return this.studyGroupsService.linkBatchSubject(subjectDto, +payload.sub);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.studyGroupsService.findOne(+id);
  }

  @Get('list')
  findAll(@Query() query: FilterDto, @Query() pageOptionsDto: PageOptionsDto) {
    return this.studyGroupsService.findAll(query, pageOptionsDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Payload() payload: JwtPayload) {
    return this.studyGroupsService.remove(+id, +payload.sub);
  }
}
