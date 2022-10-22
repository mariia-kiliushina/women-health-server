import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPeriodRecords1666435354193 implements MigrationInterface {
    name = 'AddPeriodRecords1666435354193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "period_record" ("date" character varying NOT NULL, "id" SERIAL NOT NULL, "intensity" character varying NOT NULL, "mood" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_10a1268d2d97ae3645461948054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "period_record_symptoms_symptom" ("periodRecordId" integer NOT NULL, "symptomId" integer NOT NULL, CONSTRAINT "PK_3d54573ec7f8bdf59bb5716f27f" PRIMARY KEY ("periodRecordId", "symptomId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d7cd33ea1e9ae3353888a07cdf" ON "period_record_symptoms_symptom" ("periodRecordId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8250fd1841dd26b45ba4dbb116" ON "period_record_symptoms_symptom" ("symptomId") `);
        await queryRunner.query(`ALTER TABLE "period_record" ADD CONSTRAINT "FK_153accc1874129ce03f4212267b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "period_record_symptoms_symptom" ADD CONSTRAINT "FK_d7cd33ea1e9ae3353888a07cdf4" FOREIGN KEY ("periodRecordId") REFERENCES "period_record"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "period_record_symptoms_symptom" ADD CONSTRAINT "FK_8250fd1841dd26b45ba4dbb116a" FOREIGN KEY ("symptomId") REFERENCES "symptom"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "period_record_symptoms_symptom" DROP CONSTRAINT "FK_8250fd1841dd26b45ba4dbb116a"`);
        await queryRunner.query(`ALTER TABLE "period_record_symptoms_symptom" DROP CONSTRAINT "FK_d7cd33ea1e9ae3353888a07cdf4"`);
        await queryRunner.query(`ALTER TABLE "period_record" DROP CONSTRAINT "FK_153accc1874129ce03f4212267b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8250fd1841dd26b45ba4dbb116"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7cd33ea1e9ae3353888a07cdf"`);
        await queryRunner.query(`DROP TABLE "period_record_symptoms_symptom"`);
        await queryRunner.query(`DROP TABLE "period_record"`);
    }

}
