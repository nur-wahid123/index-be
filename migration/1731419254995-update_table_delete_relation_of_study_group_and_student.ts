import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableDeleteRelationOfStudyGroupAndStudent1731419254995 implements MigrationInterface {
    name = 'UpdateTableDeleteRelationOfStudyGroupAndStudent1731419254995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_c3282d0d288a41af5fba1f2b058"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "study_group_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ADD "study_group_id" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_c3282d0d288a41af5fba1f2b058" FOREIGN KEY ("study_group_id") REFERENCES "study_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
