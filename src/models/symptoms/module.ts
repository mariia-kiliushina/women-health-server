import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { SymptomEntity } from "./entities/symptom.entity"
import { SymptomsResolver } from "./resolver"
import { SymptomsService } from "./service"

@Module({
  exports: [SymptomsService],
  imports: [TypeOrmModule.forFeature([SymptomEntity]), UsersModule],
  providers: [SymptomsResolver, SymptomsService],
})
export class SymptomsModule {}
