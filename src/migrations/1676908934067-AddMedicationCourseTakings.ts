import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMedicationCourseTakings1676908934067 implements MigrationInterface {
    name = 'AddMedicationCourseTakings1676908934067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medication_course_taking" ("id" SERIAL NOT NULL, "date" character varying NOT NULL, "time" character varying NOT NULL, "isTaken" boolean NOT NULL, "medicationCourseId" integer, CONSTRAINT "PK_ec2cc2c949e4c8b7b9d36e44bbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "medication_course_taking" ADD CONSTRAINT "FK_6b2e416a16213d3ed86bb93a00e" FOREIGN KEY ("medicationCourseId") REFERENCES "medication_course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medication_course_taking" DROP CONSTRAINT "FK_6b2e416a16213d3ed86bb93a00e"`);
        await queryRunner.query(`DROP TABLE "medication_course_taking"`);
    }

}
