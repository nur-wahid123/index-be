import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SchoolProfile } from 'src/entities/school-profile.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SchoolProfileRepository extends Repository<SchoolProfile> {
  async updateSchoolProfile(schoolProfile: SchoolProfile) {
    const qR = this.dataSource.createQueryRunner();
    await qR.connect();
    try {
      await qR.startTransaction();
      await qR.manager.save(schoolProfile);
      await qR.commitTransaction();
      return schoolProfile;
    } catch (error) {
      console.log(error);
      await qR.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await qR.release();
    }
  }
  constructor(private readonly dataSource: DataSource) {
    super(SchoolProfile, dataSource.createEntityManager());
  }

  getProfile() {
    return this.findOne({ where: { id: 1 } });
  }
}
