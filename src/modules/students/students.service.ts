import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from 'src/entities/student.entity';
import { StudentRepository } from 'src/repositories/student.repository';
import { FilterStudentDto } from './dto/filter-student.dto';

@Injectable()
export class StudentsService {
    constructor(private readonly studentRepository: StudentRepository) { }
    createBatch(createStudentDto: CreateStudentDto[]) {
        return this.studentRepository.createBatch(createStudentDto);
    }

    findAll(filter: FilterStudentDto, limit: number) {
        console.log(limit);

        return this.studentRepository.findAll(filter, limit);
    }
}
