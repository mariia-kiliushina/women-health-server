import { Field, Int, ObjectType } from "@nestjs/graphql"

import { Symptom } from "#models/symptoms/models/symptom.model"
import { User } from "#models/users/models/user.model"

import { IPeriodRecord } from "#interfaces/periods"

@ObjectType()
export class PeriodRecord {
  @Field(() => String)
  date: IPeriodRecord["date"]

  @Field((type) => Int)
  id: IPeriodRecord["id"]

  // ToDo: try EnumOptions
  @Field(() => String)
  intensity: IPeriodRecord["intensity"]

  @Field(() => String)
  mood: IPeriodRecord["mood"]

  @Field(() => [Symptom])
  symptoms: Symptom[]

  @Field((type) => User)
  user: User
}
