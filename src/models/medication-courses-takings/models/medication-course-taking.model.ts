import { Field, Int, ObjectType } from "@nestjs/graphql"

import { MedicationCourse } from "#models/medication-courses/models/medication-course.model"

import { IMedicationCourseTaking } from "#interfaces/medication-course-taking"

@ObjectType()
export class MedicationCourseTaking {
  @Field(() => Int)
  id: IMedicationCourseTaking["id"]

  @Field(() => String)
  date: IMedicationCourseTaking["date"]

  @Field(() => String)
  time: IMedicationCourseTaking["time"]

  @Field(() => Boolean)
  isTaken: IMedicationCourseTaking["isTaken"]

  @Field((type) => MedicationCourse)
  medicationCourse: MedicationCourse
}
