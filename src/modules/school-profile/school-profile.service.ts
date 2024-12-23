import { Injectable } from '@nestjs/common';
import { SchoolProfileRepository } from 'src/repositories/school-profile.repository';
import { updateSchoolProfileDto } from './dto/update-school-profile.dto';
import { SchoolProfile } from 'src/entities/school-profile.entity';

@Injectable()
export class SchoolProfileService {
  constructor(
    private readonly schoolProfileRepository: SchoolProfileRepository,
  ) {}

  getProfile() {
    return this.schoolProfileRepository.getProfile();
  }

  updateProfile(updateSchoolProfileDto: updateSchoolProfileDto, id: number) {
    const {
      address,
      email,
      phoneNumber,
      schoolChiefName,
      schoolName,
      school_chief_nip,
    } = updateSchoolProfileDto;
    const schoolProfile = new SchoolProfile();
    schoolProfile.id = 1;
    if (address) schoolProfile.address = address;
    if (email) schoolProfile.email = email;
    if (phoneNumber) schoolProfile.phoneNumber = phoneNumber;
    if (schoolChiefName) schoolProfile.schoolChiefName = schoolChiefName;
    if (schoolName) schoolProfile.schoolName = schoolName;
    if (school_chief_nip) schoolProfile.schoolChiefNip = school_chief_nip;
    schoolProfile.updatedBy = id;
    return this.schoolProfileRepository.updateSchoolProfile(schoolProfile);
  }
}
