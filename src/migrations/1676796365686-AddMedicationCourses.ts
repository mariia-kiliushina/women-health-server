import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMedicationCourses1676796365686 implements MigrationInterface {
    name = 'AddMedicationCourses1676796365686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medication_course" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_abe11da7a74a4892e3970aa8347" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medication_course" ADD CONSTRAINT "FK_41bfe84fc133273c69315d46e06" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medication_course" DROP CONSTRAINT "FK_41bfe84fc133273c69315d46e06"`);
        await queryRunner.query(`DROP TABLE "medication_course"`);
    }

}
