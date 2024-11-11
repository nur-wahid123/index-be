import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Expose } from 'class-transformer';
import { Gender } from 'src/enums/gender.enum';
import { Religion } from './religion.entity';
import { SubDistrict } from './subdistrict.entity';
import { KindOfStay } from './kindofstay.entity';
import { Transportation } from './transportation.entity';
import { Guardian } from './guardian.entity';
import { StudyGroup } from './study-group.entity';
import { Bank } from './bank.entity';
import { Parents } from './parents.entity';
import { SemesterReport } from './semester.entity';

@Entity('students')
export class Student extends BaseEntity {
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: true })
    @Expose({ name: 'student_school_id' })
    studentSchoolId!: string;

    @Column({ nullable: false, enum: Gender })
    gender!: Gender;

    @Column({ nullable: false, unique: true })
    @Expose({ name: 'student_national_id' })
    studentNationalId!: string;

    @Column({ nullable: true })
    @Expose({ name: 'place_of_birth' })
    placeOfBirth: string;

    @Column({ nullable: true })
    @Expose({ name: 'date_of_birth' })
    dateOfBirth: Date;

    @Column({ nullable: false, type: 'boolean', default: true })
    @Expose({ name: 'is_active' })
    isActive: boolean;

    @Column({ nullable: true, unique: true })
    nik?: string;

    @ManyToOne(() => Religion, (religion) => religion.students, {
        nullable: true,
    })
    religion: Religion;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    hamlet: string;

    @Column({ nullable: true })
    ward?: string;

    @ManyToOne(() => SubDistrict, (subDistrict) => subDistrict.students, {
        nullable: true,
    })
    subDistrict?: SubDistrict;

    @Column({ nullable: true })
    @Expose({ name: 'postal_code' })
    postalCode?: number;

    @ManyToOne(() => KindOfStay, (kindOfStay) => kindOfStay.students, {
        nullable: true,
    })
    kindOfStay?: KindOfStay;

    @ManyToOne(
        () => Transportation,
        (transportation) => transportation.students,
        { nullable: true },
    )
    transportation?: Transportation;

    @Column({ nullable: true })
    telephone?: string;

    @Column({ nullable: true })
    @Expose({ name: 'phone_number' })
    phoneNumber?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    skhun?: string;

    @Column({ nullable: false, type: 'boolean', default: false })
    @Expose({ name: 'is_kps' })
    isKps!: boolean;

    @Column({ nullable: true })
    @Expose({ name: 'kps_id' })
    kpsId?: string;

    @ManyToOne(() => Parents, (parent) => parent.students, { nullable: true })
    father: Parents;

    @ManyToOne(() => Parents, (parent) => parent.students, { nullable: true })
    mother: Parents;

    @ManyToOne(() => Guardian, (guardian) => guardian.students, {
        nullable: true,
    })
    guardian: Guardian;

    @ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.students, {
        nullable: true,
    })
    @Expose({ name: 'study_group' })
    studyGroup: StudyGroup;

    @Column({ nullable: true })
    @Expose({ name: 'national_test_number' })
    nationalTestNumber?: string;

    @Column({ nullable: true })
    @Expose({ name: 'graduation_sertificate_number' })
    graduationSertificateNumber?: string;

    @Column({ nullable: false, type: 'boolean', default: false })
    isKip?: boolean;

    @Column({ nullable: true })
    @Expose({ name: 'kip_id' })
    kipId?: string;

    @Column({ nullable: true })
    @Expose({ name: 'is_name_in_kip' })
    isNameInKip?: boolean;

    @Column({ nullable: true })
    @Expose({ name: 'kks_id' })
    kksId?: string;

    @Column({ nullable: true })
    @Expose({ name: 'birth_certificate_registration_id' })
    birthCertificateRegistrationId?: string;

    @ManyToOne(() => Bank, (bank) => bank.students, { nullable: true })
    bank: Bank;

    @Column({ nullable: true })
    @Expose({ name: 'bank_account_number' })
    bankAccountNumber?: string;

    @Column({ nullable: true })
    @Expose({ name: 'bank_account_name' })
    bankAccountName?: string;

    @Column({ nullable: false, default: false, type: 'boolean' })
    @Expose({ name: 'is_pip_worthy' })
    isPipWorthy: boolean;

    @Column({ nullable: true })
    @Expose({ name: 'reason_pip_worthy' })
    reasonPipWorthy?: string;

    @Column({ nullable: true })
    disability?: string;

    @Column({ nullable: true })
    @Expose({ name: 'junior_school_name' })
    juniorSchoolName?: string;

    @Column({ nullable: true })
    @Expose({ name: 'child_order' })
    childOrder?: number;

    @Column({ nullable: true })
    latitude?: string;

    @Column({ nullable: true })
    longitude?: string;

    @Column({ nullable: true })
    @Expose({ name: 'family_card_id' })
    familyCardId?: string;

    @Column({ nullable: true })
    weight?: number;

    @Column({ nullable: true })
    height?: number;

    @Column({ nullable: true })
    @Expose({ name: 'head_circumference' })
    headCircumference?: number;

    @Column({ nullable: true })
    @Expose({ name: 'number_of_siblings' })
    numberOfSiblings?: number;

    @Column({ nullable: true })
    @Expose({ name: 'distance_from_school' })
    distanceFromSchool?: number;

    /**
     * Relations
     */

    @OneToMany(() => SemesterReport, (semesterReport) => semesterReport.student)
    semesterReports: SemesterReport[];
}
