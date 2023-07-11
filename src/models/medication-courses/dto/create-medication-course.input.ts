import { ValidationError } from "#constants/ValidationError"
import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, Matches } from "class-validator"

@InputType()
export class CreateMedicationCourseInput {
  @Field()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  endDate: string

  @Field()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  name: string

  @Field()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  startDate: string

  @Field(() => [String])
  @Matches(/^\d\d:\d\d$/, { each: true, message: "An array of HH:mm times expected." })
  times: string[]
}
