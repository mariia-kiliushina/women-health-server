import { MigrationInterface, QueryRunner } from "typeorm";

export class EditPeriodRecordsTable1673709759105 implements MigrationInterface {
    name = 'EditPeriodRecordsTable1673709759105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "period_record" DROP COLUMN "intensity"`);
        await queryRunner.query(`ALTER TABLE "period_record" DROP COLUMN "mood"`);
        await queryRunner.query(`ALTER TABLE "period_record" ADD "intensitySlug" character varying`);
        await queryRunner.query(`ALTER TABLE "period_record" ADD "moodSlug" character varying`);
        await queryRunner.query(`ALTER TABLE "period_record" ADD CONSTRAINT "FK_5184c98919e1209c86a6436be3e" FOREIGN KEY ("intensitySlug") REFERENCES "period_intensity"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "period_record" ADD CONSTRAINT "FK_28fbdd4468682a1bfcd1fc00658" FOREIGN KEY ("moodSlug") REFERENCES "mood"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "period_record" DROP CONSTRAINT "FK_28fbdd4468682a1bfcd1fc00658"`);
        await queryRunner.query(`ALTER TABLE "period_record" DROP CONSTRAINT "FK_5184c98919e1209c86a6436be3e"`);
        await queryRunner.query(`ALTER TABLE "period_record" DROP COLUMN "moodSlug"`);
        await queryRunner.query(`ALTER TABLE "period_record" DROP COLUMN "intensitySlug"`);
        await queryRunner.query(`ALTER TABLE "period_record" ADD "mood" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "period_record" ADD "intensity" character varying NOT NULL`);
    }

}
