import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateMedicationCourseInput } from "./dto/create-medication-course.input"
import { UpdateMedicationCourseInput } from "./dto/update-medication-course.input"
import { MedicationCourseEntity } from "./entities/medication-course.entity"
import { MedicationCourse } from "./models/medication-course.model"
import { MedicationCoursesService } from "./service"

@Resolver(() => MedicationCourse)
@UseGuards(AuthorizationGuard)
export class MedicationCoursesResolver {
  constructor(private medicationCoursesService: MedicationCoursesService) {}

  @Query((returns) => [MedicationCourse], { name: "medicationCourses" })
  getAll(
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseEntity[]> {
    return this.medicationCoursesService.getAll({ authorizedUser })
  }

  @Query((returns) => MedicationCourse, { name: "medicationCourse" })
  find(
    @Args("id", { type: () => Int })
    id: MedicationCourse["id"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseEntity> {
    return this.medicationCoursesService.find({ medicationCourseId: id, authorizedUser })
  }

  @Mutation((returns) => MedicationCourse, { name: "createMedicationCourse" })
  create(
    @Args("input", ValidationPipe)
    input: CreateMedicationCourseInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseEntity> {
    return this.medicationCoursesService.create({ authorizedUser, input })
  }

  @Mutation((returns) => MedicationCourse, { name: "updateMedicationCourse" })
  update(
    @Args("input", ValidationPipe)
    input: UpdateMedicationCourseInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseEntity> {
    return this.medicationCoursesService.update({ authorizedUser, input })
  }

  @Mutation((returns) => MedicationCourse, { name: "deleteMedicationCourse" })
  delete(
    @Args("id", { type: () => Int })
    medicationCourseId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseEntity> {
    return this.medicationCoursesService.delete({ authorizedUser, medicationCourseId })
  }
}
