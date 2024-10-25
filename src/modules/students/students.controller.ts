import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {
  }
  @Post('create-batch')
  createBatch(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentsService.createBatch(createStudentDto);
  }

  @Get()
  findAll(@Query() filter: FilterStudentDto, @Query() limit: { limit: number }) {
    return this.studentsService.findAll(filter, limit.limit);
  }
}
