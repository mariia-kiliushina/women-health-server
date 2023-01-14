import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMood1673641434502 implements MigrationInterface {
    name = 'AddMood1673641434502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mood" ("slug" character varying NOT NULL, CONSTRAINT "PK_20e4c261ec4aa7faac75502a1d7" PRIMARY KEY ("slug"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mood"`);
    }

}
