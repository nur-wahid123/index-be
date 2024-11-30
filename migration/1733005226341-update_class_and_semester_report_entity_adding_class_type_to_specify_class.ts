import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateClassAndSemesterReportEntityAddingClassTypeToSpecifyClass1733005226341 implements MigrationInterface {
    name = 'UpdateClassAndSemesterReportEntityAddingClassTypeToSpecifyClass1733005226341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class" ADD "class_type" character varying NOT NULL DEFAULT 'X'`);
        await queryRunner.query(`ALTER TABLE "semester_reports" ADD "class_type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "semester_reports" DROP COLUMN "class_type"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "class_type"`);
    }

}
