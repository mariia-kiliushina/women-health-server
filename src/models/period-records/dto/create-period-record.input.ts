import { Field, InputType, Int } from "@nestjs/graphql"
import { Matches } from "class-validator"

@InputType()
export class CreatePeriodRecordInput {
  @Field()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  date: string

  @Field()
  intensitySlug: string

  @Field()
  moodSlug: string

  @Field((type) => [Int])
  symptomsIds: number[]
}
