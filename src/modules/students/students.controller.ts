import { Body, Controller, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {
  }
  @Post('create-batch')
  createBatch(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentsService.createBatch(createStudentDto);
  }
}
