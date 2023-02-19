import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "#models/users/module"

import { MedicationCourseEntity } from "./entities/medication-course.entity"
import { MedicationCoursesResolver } from "./resolver"
import { MedicationCoursesService } from "./service"

@Module({
  exports: [MedicationCoursesService],
  imports: [TypeOrmModule.forFeature([MedicationCourseEntity]), UsersModule],
  providers: [MedicationCoursesResolver, MedicationCoursesService],
})
export class MedicationCoursesModule {}
