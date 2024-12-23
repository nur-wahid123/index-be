import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SemesterReportService } from './semester-report.service';
import {
  CreateBatchSemesterReportDto,
  CreateSemesterReportDto,
} from './dto/create-semester-report.dto';
import { JwtAuthGuard } from 'src/commons/guards/jwt-auth.guard';
import { QueryGetStudentDto } from './dto/query-get-student.dto';
import { ResponseInterceptor } from 'src/commons/interceptors/response.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('semester-report')
@UseInterceptors(new ResponseInterceptor(), ClassSerializerInterceptor)
export class SemesterReportController {
  constructor(private readonly semesterReportService: SemesterReportService) {}

  @Get('list')
  async getSemesterReportList() {
    return await this.semesterReportService.getSemesterReportList();
  }

  @Get('student/detail/:id')
  async getStudentDetailReport(
    @Param('id') id: string,
    @Query() queryGetStudent: QueryGetStudentDto,
  ) {
    return this.semesterReportService.getStudentReport(+id, queryGetStudent);
  }

  @Post('create')
  async createSemesterReport(@Body() body: CreateSemesterReportDto) {
    return await this.semesterReportService.createSemesterReport(body);
  }

  @Post('create/batch')
  async createBatchSemesterReport(@Body() body: CreateBatchSemesterReportDto) {
    return await this.semesterReportService.createBatchSemesterReport(body);
  }

  @Delete('delete-reports')
  deleteReports() {
    return this.semesterReportService.deleteReports();
  }
}
