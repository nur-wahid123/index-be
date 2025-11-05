import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPresetTable1762356882051 implements MigrationInterface {
    name = 'AddPresetTable1762356882051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "preset-settings" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "display_index" integer, "preset_id" integer, CONSTRAINT "PK_3462a6afe320f661f58daeb336f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "preset_entity" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "creator_id" integer, CONSTRAINT "PK_843f2342fc07cd6234c2b2d2c1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "preset-settings" ADD CONSTRAINT "FK_da919ea24f3f9370d7ced29832a" FOREIGN KEY ("preset_id") REFERENCES "preset_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preset_entity" ADD CONSTRAINT "FK_6b9c99f32aec1c22817195a9979" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preset_entity" DROP CONSTRAINT "FK_6b9c99f32aec1c22817195a9979"`);
        await queryRunner.query(`ALTER TABLE "preset-settings" DROP CONSTRAINT "FK_da919ea24f3f9370d7ced29832a"`);
        await queryRunner.query(`DROP TABLE "preset_entity"`);
        await queryRunner.query(`DROP TABLE "preset-settings"`);
    }

}
