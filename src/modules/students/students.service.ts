import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from 'src/entities/student.entity';
import { StudentRepository } from 'src/repositories/student.repository';

@Injectable()
export class StudentsService {
    constructor(private readonly studentRepository: StudentRepository) { }
    createBatch(createStudentDto: CreateStudentDto[]) {
        return this.studentRepository.createBatch(createStudentDto);
    }
}
