import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { MedicationCoursesService } from "#models/medication-courses/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreateMedicationCourseTakingInput } from "./dto/create-medication-course-taking.input"
import { UpdateMedicationCourseTakingInput } from "./dto/update-medication-course-taking.input"
import { MedicationCourseTakingEntity } from "./entities/medication-course-taking.entity"

@Injectable()
export class MedicationCoursesTakingsService {
  constructor(
    @InjectRepository(MedicationCourseTakingEntity)
    private medicationCoursesTakingsRepository: Repository<MedicationCourseTakingEntity>,
    private medicationCoursesService: MedicationCoursesService
  ) {}

  getAll({ authorizedUser }: { authorizedUser: UserEntity }): Promise<MedicationCourseTakingEntity[]> {
    return this.medicationCoursesTakingsRepository.find({
      relations: {
        medicationCourse: { user: true },
      },
      where: {
        medicationCourse: { user: authorizedUser },
      },
    })
  }

  async find({
    authorizedUser,
    medicationCourseTakingId,
  }: {
    authorizedUser: UserEntity
    medicationCourseTakingId: MedicationCourseTakingEntity["id"]
  }): Promise<MedicationCourseTakingEntity> {
    const medicationCourseTaking = await this.medicationCoursesTakingsRepository.findOne({
      relations: {
        medicationCourse: { user: true },
      },
      where: { id: medicationCourseTakingId },
    })
    if (medicationCourseTaking === null) {
      throw new NotFoundException({ message: "Not found." })
    }
    if (medicationCourseTaking.medicationCourse.user.id !== authorizedUser.id) {
      throw new NotFoundException({ message: "Access denied." })
    }
    return medicationCourseTaking
  }

  async create({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: CreateMedicationCourseTakingInput
  }): Promise<MedicationCourseTakingEntity> {
    const medicationCourse = await this.medicationCoursesService.find({
      authorizedUser,
      medicationCourseId: input.medicationCourseId,
    })

    const medicationCourseTaking = this.medicationCoursesTakingsRepository.create({
      date: input.date,
      isTaken: false,
      medicationCourse,
      time: input.time,
    })

    return this.medicationCoursesTakingsRepository.save(medicationCourseTaking)
  }

  async update({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: UpdateMedicationCourseTakingInput
  }): Promise<MedicationCourseTakingEntity> {
    const medicationCourseTaking = await this.find({
      authorizedUser,
      medicationCourseTakingId: input.id,
    })

    if (Object.keys(input).length === 0) return medicationCourseTaking

    if (input.date !== undefined) {
      medicationCourseTaking.date = input.date
    }
    if (input.time !== undefined) {
      medicationCourseTaking.time = input.time
    }
    if (input.isTaken !== undefined) {
      medicationCourseTaking.isTaken = input.isTaken
    }
    if (input.medicationCourseId !== undefined) {
      const medicationCourse = await this.medicationCoursesService.find({
        authorizedUser,
        medicationCourseId: input.medicationCourseId,
      })
      medicationCourseTaking.medicationCourse = medicationCourse
    }

    return this.medicationCoursesTakingsRepository.save(medicationCourseTaking)
  }

  async delete({
    authorizedUser,
    medicationCourseTakingId,
  }: {
    authorizedUser: UserEntity
    medicationCourseTakingId: MedicationCourseTakingEntity["id"]
  }): Promise<MedicationCourseTakingEntity> {
    const medicationCourseTaking = await this.find({ authorizedUser, medicationCourseTakingId })
    await this.medicationCoursesTakingsRepository.delete(medicationCourseTakingId)
    return medicationCourseTaking
  }
}
