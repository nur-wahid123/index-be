import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { Payload } from 'src/commons/decorators/payload.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Response } from 'express';
import { UpdateStudentClassDto } from './dto/update-class.dto';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('create-batch')
  createBatch(@Body() createStudentDto: CreateStudentDto[]) {
    return this.studentsService.createBatch(createStudentDto);
  }

  @Delete('delete-all')
  deleteStudent(@Query() filter: FilterStudentDto) {
    return this.studentsService.deleteStudent(filter);
  }

  @Post('create')
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(createStudentDto);
  }

  @Get('list')
  findAll(
    @Query() filter: FilterStudentDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.studentsService.findAll(filter, pageOptionsDto);
  }

  @Patch('update-class')
  updateClass(@Body() updateClassDto: UpdateStudentClassDto) {
    return this.studentsService.updateClass(updateClassDto);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Get('export/:id')
  export(@Param('id') id: string) {
    return this.studentsService.exportStudent(id);
  }

  @Get('report/:code/pdf')
  getReport(
    @Param('code') code: string,
    @Payload() payload: JwtPayload,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices.pdf');
    return this.studentsService.getReport(code, payload.username, res);
  }

  @Get('reports/pdf')
  getReports(
    @Query() filter: FilterStudentDto,
    @Payload() payload: JwtPayload,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=siswa.zip');
    return this.studentsService.getReports(filter, payload.username, res);
  }
}
