import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { MoodService } from "#models/mood/service"
import { PeriodIntensityService } from "#models/period-intensity/service"
import { SymptomEntity } from "#models/symptoms/entities/symptom.entity"
import { SymptomsService } from "#models/symptoms/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreatePeriodRecordInput } from "./dto/create-period-record.input"
import { SearchPeriodRecordsArgs } from "./dto/search-period-records.args"
import { UpdatePeriodRecordInput } from "./dto/update-period-record.input"
import { PeriodRecordEntity } from "./entities/period-record.entity"

@Injectable()
export class PeriodRecordsService {
  constructor(
    @InjectRepository(PeriodRecordEntity)
    private periodRecordRepository: Repository<PeriodRecordEntity>,
    private moodService: MoodService,
    private periodIntensityService: PeriodIntensityService,
    private symptomsService: SymptomsService
  ) {}

  async find({
    authorizedUser,
    recordId,
    date,
  }: {
    authorizedUser?: UserEntity
    date?: PeriodRecordEntity["date"]
    recordId?: PeriodRecordEntity["id"]
  }): Promise<PeriodRecordEntity> {
    if (!date && !recordId) {
      throw new BadRequestException({ message: "Provide at least one argument." })
    }
    const record = await this.periodRecordRepository.findOne({
      relations: { symptoms: true, user: true, mood: true, intensity: true },
      where: {
        ...(recordId !== undefined && { id: recordId }),
        ...(date !== undefined && { date }),
        ...(authorizedUser !== undefined && { user: { id: authorizedUser.id } }),
      },
    })
    if (record === null) {
      throw new NotFoundException({ message: "Not found." })
    }
    return record
  }

  async search({
    args,
    authorizedUser,
  }: {
    args: SearchPeriodRecordsArgs
    authorizedUser: UserEntity
  }): Promise<PeriodRecordEntity[]> {
    return await this.periodRecordRepository.find({
      order: { id: "DESC" },
      relations: { symptoms: true, user: true, mood: true, intensity: true },
      where: {
        ...(args.date !== undefined && { date: args.date }),
        user: { id: authorizedUser.id },
      },
    })
  }

  async create({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: CreatePeriodRecordInput
  }): Promise<PeriodRecordEntity> {
    let intensity = null
    if (input.intensitySlug !== undefined) {
      intensity = await this.periodIntensityService.find({ intensitySlug: input.intensitySlug }).catch(() => {
        throw new BadRequestException({ fields: { intensitySlug: "Invalid value." } })
      })
    }

    let mood = null
    if (input.moodSlug !== undefined) {
      mood = await this.moodService.find({ moodSlug: input.moodSlug }).catch(() => {
        throw new BadRequestException({ fields: { moodSlug: "Invalid value." } })
      })
    }

    let symptoms: SymptomEntity[] = []
    if (input.symptomsIds !== undefined) {
      symptoms = await Promise.all(
        input.symptomsIds.map((symptomId) => this.symptomsService.find({ symptomId }))
      ).catch(() => {
        throw new BadRequestException({ fields: { symptomsIds: "Invalid value." } })
      })
    }

    const periodRecord = this.periodRecordRepository.create({
      date: input.date,
      intensity,
      mood,
      symptoms,
      user: authorizedUser,
    })

    const createdPeriodRecord = await this.periodRecordRepository.save(periodRecord)
    return await this.find({ authorizedUser, recordId: createdPeriodRecord.id })
  }
  async update({
    authorizedUser,
    input,
  }: {
    authorizedUser: UserEntity
    input: UpdatePeriodRecordInput
  }): Promise<PeriodRecordEntity> {
    const record = await this.find({ recordId: input.id })
    if (record.user.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    if (Object.keys(input).length === 0) return record

    if (input.moodSlug !== undefined) {
      record.mood = await this.moodService.find({ moodSlug: input.moodSlug }).catch(() => {
        throw new BadRequestException({ fields: { moodSlug: "Invalid value." } })
      })
    }
    if (input.intensitySlug !== undefined) {
      record.intensity = await this.periodIntensityService.find({ intensitySlug: input.intensitySlug }).catch(() => {
        throw new BadRequestException({ fields: { intensitySlug: "Invalid value." } })
      })
    }

    if (input.symptomsIds !== undefined) {
      record.symptoms = await Promise.all(
        input.symptomsIds.map((symptomId) => this.symptomsService.find({ symptomId }))
      ).catch(() => {
        throw new BadRequestException({ fields: { symptomsIds: "Invalid value." } })
      })
    }

    return this.periodRecordRepository.save(record)
  }

  async delete({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: PeriodRecordEntity["id"]
  }): Promise<PeriodRecordEntity> {
    const periodRecord = await this.find({ recordId })
    if (periodRecord.user.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    await this.periodRecordRepository.delete(recordId)
    return periodRecord
  }
}
