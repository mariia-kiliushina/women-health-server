import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateMedicationCourseTakingInput } from "./create-medication-course-taking.input"

@InputType()
export class UpdateMedicationCourseTakingInput extends PartialType(CreateMedicationCourseTakingInput) {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  isTaken?: boolean
}
