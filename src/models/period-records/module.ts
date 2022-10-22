import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ActivityCategoriesModule } from "#models/activity-categories/module"
import { UsersModule } from "#models/users/module"

import { PeriodRecordEntity } from "./entities/period-record.entity"
import { PeriodRecordsResolver } from "./resolver"
import { PeriodRecordsService } from "./service"

@Module({
  imports: [TypeOrmModule.forFeature([PeriodRecordEntity]), ActivityCategoriesModule, UsersModule],
  providers: [PeriodRecordsResolver, PeriodRecordsService],
})
export class PeriodRecordsModule {}
