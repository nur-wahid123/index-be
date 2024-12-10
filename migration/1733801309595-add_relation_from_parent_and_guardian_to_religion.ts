import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationFromParentAndGuardianToReligion1733801309595 implements MigrationInterface {
    name = 'AddRelationFromParentAndGuardianToReligion1733801309595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parents" ADD "religion_id" integer`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD "religion_id" integer`);
        await queryRunner.query(`ALTER TABLE "parents" ADD CONSTRAINT "FK_9811c190c4c1a5b3d62aa18ac12" FOREIGN KEY ("religion_id") REFERENCES "religions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guardians" ADD CONSTRAINT "FK_4ebc3969910d47a2d0b851a6f40" FOREIGN KEY ("religion_id") REFERENCES "religions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guardians" DROP CONSTRAINT "FK_4ebc3969910d47a2d0b851a6f40"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP CONSTRAINT "FK_9811c190c4c1a5b3d62aa18ac12"`);
        await queryRunner.query(`ALTER TABLE "guardians" DROP COLUMN "religion_id"`);
        await queryRunner.query(`ALTER TABLE "parents" DROP COLUMN "religion_id"`);
    }

}
