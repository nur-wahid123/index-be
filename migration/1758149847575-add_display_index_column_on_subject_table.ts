import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisplayIndexColumnOnSubjectTable1758149847575
  implements MigrationInterface
{
  name = 'AddDisplayIndexColumnOnSubjectTable1758149847575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subjects" ADD "display_index" integer`,
    );
    await queryRunner.query(`UPDATE "subjects" SET "display_index" = "id"`);
    await queryRunner.query(
      `ALTER TABLE "subjects" ADD CONSTRAINT "UQ_979c158dcf3a9b7bcf64fe74eb5" UNIQUE ("display_index")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP CONSTRAINT "UQ_979c158dcf3a9b7bcf64fe74eb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP COLUMN "display_index"`,
    );
  }
}
