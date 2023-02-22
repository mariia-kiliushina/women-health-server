import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { MedicationCourseEntity } from "#models/medication-courses/entities/medication-course.entity"

import { IMedicationCourseTaking } from "#interfaces/medication-course-taking"

@Entity("medication_course_taking")
export class MedicationCourseTakingEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IMedicationCourseTaking["id"]

  @Column({ type: "varchar" })
  date: IMedicationCourseTaking["date"]

  @Column({ type: "varchar" })
  time: IMedicationCourseTaking["time"]

  @Column({ type: "boolean" })
  isTaken: IMedicationCourseTaking["isTaken"]

  @ManyToOne(() => MedicationCourseEntity, { onDelete: "CASCADE" })
  medicationCourse: MedicationCourseEntity
}
