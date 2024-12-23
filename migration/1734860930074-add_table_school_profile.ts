import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableSchoolProfile1734860930074 implements MigrationInterface {
  name = 'AddTableSchoolProfile1734860930074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "school_profile" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "school_name" character varying, "address" character varying, "phone_number" character varying, "email" character varying, "school_chief_name" character varying, "school_chief_nip" character varying, CONSTRAINT "PK_bb0313d4bc2957cfb49ceb9611e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "school_profile"`);
  }
}
