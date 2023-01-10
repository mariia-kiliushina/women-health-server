import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPeriodIntensity1673379726988 implements MigrationInterface {
    name = 'AddPeriodIntensity1673379726988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "period_intensity" ("slug" character varying NOT NULL, CONSTRAINT "PK_60c0ac83191a8a846339176db26" PRIMARY KEY ("slug"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "period_intensity"`);
    }

}
