import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  @Post('create-batch')
  createBatch(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentsService.createBatch(createStudentDto);
  }

  @Get('list')
  findAll(
    @Query() filter: FilterStudentDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.studentsService.findAll(filter, pageOptionsDto);
  }
}
