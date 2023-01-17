import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreatePeriodRecordInput } from "./create-period-record.input"

@InputType()
export class UpdatePeriodRecordInput extends PartialType(CreatePeriodRecordInput) {
  @Field((type) => Int)
  id: number
}
