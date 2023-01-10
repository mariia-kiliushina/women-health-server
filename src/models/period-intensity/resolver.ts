import { UseGuards } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#helpers/authorization.guard"

import { PeriodIntensityEntity } from "./entities/period-intensity.entity"
import { PeriodIntensity } from "./models/period-intensity.model"
import { PeriodIntensityService } from "./service"

@Resolver(() => PeriodIntensity)
@UseGuards(AuthorizationGuard)
export class PeriodIntensityResolver {
  constructor(private intensityService: PeriodIntensityService) {}

  @Query((returns) => [PeriodIntensity], { name: "periodIntensities" })
  getAll(): Promise<PeriodIntensityEntity[]> {
    return this.intensityService.getAll()
  }

  @Query((returns) => PeriodIntensity, { name: "periodIntensity" })
  find(
    @Args("slug", { type: () => String })
    slug: PeriodIntensity["slug"]
  ): Promise<PeriodIntensityEntity> {
    return this.intensityService.find({ intensitySlug: slug })
  }
}
