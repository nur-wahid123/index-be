import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Subject } from "src/entities/subject.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class SubjectRepository extends Repository<Subject> {
    constructor(private readonly dataSource: DataSource) {
        super(Subject, dataSource.createEntityManager())
    }

    async createBatch(createSubjectDto: Subject[]) {
        const queryRunner = this.dataSource.createQueryRunner();
        queryRunner.connect();
        try {
            queryRunner.startTransaction();
            for (let i = 0; i < createSubjectDto.length; i++) {
                const subject = createSubjectDto[i]
                let newSubject = await queryRunner.manager.findOne(Subject, { where: { name: subject.name } })
                if (newSubject) {
                    continue
                }
                newSubject = new Subject()
                newSubject.name = subject.name
                await queryRunner.manager.save(newSubject)
            }
            await queryRunner.commitTransaction();
            return { msg: 'success' }
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(err)
        } finally {
            await queryRunner.release();
        }
    }
}