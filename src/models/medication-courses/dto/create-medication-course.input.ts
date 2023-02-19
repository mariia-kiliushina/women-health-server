import { ValidationError } from "#constants/ValidationError"
import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class CreateMedicationCourseInput {
  @Field()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  name: string
}
