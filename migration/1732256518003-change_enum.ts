import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnum1732256518003 implements MigrationInterface {
    name = 'ChangeEnum1732256518003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."semester_reports_semester_enum" RENAME TO "semester_reports_semester_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."semester_reports_semester_enum" AS ENUM('I', 'II')`);
        await queryRunner.query(`ALTER TABLE "semester_reports" ALTER COLUMN "semester" TYPE "public"."semester_reports_semester_enum" USING "semester"::"text"::"public"."semester_reports_semester_enum"`);
        await queryRunner.query(`DROP TYPE "public"."semester_reports_semester_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."semester_reports_semester_enum_old" AS ENUM('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII')`);
        await queryRunner.query(`ALTER TABLE "semester_reports" ALTER COLUMN "semester" TYPE "public"."semester_reports_semester_enum_old" USING "semester"::"text"::"public"."semester_reports_semester_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."semester_reports_semester_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."semester_reports_semester_enum_old" RENAME TO "semester_reports_semester_enum"`);
    }

}
