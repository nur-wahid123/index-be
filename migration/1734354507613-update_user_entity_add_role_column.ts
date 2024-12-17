import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntityAddRoleColumn1734354507613 implements MigrationInterface {
    name = 'UpdateUserEntityAddRoleColumn1734354507613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
