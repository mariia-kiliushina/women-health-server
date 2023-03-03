import { Module, forwardRef } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { MedicationCoursesTakingsModule } from "#models/medication-courses-takings/module"
import { UsersModule } from "#models/users/module"

import { MedicationCourseEntity } from "./entities/medication-course.entity"
import { MedicationCoursesResolver } from "./resolver"
import { MedicationCoursesService } from "./service"

@Module({
  exports: [MedicationCoursesService],
  imports: [
    TypeOrmModule.forFeature([MedicationCourseEntity]),

    forwardRef(() => MedicationCoursesTakingsModule),
    UsersModule,
  ],
  providers: [MedicationCoursesResolver, MedicationCoursesService],
})
export class MedicationCoursesModule {}
