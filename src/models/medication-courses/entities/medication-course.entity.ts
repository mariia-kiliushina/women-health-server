import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { UserEntity } from "#models/users/entities/user.entity"

import { IMedicationCourse } from "#interfaces/medication-course"

@Entity("medication_course")
export class MedicationCourseEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IMedicationCourse["id"]

  @Column({ type: "varchar" })
  name: IMedicationCourse["name"]

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity
}
