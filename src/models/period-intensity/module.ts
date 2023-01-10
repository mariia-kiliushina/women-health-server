import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { PeriodIntensityEntity } from "./entities/period-intensity.entity"
import { PeriodIntensityResolver } from "./resolver"
import { PeriodIntensityService } from "./service"

@Module({
  exports: [PeriodIntensityService],
  imports: [TypeOrmModule.forFeature([PeriodIntensityEntity]), UsersModule],
  providers: [PeriodIntensityResolver, PeriodIntensityService],
})
export class PeriodIntensityModule {}
