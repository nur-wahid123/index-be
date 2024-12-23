import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class updateSchoolProfileDto {
  @IsOptional()
  @IsString()
  @Expose({ name: 'school_name' })
  schoolName: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'address' })
  address: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'email' })
  email: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'school_chief_name' })
  schoolChiefName: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'school_chief_nip' })
  school_chief_nip: string;
}
