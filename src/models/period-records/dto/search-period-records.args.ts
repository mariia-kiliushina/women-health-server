import { ArgsType, Field } from "@nestjs/graphql"

@ArgsType()
export class SearchPeriodRecordsArgs {
  @Field(() => String, { nullable: true })
  date?: string
}
