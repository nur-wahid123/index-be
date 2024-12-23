import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Expose } from 'class-transformer';

@Entity('school_profile')
export class SchoolProfile extends BaseEntity {
  @Column({ nullable: true })
  @Expose({ name: 'school_name' })
  schoolName?: string;

  @Column({ nullable: true })
  @Expose({ name: 'address' })
  address?: string;

  @Column({ nullable: true })
  @Expose({ name: 'phone_number' })
  phoneNumber?: string;

  @Column({ nullable: true })
  @Expose({ name: 'email' })
  email?: string;

  @Column({ nullable: true })
  @Expose({ name: 'school_chief_name' })
  schoolChiefName?: string;

  @Column({ nullable: true })
  @Expose({ name: 'school_chief_nip' })
  schoolChiefNip?: string;
}
