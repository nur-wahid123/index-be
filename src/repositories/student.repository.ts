import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Bank } from '../entities/bank.entity';
import { Education } from '../entities/education.entity';
import { Parents } from '../entities/parents.entity';
import { Guardian } from '../entities/guardian.entity';
import { Income } from '../entities/income.entity';
import { Job } from '../entities/job.entity';
import { KindOfStay } from '../entities/kindofstay.entity';
import { Religion } from '../entities/religion.entity';
import { Student } from '../entities/student.entity';
import { SubDistrict } from '../entities/subdistrict.entity';
import { Transportation } from '../entities/transportation.entity';
import { CreateStudentDto } from '../modules/students/dto/create-student.dto';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { FilterStudentDto } from '../modules/students/dto/filter-student.dto';
import { PageOptionsDto } from '../commons/dto/page-option.dto';
import { ClassEntity } from 'src/entities/class.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private readonly dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  /**
   * Find all students with the given filter
   * @param filter - a filter student dto
   * @returns Promise of an array of Student objects
   */
  async findAll(filter: FilterStudentDto, pageOptionsDto: PageOptionsDto) {
    try {
      const { take, skip, order } = pageOptionsDto;
      const qb = this.dataSource
        .createQueryBuilder(Student, 'student')
        .leftJoin('student.religion', 'religion')
        .leftJoin('student.mother', 'mother')
        .leftJoin('student.father', 'father')
        .leftJoin('student.studentClass', 'studentClass')
        .leftJoin('student.semesterReports', 'semesterReports')
        .select([
          'student.id',
          'student.name',
          'student.studentSchoolId',
          'student.studentNationalId',
        ])
        .addSelect(['religion.name', 'religion.id'])
        .addSelect(['studentClass.name', 'studentClass.id'])
        .where((qb) => {
          this.applyFilters(qb, filter);
        })
        .skip(skip)
        .take(take);
      qb.orderBy('student.id', order);
      const result = await qb.getManyAndCount();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  applyFilters(qb: SelectQueryBuilder<Student>, filter: FilterStudentDto) {
    const { search, name, studentSchoolId } = filter;

    if (search) {
      qb.andWhere('LOWER(student.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (name) {
      qb.andWhere('LOWER(student.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (studentSchoolId) {
      qb.andWhere('student.student_school_id = :studentSchoolId', {
        studentSchoolId,
      });
    }
  }

  async createBatch(createStudentDto: CreateStudentDto[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      for (let i = 0; i < createStudentDto.length; i++) {
        const student = createStudentDto[i];
        let newStudent = await queryRunner.manager.findOne(Student, {
          where: { studentNationalId: student.studentNationalId },
          select: { name: true },
        });
        if (!newStudent) {
          newStudent = new Student();
        }
        newStudent.name = student.name;
        newStudent.studentSchoolId = student.studentSchoolId;
        newStudent.gender = student.gender;
        newStudent.studentNationalId = student.studentNationalId;
        if (student.placeOfBirth) {
          newStudent.placeOfBirth = student.placeOfBirth;
        }
        if (student.dateOfBirth) {
          newStudent.dateOfBirth = new Date(student.dateOfBirth);
        }
        if (student.nik) {
          newStudent.nik = student.nik;
        }
        if (student.religion) {
          let religion = await queryRunner.manager.findOne(Religion, {
            where: { name: student.religion },
          });
          if (!religion) {
            religion = new Religion();
            religion.name = student.religion;
            await queryRunner.manager.save(religion);
          }
          newStudent.religion = religion;
        }
        if (student.address) {
          newStudent.address = student.address;
        }
        if (student.hamlet) {
          newStudent.hamlet = student.hamlet;
        }
        if (student.ward) {
          newStudent.ward = student.ward;
        }
        if (student.subDistrict) {
          let subDistrict = await queryRunner.manager.findOne(SubDistrict, {
            where: { name: student.subDistrict },
          });
          if (!subDistrict) {
            subDistrict = new SubDistrict();
            subDistrict.name = student.subDistrict;
            await queryRunner.manager.save(subDistrict);
          }
          newStudent.subDistrict = subDistrict;
        }
        if (student.postalCode) {
          newStudent.postalCode = student.postalCode;
        }
        if (student.kindOfStay) {
          let kindOfStay = await queryRunner.manager.findOne(KindOfStay, {
            where: { name: student.kindOfStay },
          });
          if (!kindOfStay) {
            kindOfStay = new KindOfStay();
            kindOfStay.name = student.kindOfStay;
            await queryRunner.manager.save(kindOfStay);
          }
          newStudent.kindOfStay = kindOfStay;
        }
        if (student.transportation) {
          let transportation = await queryRunner.manager.findOne(
            Transportation,
            { where: { name: student.transportation } },
          );
          if (!transportation) {
            transportation = new Transportation();
            transportation.name = student.transportation;
            await queryRunner.manager.save(transportation);
          }
          newStudent.transportation = transportation;
        }
        if (student.telephone) {
          newStudent.telephone = student.telephone;
        }
        if (student.phoneNumber) {
          newStudent.phoneNumber = student.phoneNumber;
        }
        if (student.email) {
          newStudent.email = student.email;
        }
        if (student.skhun) {
          newStudent.skhun = student.skhun;
        }
        if (typeof student.isKps === 'boolean') {
          newStudent.isKps = student.isKps;
        }
        if (student.kpsId) {
          newStudent.kpsId = student.kpsId;
        }
        if (student.father.name) {
          let fatherStudent: Parents;
          if (student.father.nik) {
            fatherStudent = await queryRunner.manager.findOne(Parents, {
              where: { nik: student.father.nik },
            });
          }
          if (!fatherStudent) {
            fatherStudent = new Parents();
            fatherStudent.nik = student.father.nik;
            fatherStudent.name = student.father.name;
            fatherStudent.yearOfBirth = student.father.yearOfBirth;
            let education = await queryRunner.manager.findOne(Education, {
              where: { name: student.father.education },
            });
            if (!education) {
              education = new Education();
              education.name = student.father.education;
              await queryRunner.manager.save(education);
            }
            fatherStudent.education = education;
            let job = await queryRunner.manager.findOne(Job, {
              where: { name: student.father.job },
            });
            if (!job) {
              job = new Job();
              job.name = student.father.job;
              await queryRunner.manager.save(job);
            }
            fatherStudent.job = job;
            let income = await queryRunner.manager.findOne(Income, {
              where: { name: student.father.income },
            });
            if (!income) {
              income = new Income();
              income.name = student.father.income;
              await queryRunner.manager.save(income);
            }
            fatherStudent.income = income;

            await queryRunner.manager.save(fatherStudent);
          }
          newStudent.father = fatherStudent;
        }
        if (student.mother.name) {
          let motherStudent: Parents;
          if (student.mother.nik) {
            motherStudent = await queryRunner.manager.findOne(Parents, {
              where: { nik: student.mother.nik },
            });
          }
          if (!motherStudent) {
            motherStudent = new Parents();
            motherStudent.nik = student.mother.nik;
            motherStudent.name = student.mother.name;
            motherStudent.yearOfBirth = student.mother.yearOfBirth;
            let education = await queryRunner.manager.findOne(Education, {
              where: { name: student.mother.education },
            });
            if (!education) {
              education = new Education();
              education.name = student.mother.education;
              await queryRunner.manager.save(education);
            }
            motherStudent.education = education;
            let job = await queryRunner.manager.findOne(Job, {
              where: { name: student.mother.job },
            });
            if (!job) {
              job = new Job();
              job.name = student.mother.job;
              await queryRunner.manager.save(job);
            }
            motherStudent.job = job;
            let income = await queryRunner.manager.findOne(Income, {
              where: { name: student.mother.income },
            });
            if (!income) {
              income = new Income();
              income.name = student.mother.income;
              await queryRunner.manager.save(income);
            }
            motherStudent.income = income;

            await queryRunner.manager.save(motherStudent);
          }
          newStudent.mother = motherStudent;
        }
        if (student.guardian.name) {
          let guardianStudent: Parents;
          if (student.guardian.nik) {
            guardianStudent = await queryRunner.manager.findOne(Guardian, {
              where: { nik: student.guardian.nik },
            });
          }
          if (!guardianStudent) {
            guardianStudent = new Guardian();
            guardianStudent.nik = student.guardian.nik;
            guardianStudent.name = student.guardian.name;
            guardianStudent.yearOfBirth = student.guardian.yearOfBirth;
            let education = await queryRunner.manager.findOne(Education, {
              where: { name: student.guardian.education },
            });
            if (!education) {
              education = new Education();
              education.name = student.guardian.education;
              await queryRunner.manager.save(education);
            }
            guardianStudent.education = education;
            let job = await queryRunner.manager.findOne(Job, {
              where: { name: student.guardian.job },
            });
            if (!job) {
              job = new Job();
              job.name = student.guardian.job;
              await queryRunner.manager.save(job);
            }
            guardianStudent.job = job;
            let income = await queryRunner.manager.findOne(Income, {
              where: { name: student.guardian.income },
            });
            if (!income) {
              income = new Income();
              income.name = student.guardian.income;
              await queryRunner.manager.save(income);
            }
            guardianStudent.income = income;

            await queryRunner.manager.save(guardianStudent);
          }
          newStudent.guardian = guardianStudent;
        }
        if (student.studyGroup) {
          let classEntity = await queryRunner.manager.findOne(ClassEntity, {
            where: { name: student.studyGroup },
          });
          if (!classEntity) {
            classEntity = new ClassEntity();
            classEntity.name = student.studyGroup;
            await queryRunner.manager.save(classEntity);
          }
          newStudent.studentClass = classEntity;
        }
        if (student.nationalTestNumber) {
          newStudent.nationalTestNumber = student.nationalTestNumber;
        }
        if (student.graduationSertificateNumber) {
          newStudent.graduationSertificateNumber =
            student.graduationSertificateNumber;
        }
        if (student.isKip) {
          newStudent.isKip = student.isKip;
        }
        if (student.kipId) {
          newStudent.kipId = student.kipId;
        }
        if (student.isNameInKip) {
          newStudent.isNameInKip = student.isNameInKip;
        }
        if (student.kksId) {
          newStudent.kksId = student.kksId;
        }
        if (student.bank) {
          let bank = await queryRunner.manager.findOne(Bank, {
            where: { name: student.bank },
          });
          if (!bank) {
            bank = new Bank();
            bank.name = student.bank;
            await queryRunner.manager.save(bank);
          }
          newStudent.bank = bank;
        }
        if (student.bankAccountNumber) {
          newStudent.bankAccountNumber = student.bankAccountNumber;
        }
        if (student.bankAccountName) {
          newStudent.bankAccountName = student.bankAccountName;
        }
        if (student.isPipWorthy) {
          newStudent.isPipWorthy = student.isPipWorthy;
        }
        if (student.reasonPipWorthy) {
          newStudent.reasonPipWorthy = student.reasonPipWorthy;
        }
        if (student.disability) {
          newStudent.disability = student.disability;
        }
        if (student.juniorSchoolName) {
          newStudent.juniorSchoolName = student.juniorSchoolName;
        }
        if (student.childOrder) {
          newStudent.childOrder = student.childOrder;
        }
        if (student.latitude) {
          newStudent.latitude = student.latitude;
        }
        if (student.longitude) {
          newStudent.longitude = student.longitude;
        }
        if (student.familyCardId) {
          newStudent.familyCardId = student.familyCardId;
        }
        if (student.weight) {
          newStudent.weight = student.weight;
        }
        if (student.height) {
          newStudent.height = student.height;
        }
        if (student.headCircumference) {
          newStudent.headCircumference = student.headCircumference;
        }
        if (student.numberOfSiblings) {
          newStudent.numberOfSiblings = student.numberOfSiblings;
        }
        if (student.distanceFromSchool) {
          newStudent.distanceFromSchool = student.distanceFromSchool;
        }
        await queryRunner.manager.save(newStudent);
      }
      await queryRunner.commitTransaction();
      console.log('success');

      return { msg: 'success' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      // await queryRunner.release()
    }
  }
}
