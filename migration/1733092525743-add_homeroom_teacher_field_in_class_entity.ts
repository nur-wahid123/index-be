import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHomeroomTeacherFieldInClassEntity1733092525743 implements MigrationInterface {
    name = 'AddHomeroomTeacherFieldInClassEntity1733092525743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class" ADD "homeroom_teacher" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "homeroom_teacher"`);
    }

}
