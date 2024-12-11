import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentRepository } from './../../repositories/student.repository';
import { FilterStudentDto } from './dto/filter-student.dto';
import { PageOptionsDto } from './../../commons/dto/page-option.dto';
import { PageMetaDto } from './../../commons/dto/page-meta.dto';
import { PageDto } from './../../commons/dto/page.dto';
import { Response } from 'express';
import { StudentExportPdfUtil } from './util/student-export.pdf.util';

@Injectable()
export class StudentsService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async getReport(studentId: string, userName: string, res: Response) {
    const data = await this.studentRepository.exportStudent(studentId);
    const pdf = new StudentExportPdfUtil(data, userName);
    pdf.generate(res);
  }

  exportStudent(id: string) {
    return this.studentRepository.exportStudent(id);
  }

  createStudent(createStudentDto: CreateStudentDto) {
    return this.studentRepository.createStudentUsingMicroservice(
      createStudentDto,
    );
    // return this.studentRepository.createStudent(createStudentDto);
  }

  createBatch(createStudentDto: CreateStudentDto[]) {
    return this.studentRepository.createBatchStudentUsingMicroservice(
      createStudentDto,
    );
    // return this.studentRepository.createBatch(createStudentDto);
  }

  async findAll(filter: FilterStudentDto, pageOptionsDto: PageOptionsDto) {
    const [entities, itemCount] = await this.studentRepository.findAll(
      filter,
      pageOptionsDto,
    );

    const pageMetaDto = new PageMetaDto({ pageOptionsDto, itemCount });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string) {
    return this.studentRepository.findOneStudent(id);
  }
}
