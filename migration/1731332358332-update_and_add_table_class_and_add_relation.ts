import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAndAddTableClassAndAddRelation1731332358332 implements MigrationInterface {
    name = 'UpdateAndAddTableClassAndAddRelation1731332358332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, "study_group_id" integer, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "students" ADD "class_id" integer`);
        await queryRunner.query(`ALTER TABLE "class" ADD CONSTRAINT "FK_82e54f2861a4bb6494239227fd9" FOREIGN KEY ("study_group_id") REFERENCES "study_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_de6ad4ae6936dce474e2823984e" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_de6ad4ae6936dce474e2823984e"`);
        await queryRunner.query(`ALTER TABLE "class" DROP CONSTRAINT "FK_82e54f2861a4bb6494239227fd9"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "class_id"`);
        await queryRunner.query(`DROP TABLE "class"`);
    }

}
