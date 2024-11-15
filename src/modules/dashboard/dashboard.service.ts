import { Injectable } from '@nestjs/common';
import { ClassEntity } from 'src/entities/class.entity';
import { Student } from 'src/entities/student.entity';
import { StudyGroup } from 'src/entities/study-group.entity';
import { Subject } from 'src/entities/subject.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getData() {
    const query = this.dataSource.createQueryRunner();
    await query.connect();
    try {
      await query.startTransaction();
      const [totalStudents, totalStudyGroups, totalSubjects, totalClasses] =
        await Promise.all([
          query.manager.count(Student),
          query.manager.count(StudyGroup),
          query.manager.count(Subject),
          query.manager.count(ClassEntity),
        ]);
      await query.commitTransaction();
      return {
        total_students: totalStudents,
        total_study_groups: totalStudyGroups,
        total_subjects: totalSubjects,
        total_classes: totalClasses,
      };
    } catch (error) {
      console.log(error);
    } finally {
      await query.release();
    }
  }
}
