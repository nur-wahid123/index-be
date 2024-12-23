import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentRepository } from './../../repositories/student.repository';
import { FilterStudentDto } from './dto/filter-student.dto';
import { PageOptionsDto } from './../../commons/dto/page-option.dto';
import { PageMetaDto } from './../../commons/dto/page-meta.dto';
import { PageDto } from './../../commons/dto/page.dto';
import { Response } from 'express';
import * as archiver from 'archiver';
import { StudentExportPdfUtil } from './util/student-export.pdf.util';
import { PassThrough } from 'stream';
import { UpdateStudentClassDto } from './dto/update-class.dto';
import { Student } from 'src/entities/student.entity';
import { ClassEntity } from 'src/entities/class.entity';
import { SchoolProfileRepository } from 'src/repositories/school-profile.repository';

@Injectable()
export class StudentsService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly schoolProfileRepository: SchoolProfileRepository,
  ) {}

  async getReport(studentId: string, userName: string, res: Response) {
    try {
      const data = await this.studentRepository.exportStudent(studentId);
      const schoolProfile = await this.schoolProfileRepository.getProfile();
      const pdf = new StudentExportPdfUtil(data, userName, schoolProfile);
      pdf.generate(res);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error');
      throw error;
    }
  }

  async getReports(filter: FilterStudentDto, userName: string, res: Response) {
    try {
      const data = await this.studentRepository.exportStudents(filter);
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      for (const element of data) {
        const pdfStream = new PassThrough();
        const pdf = new StudentExportPdfUtil(element, userName);

        await pdf.generateStream(pdfStream);

        const fileName = `${element.name}.pdf`;
        archive.append(pdfStream, { name: fileName });
      }

      await archive.finalize();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Internal server error');
      throw error;
    }
  }

  exportStudent(id: string) {
    return this.studentRepository.exportStudent(id);
  }

  createStudent(createStudentDto: CreateStudentDto) {
    return this.studentRepository.createStudent(createStudentDto);
  }

  createBatch(createStudentDto: CreateStudentDto[]) {
    return this.studentRepository.createBatchStudentUsingMicroservice(
      createStudentDto,
    );
  }

  updateClass(updateStudentClass: UpdateStudentClassDto) {
    const student = new Student();
    student.studentNationalId = updateStudentClass.studentNationalId;
    const studentClass = new ClassEntity();
    studentClass.id = updateStudentClass.classId;
    student.studentClass = studentClass;
    return this.studentRepository.updateStudentClass(student);
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
