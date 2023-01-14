import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Mood {
  @Field()
  slug: string
}
