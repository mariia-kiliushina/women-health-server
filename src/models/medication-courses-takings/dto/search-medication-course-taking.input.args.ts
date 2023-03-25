import { ArgsType, Field } from "@nestjs/graphql"

@ArgsType()
export class SearchMedicationCourseTakingArgs {
  @Field(() => [String])
  dates?: string[]
}
