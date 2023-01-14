import { UseGuards } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#helpers/authorization.guard"

import { MoodEntity } from "./entities/mood.entity"
import { Mood } from "./models/mood.model"
import { MoodService } from "./service"

@Resolver(() => Mood)
@UseGuards(AuthorizationGuard)
export class MoodResolver {
  constructor(private moodService: MoodService) {}

  @Query((returns) => [Mood], { name: "moods" })
  getAll(): Promise<MoodEntity[]> {
    return this.moodService.getAll()
  }

  @Query((returns) => Mood, { name: "mood" })
  find(
    @Args("slug", { type: () => String })
    slug: Mood["slug"]
  ): Promise<MoodEntity> {
    return this.moodService.find({ moodSlug: slug })
  }
}
