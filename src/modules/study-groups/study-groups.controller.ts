import { Body, Controller, Get, Post } from '@nestjs/common';
import { StudyGroupsService } from './study-groups.service';
import { BatchLinkSubjectDto, LinkSubjectDto } from './dto/link-subject.dto';

@Controller('study-groups')
export class StudyGroupsController {
  constructor(private readonly studyGroupsService: StudyGroupsService) { }

  @Post('link-subject')
  linkSubject(@Body() subjectDto: LinkSubjectDto) {
    return this.studyGroupsService.linkSubject(subjectDto);
  }

  @Post('detach-subject')
  detachSubject(@Body() subjectDto: LinkSubjectDto) {
    return this.studyGroupsService.detachSubject(subjectDto);
  }

  @Post('link-batch-subject')
  linkBatchSubject(@Body() subjectDto: BatchLinkSubjectDto) {
    return this.studyGroupsService.linkBatchSubject(subjectDto);
  }

  @Get()
  findAll() {
    return this.studyGroupsService.findAll();
  }
}
