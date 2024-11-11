import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from 'src/entities/student.entity';
import { StudentRepository } from 'src/repositories/student.repository';
import { FilterStudentDto } from './dto/filter-student.dto';
import { PageOptionsDto } from 'src/commons/dto/page-option.dto';
import { PageMetaDto } from 'src/commons/dto/page-meta.dto';
import { PageDto } from 'src/commons/dto/page.dto';

@Injectable()
export class StudentsService {
    constructor(private readonly studentRepository: StudentRepository) { }
    createBatch(createStudentDto: CreateStudentDto[]) {
        return this.studentRepository.createBatch(createStudentDto);
    }

    async findAll(filter: FilterStudentDto, pageOptionsDto:PageOptionsDto) {
        const [entities,itemCount] = await this.studentRepository.findAll(filter, pageOptionsDto);

        const pageMetaDto = new PageMetaDto({pageOptionsDto,itemCount})
        return new PageDto(entities,pageMetaDto)
    }
}
