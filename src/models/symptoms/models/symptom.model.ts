import { Field, Int, ObjectType } from "@nestjs/graphql"

import { PeriodRecord } from "#models/period-records/models/period-record.model"

import { ISymptom } from "#interfaces/symptoms"

@ObjectType()
export class Symptom {
  @Field(() => Int)
  id: ISymptom["id"]

  @Field(() => String)
  name: ISymptom["name"]

  @Field(() => [PeriodRecord])
  periodRecords: PeriodRecord[]
}
