import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1731306523832 implements MigrationInterface {
    name = 'Init1731306523832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "religions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_5c576192fea37850ec9ed425bfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subdistricts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_6b8edc4fb44648164d0d1635c53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kind_of_stay" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_5bd6ef3c54c7c509510a6b4b052" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "incomes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_d737b3d0314c1f0da5461a55e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parents" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying, "year_of_birth" integer DEFAULT '0', "nik" character varying, "education_id" integer, "job_id" integer, "income_id" integer, CONSTRAINT "UQ_f2fab57cbd55eac6c6aded6654b" UNIQUE ("nik"), CONSTRAINT "PK_9a4dc67c7b8e6a9cb918938d353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "educations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guardians" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying, "year_of_birth" integer DEFAULT '0', "nik" character varying, "education_id" integer, "job_id" integer, "income_id" integer, CONSTRAINT "UQ_c8ac8ecea9cb61bbaf38098c4b6" UNIQUE ("nik"), CONSTRAINT "PK_3dcf02f3dc96a2c017106f280be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "study_groups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_d3c236286b727d74553c7a88dc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "score" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "score_value" numeric NOT NULL, "semester_report_id" integer, "subject_id" integer, CONSTRAINT "PK_1770f42c61451103f5514134078" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "extracurriculars" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_4105c5b8a682fad156773abe80a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "extracurricular_score" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "score" character varying NOT NULL, "semester_report_id" integer, "extracurricular_id" integer, CONSTRAINT "PK_0b67b4bba27f754e554032f12e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."semester_reports_semester_enum" AS ENUM('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII')`);
        await queryRunner.query(`CREATE TABLE "semester_reports" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "semester" "public"."semester_reports_semester_enum" NOT NULL, "schhol_year" character varying NOT NULL, "total_score" integer NOT NULL, "average_score" numeric, "sick_days" integer NOT NULL DEFAULT '0', "absent_days" integer NOT NULL DEFAULT '0', "leave_days" integer NOT NULL DEFAULT '0', "ranking" integer NOT NULL DEFAULT '0', "student_id" integer, CONSTRAINT "PK_1e39cbee8ae91d7505407d7f506" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, "student_school_id" character varying, "gender" character varying NOT NULL, "student_national_id" character varying NOT NULL, "place_of_birth" character varying, "date_of_birth" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT true, "nik" character varying, "address" character varying, "hamlet" character varying, "ward" character varying, "postal_code" integer, "telephone" character varying, "phone_number" character varying, "email" character varying, "skhun" character varying, "is_kps" boolean NOT NULL DEFAULT false, "kps_id" character varying, "national_test_number" character varying, "graduation_sertificate_number" character varying, "is_kip" boolean NOT NULL DEFAULT false, "kip_id" character varying, "is_name_in_kip" boolean, "kks_id" character varying, "birth_certificate_registration_id" character varying, "bank_account_number" character varying, "bank_account_name" character varying, "is_pip_worthy" boolean NOT NULL DEFAULT false, "reason_pip_worthy" character varying, "disability" character varying, "junior_school_name" character varying, "child_order" integer, "latitude" character varying, "longitude" character varying, "family_card_id" character varying, "weight" integer, "height" integer, "head_circumference" integer, "number_of_siblings" integer, "distance_from_school" integer, "religion_id" integer, "sub_district_id" integer, "kind_of_stay_id" integer, "transportation_id" integer, "father_id" integer, "mother_id" integer, "guardian_id" integer, "study_group_id" integer, "bank_id" integer, CONSTRAINT "UQ_34298762ee7bb13bec4fa6afa22" UNIQUE ("student_national_id"), CONSTRAINT "UQ_c1d316c0a628d7457118c638e4c" UNIQUE ("nik"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transportations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_aa9196e984236b169ea172479a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('laki-laki', 'perempuan')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying(30) NOT NULL, "username" character varying(15) NOT NULL, "email" character varying(40), "age" integer, "password" character varying NOT NULL, "gender" "public"."users_gender_enum", CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "study_groups_subjects_subjects" ("study_groups_id" integer NOT NULL, "subjects_id" integer NOT NULL, CONSTRAINT "PK_1c684636cd634ce080939a0cb77" PRIMARY KEY ("study_groups_id", "subjects_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_762d463866d28773bad343d542" ON "study_groups_subjects_subjects" ("study_groups_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_516c51d93dba6c9a88f42f9e2a" ON "study_groups_subjects_subjects" ("subjects_id") `);
        await queryRunner.query(`ALTER TABLE "parents" ADD CONSTRAINT "FK_2c38b5938cc61a38eaea6588d3f" FOREIGN KEY ("education_id") REFERENCES "educations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parents" ADD CONSTRAINT "FK_5777fdbf7de0cbb2b8861a91538" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parents" ADD CONSTRAINT "FK_09c12b80243d50d0bac6ac9158a" FOREIGN KEY ("income_id") REFERENCES "incomes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "FK_452c181def9d4cacb19691dad95" FOREIGN KEY ("education_id") REFERENCES "educations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "FK_dd0f345ecd26fa825329aaf79f9" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "FK_e8ee448c617e055e7d6fd93121d" FOREIGN KEY ("income_id") REFERENCES "incomes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "score" ADD CONSTRAINT "FK_c6c4ff1f9cb4fd6a539dd6961b3" FOREIGN KEY ("semester_report_id") REFERENCES "semester_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "score" ADD CONSTRAINT "FK_9f57ed892be9da95303f674ce88" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "extracurricular_score" ADD CONSTRAINT "FK_d95f1c3b5c3a82c7d496b21aa2a" FOREIGN KEY ("semester_report_id") REFERENCES "semester_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "extracurricular_score" ADD CONSTRAINT "FK_b91cbca0453dd7dc81e9a444c78" FOREIGN KEY ("extracurricular_id") REFERENCES "extracurriculars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semester_reports" ADD CONSTRAINT "FK_59d92b492db931142c287308288" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_c5928d8ae2ac52d7cac2935f067" FOREIGN KEY ("religion_id") REFERENCES "religions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_cddb5d45981d89f525852d3edd1" FOREIGN KEY ("sub_district_id") REFERENCES "subdistricts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_82b7142442b4003ea6c2ccb4a8d" FOREIGN KEY ("kind_of_stay_id") REFERENCES "kind_of_stay"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_23dde88cff273a2dd6dd1ea61fe" FOREIGN KEY ("transportation_id") REFERENCES "transportations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_b9ca23fc9a39c1b4066ac2dbfbb" FOREIGN KEY ("father_id") REFERENCES "parents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_f5e991e1b7d8204ca2a81c8303b" FOREIGN KEY ("mother_id") REFERENCES "parents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_bb4d7666efc93915ddb84745244" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_c3282d0d288a41af5fba1f2b058" FOREIGN KEY ("study_group_id") REFERENCES "study_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_bc49796866879c92cb8e112dd0d" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "study_groups_subjects_subjects" ADD CONSTRAINT "FK_762d463866d28773bad343d5425" FOREIGN KEY ("study_groups_id") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "study_groups_subjects_subjects" ADD CONSTRAINT "FK_516c51d93dba6c9a88f42f9e2a5" FOREIGN KEY ("subjects_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "study_groups_subjects_subjects" DROP CONSTRAINT "FK_516c51d93dba6c9a88f42f9e2a5"`);
        await queryRunner.query(`ALTER TABLE "study_groups_subjects_subjects" DROP CONSTRAINT "FK_762d463866d28773bad343d5425"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_bc49796866879c92cb8e112dd0d"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_c3282d0d288a41af5fba1f2b058"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_bb4d7666efc93915ddb84745244"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_f5e991e1b7d8204ca2a81c8303b"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_b9ca23fc9a39c1b4066ac2dbfbb"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_23dde88cff273a2dd6dd1ea61fe"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_82b7142442b4003ea6c2ccb4a8d"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_cddb5d45981d89f525852d3edd1"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_c5928d8ae2ac52d7cac2935f067"`);
        await queryRunner.query(`ALTER TABLE "semester_reports" DROP CONSTRAINT "FK_59d92b492db931142c287308288"`);
        await queryRunner.query(`ALTER TABLE "extracurricular_score" DROP CONSTRAINT "FK_b91cbca0453dd7dc81e9a444c78"`);
        await queryRunner.query(`ALTER TABLE "extracurricular_score" DROP CONSTRAINT "FK_d95f1c3b5c3a82c7d496b21aa2a"`);
        await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_9f57ed892be9da95303f674ce88"`);
        await queryRunner.query(`ALTER TABLE "score" DROP CONSTRAINT "FK_c6c4ff1f9cb4fd6a539dd6961b3"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "FK_e8ee448c617e055e7d6fd93121d"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "FK_dd0f345ecd26fa825329aaf79f9"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "FK_452c181def9d4cacb19691dad95"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP CONSTRAINT "FK_09c12b80243d50d0bac6ac9158a"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP CONSTRAINT "FK_5777fdbf7de0cbb2b8861a91538"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP CONSTRAINT "FK_2c38b5938cc61a38eaea6588d3f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_516c51d93dba6c9a88f42f9e2a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_762d463866d28773bad343d542"`);
        await queryRunner.query(`DROP TABLE "study_groups_subjects_subjects"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "transportations"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "semester_reports"`);
        await queryRunner.query(`DROP TYPE "public"."semester_reports_semester_enum"`);
        await queryRunner.query(`DROP TABLE "extracurricular_score"`);
        await queryRunner.query(`DROP TABLE "extracurriculars"`);
        await queryRunner.query(`DROP TABLE "score"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TABLE "study_groups"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "guardians"`);
        await queryRunner.query(`DROP TABLE "educations"`);
        await queryRunner.query(`DROP TABLE "parents"`);
        await queryRunner.query(`DROP TABLE "incomes"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TABLE "kind_of_stay"`);
        await queryRunner.query(`DROP TABLE "subdistricts"`);
        await queryRunner.query(`DROP TABLE "religions"`);
    }

}
