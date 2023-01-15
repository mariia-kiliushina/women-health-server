import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { MoodModule } from "#models/mood/module"
import { PeriodIntensityModule } from "#models/period-intensity/module"
import { SymptomsModule } from "#models/symptoms/module"
import { UsersModule } from "#models/users/module"

import { PeriodRecordEntity } from "./entities/period-record.entity"
import { PeriodRecordsResolver } from "./resolver"
import { PeriodRecordsService } from "./service"

@Module({
  imports: [
    TypeOrmModule.forFeature([PeriodRecordEntity]),
    MoodModule,
    PeriodIntensityModule,
    SymptomsModule,
    UsersModule,
  ],
  providers: [PeriodRecordsResolver, PeriodRecordsService],
})
export class PeriodRecordsModule {}
