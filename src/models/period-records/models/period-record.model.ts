import { Field, Int, ObjectType } from "@nestjs/graphql"

import { Mood } from "#models/mood/models/mood.model"
import { PeriodIntensity } from "#models/period-intensity/models/period-intensity.model"
import { Symptom } from "#models/symptoms/models/symptom.model"
import { User } from "#models/users/models/user.model"

import { IPeriodRecord } from "#interfaces/periods"

@ObjectType()
export class PeriodRecord {
  @Field(() => String)
  date: IPeriodRecord["date"]

  @Field((type) => Int)
  id: IPeriodRecord["id"]

  @Field((type) => PeriodIntensity)
  intensity: PeriodIntensity

  @Field((type) => Mood)
  mood: Mood

  @Field(() => [Symptom])
  symptoms: Symptom[]

  @Field((type) => User)
  user: User
}
