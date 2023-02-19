import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateMedicationCourseInput } from "./create-medication-course.input"

@InputType()
export class UpdateMedicationCourseInput extends PartialType(CreateMedicationCourseInput) {
  @Field((type) => Int)
  id: number
}
