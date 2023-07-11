import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class UpdatePeriodRecordInput {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  intensitySlug?: string

  @Field({ nullable: true })
  moodSlug?: string

  @Field((type) => [Int], { nullable: true })
  symptomsIds?: number[]
}
