import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { MoodEntity } from "./entities/mood.entity"
import { MoodResolver } from "./resolver"
import { MoodService } from "./service"

@Module({
  exports: [MoodService],
  imports: [TypeOrmModule.forFeature([MoodEntity]), UsersModule],
  providers: [MoodResolver, MoodService],
})
export class MoodModule {}
