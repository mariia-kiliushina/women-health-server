import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { MedicationCoursesTakingsService } from "#models/medication-courses-takings/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { getPeriodOfDates } from "#helpers/getPeriodOfDates"

import { CreateMedicationCourseInput } from "./dto/create-medication-course.input"
import { UpdateMedicationCourseInput } from "./dto/update-medication-course.input"
import { MedicationCourseEntity } from "./entities/medication-course.entity"

@Injectable()
export class MedicationCoursesService {
  constructor(
    @InjectRepository(MedicationCourseEntity)
    private medicationCoursesRepository: Repository<MedicationCourseEntity>,
    @Inject(forwardRef(() => MedicationCoursesTakingsService))
    private medicationCoursesTakingsService: MedicationCoursesTakingsService
  ) {}

  getAll({ authorizedUser }: { authorizedUser: UserEntity }): Promise<MedicationCourseEntity[]> {
    return this.medicationCoursesRepository.find({
      relations: { user: true },
      where: {
        user: { id: authorizedUser.id },
      },
    })
  }

  async find({
    medicationCourseId,
    authorizedUser,
  }: {
    medicationCourseId: MedicationCourseEntity["id"]
    authorizedUser: UserEntity
  }): Promise<MedicationCourseEntity> {
    const medicationCourse = await this.medicationCoursesRepository.findOne({
      relations: { user: true },
      where: { id: medicationCourseId },
    })
    if (medicationCourse === null) {
      throw new NotFoundException({ message: "Not found." })
    }
    if (medicationCourse.user.id !== authorizedUser.id) {
      throw new NotFoundException({ message: "Access denied." })
    }
    return medicationCourse
  }

  async create({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: CreateMedicationCourseInput
  }): Promise<MedicationCourseEntity> {
    const medicationCourse = this.medicationCoursesRepository.create({
      name: input.name,
      user: authorizedUser,
    })

    const savedMedicationCourse = await this.medicationCoursesRepository.save(medicationCourse)

    const dates = getPeriodOfDates(input.startDate, input.endDate)

    for (const date of dates) {
      for (const time of input.times) {
        const input = {
          date,
          isTaken: false,
          medicationCourseId: savedMedicationCourse.id,
          time,
        }
        await this.medicationCoursesTakingsService.create({
          authorizedUser,
          input,
        })
      }
    }

    return await this.medicationCoursesRepository.save(medicationCourse)
  }

  async update({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: UpdateMedicationCourseInput
  }): Promise<MedicationCourseEntity> {
    const medicationCourse = await this.find({
      authorizedUser,
      medicationCourseId: input.id,
    })
    if (input.name !== undefined) {
      medicationCourse.name = input.name
    }
    return this.medicationCoursesRepository.save(medicationCourse)
  }

  async delete({
    authorizedUser,
    medicationCourseId,
  }: {
    authorizedUser: UserEntity
    medicationCourseId: MedicationCourseEntity["id"]
  }): Promise<MedicationCourseEntity> {
    const medicationCourse = await this.find({ authorizedUser, medicationCourseId })
    await this.medicationCoursesRepository.delete(medicationCourseId)
    return medicationCourse
  }
}
