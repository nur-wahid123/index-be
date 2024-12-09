import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataFieldToSemesterReportEntity1733091713778 implements MigrationInterface {
    name = 'AddMetadataFieldToSemesterReportEntity1733091713778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "semester_reports" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "semester_reports" DROP COLUMN "metadata"`);
    }

}
