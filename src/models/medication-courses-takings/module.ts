import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { MedicationCoursesModule } from "#models/medication-courses/module"
import { UsersModule } from "#models/users/module"

import { MedicationCourseTakingEntity } from "./entities/medication-course-taking.entity"
import { MedicationCoursesTakingsResolver } from "./resolver"
import { MedicationCoursesTakingsService } from "./service"

@Module({
  exports: [MedicationCoursesTakingsService],
  imports: [
    TypeOrmModule.forFeature([MedicationCourseTakingEntity]),
    forwardRef(() => MedicationCoursesModule),
    UsersModule,
  ],
  providers: [MedicationCoursesTakingsResolver, MedicationCoursesTakingsService],
})
export class MedicationCoursesTakingsModule {}
