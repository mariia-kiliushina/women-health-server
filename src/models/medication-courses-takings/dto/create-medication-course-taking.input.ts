import { Field, InputType, Int } from "@nestjs/graphql"
import { Matches } from "class-validator"

@InputType()
export class CreateMedicationCourseTakingInput {
  @Field()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  date: string

  @Field(() => Int)
  medicationCourseId: number

  @Field()
  @Matches(/^\d\d:\d\d$/, { message: "Should have format HH:mm." })
  time: string
}
