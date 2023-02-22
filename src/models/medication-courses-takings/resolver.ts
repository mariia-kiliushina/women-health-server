import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateMedicationCourseTakingInput } from "./dto/create-medication-course-taking.input"
import { UpdateMedicationCourseTakingInput } from "./dto/update-medication-course-taking.input"
import { MedicationCourseTakingEntity } from "./entities/medication-course-taking.entity"
import { MedicationCourseTaking } from "./models/medication-course-taking.model"
import { MedicationCoursesTakingsService } from "./service"

@Resolver(() => MedicationCourseTaking)
@UseGuards(AuthorizationGuard)
export class MedicationCoursesTakingsResolver {
  constructor(private medicationCoursesTakingsService: MedicationCoursesTakingsService) {}

  @Query((returns) => [MedicationCourseTaking], { name: "medicationCoursesTakings" })
  getAll(
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseTakingEntity[]> {
    return this.medicationCoursesTakingsService.getAll({ authorizedUser })
  }

  @Query((returns) => MedicationCourseTaking, { name: "medicationCoursesTaking" })
  find(
    @Args("id", { type: () => Int })
    id: MedicationCourseTaking["id"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseTakingEntity> {
    return this.medicationCoursesTakingsService.find({ medicationCourseTakingId: id, authorizedUser })
  }

  @Mutation((returns) => MedicationCourseTaking, { name: "createMedicationCoursesTaking" })
  create(
    @Args("input", ValidationPipe)
    input: CreateMedicationCourseTakingInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseTakingEntity> {
    return this.medicationCoursesTakingsService.create({ authorizedUser, input })
  }

  @Mutation((returns) => MedicationCourseTaking, { name: "updateMedicationCoursesTaking" })
  update(
    @Args("input", ValidationPipe)
    input: UpdateMedicationCourseTakingInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseTakingEntity> {
    return this.medicationCoursesTakingsService.update({ authorizedUser, input })
  }

  @Mutation((returns) => MedicationCourseTaking, { name: "deleteMedicationCoursesTaking" })
  delete(
    @Args("id", { type: () => Int })
    medicationCourseTakingId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<MedicationCourseTakingEntity> {
    return this.medicationCoursesTakingsService.delete({ authorizedUser, medicationCourseTakingId })
  }
}
