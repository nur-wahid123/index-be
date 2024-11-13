import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudyGroupsService } from './study-groups.service';
import { BatchLinkSubjectDto, LinkSubjectDto } from './dto/link-subject.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { CreateStudyGroupDto } from './dto/create-study-group.dto';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
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

  @Get()
  findAll() {
    return this.studyGroupsService.findAll();
  }
}
