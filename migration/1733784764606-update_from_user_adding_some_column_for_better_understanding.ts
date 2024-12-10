import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFromUserAddingSomeColumnForBetterUnderstanding1733784764606 implements MigrationInterface {
    name = 'UpdateFromUserAddingSomeColumnForBetterUnderstanding1733784764606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "type_of_bloods" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_708f50376991fbb9a7cd64523c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "citizenships" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP, "deleted_by" integer, "name" character varying NOT NULL, CONSTRAINT "PK_647d9f413a430a1392db9ca4ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parents" ADD "is_alive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "parents" ADD "citizenship_id" integer`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "is_alive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "citizenship_id" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD "number_of_step_siblings" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD "number_of_adopted_siblings" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD "accepted_first_time_in_class" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD "years_on_junior_school" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD "accepted_first_time_in_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "students" ADD "favourite_art" character varying`);
        await queryRunner.query(`ALTER TABLE "students" ADD "favourite_sport" character varying`);
        await queryRunner.query(`ALTER TABLE "students" ADD "social_organization" character varying`);
        await queryRunner.query(`ALTER TABLE "students" ADD "citizenship_id" integer`);
        await queryRunner.query(`ALTER TABLE "students" ADD "type_of_blood_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(30) NOT NULL DEFAULT 'name'`);
        await queryRunner.query(`ALTER TABLE "parents" ADD CONSTRAINT "FK_25cfa4b7d91ba6679efe52cf448" FOREIGN KEY ("citizenship_id") REFERENCES "citizenships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "FK_352d885145f9d9eea1b9c8bed00" FOREIGN KEY ("citizenship_id") REFERENCES "citizenships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_438031a129e9e652e8d1b66ffb8" FOREIGN KEY ("citizenship_id") REFERENCES "citizenships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_a63544ad367725f569ffd408edc" FOREIGN KEY ("type_of_blood_id") REFERENCES "type_of_bloods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_a63544ad367725f569ffd408edc"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_438031a129e9e652e8d1b66ffb8"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "FK_352d885145f9d9eea1b9c8bed00"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP CONSTRAINT "FK_25cfa4b7d91ba6679efe52cf448"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "type_of_blood_id"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "citizenship_id"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "social_organization"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "favourite_sport"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "favourite_art"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "accepted_first_time_in_date"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "years_on_junior_school"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "accepted_first_time_in_class"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "number_of_adopted_siblings"`);
        await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "number_of_step_siblings"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "citizenship_id"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "is_alive"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP COLUMN "citizenship_id"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP COLUMN "is_alive"`);
        await queryRunner.query(`DROP TABLE "citizenships"`);
        await queryRunner.query(`DROP TABLE "type_of_bloods"`);
    }

}
