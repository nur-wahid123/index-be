import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentEntityColumnName1731540299165 implements MigrationInterface {
    name = 'UpdateStudentEntityColumnName1731540299165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_de6ad4ae6936dce474e2823984e"`);
        await queryRunner.query(`ALTER TABLE "students" RENAME COLUMN "class_id" TO "student_class_id"`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_c1f9388912ff71471698052187e" FOREIGN KEY ("student_class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_c1f9388912ff71471698052187e"`);
        await queryRunner.query(`ALTER TABLE "students" RENAME COLUMN "student_class_id" TO "class_id"`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_de6ad4ae6936dce474e2823984e" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
