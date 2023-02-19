import { Field, Int, ObjectType } from "@nestjs/graphql"

import { User } from "#models/users/models/user.model"

import { IMedicationCourse } from "#interfaces/medication-course"

@ObjectType()
export class MedicationCourse {
  @Field(() => Int)
  id: IMedicationCourse["id"]

  @Field(() => String)
  name: IMedicationCourse["name"]

  @Field((type) => User)
  user: User
}
