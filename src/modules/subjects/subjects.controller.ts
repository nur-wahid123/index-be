import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateBatchSubjectDto } from './dto/create-batch-subject.dto';
import { JwtAuthGuard } from '../../commons/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('create-batch')
  batchCreate(@Body() createSubjectDto: CreateBatchSubjectDto[]) {
    return this.subjectsService.batchCreate(createSubjectDto);
  }

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }
}
