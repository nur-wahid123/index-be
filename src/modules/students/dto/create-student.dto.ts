import { Gender } from "src/enums/gender.enum";
import { Father } from "./Father";
import { Mother } from "./Mother";
import { Guardian } from "./Guardian";

export class CreateStudentDto {
    name!: string;
    studentSchoolId!: string
    gender!: Gender
    studentNationalId!: string
    placeOfBirth?: string
    dateOfBirth?: string
    nik?: string
    religion?: string
    address?: string
    hamlet?: string
    ward?: string
    subDistrict?: string
    postalCode?: number
    kindOfStay?: string
    transportation?: string
    telephone?: string
    phoneNumber?: string
    email?: string
    skhun?: string
    isKps!: boolean
    kpsId?: string
    father?: Father
    mother?: Mother
    guardian?: Guardian
    studyGroup?: string
    nationalTestNumber?: string
    graduationSertificateNumber?: string
    isKip?: boolean
    kipId?: string
    isNameInKip?: boolean
    kksId?: string
    birthCertificateRegistrationId?: string
    bank?: string
    bankAccountNumber?: string
    bankAccountName?: string
    isPipWorthy?: boolean = false
    reasonPipWorthy?: string
    disability?: string
    juniorSchoolName?: string
    childOrder?: number = 1
    latitude?: string
    longitude?: string
    familyCardId?: string
    weight?: number
    height?: number
    headCircumference?: number
    numberOfSiblings?: number
    distanceFromSchool?: number
}