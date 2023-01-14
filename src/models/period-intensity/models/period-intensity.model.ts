import { Field, ObjectType } from "@nestjs/graphql"

import { IPeriodIntensity } from "#interfaces/period-intensity"

@ObjectType()
export class PeriodIntensity {
  @Field(() => String)
  slug: IPeriodIntensity["slug"]
}
