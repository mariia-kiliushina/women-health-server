import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSymptoms1666210609652 implements MigrationInterface {
    name = 'AddSymptoms1666210609652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_be8002cea52485625c631cfd60b"`);//этого вообще не должно быть мы не трогамли эти таблциы
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f"`);
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_9271d66122d95fdca086e089b89"`);
        await queryRunner.query(`CREATE TABLE "symptom" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e6bf8581852864d312308633007" PRIMARY KEY ("id"))`);//миграции описывает создание моей новой таблицы
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_8e4d99801f523eb62b7a9e04649" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_7128e60fce45d26ecbfc18ac985" FOREIGN KEY ("typeId") REFERENCES "budget_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_0dbda261fad9c4d99b69ebb3183" FOREIGN KEY ("categoryId") REFERENCES "budget_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_0dbda261fad9c4d99b69ebb3183"`);
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_7128e60fce45d26ecbfc18ac985"`);
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_8e4d99801f523eb62b7a9e04649"`);
        await queryRunner.query(`DROP TABLE "symptom"`);// удаляет зачем-то??
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_9271d66122d95fdca086e089b89" FOREIGN KEY ("categoryId") REFERENCES "budget_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f" FOREIGN KEY ("typeId") REFERENCES "budget_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_be8002cea52485625c631cfd60b" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
