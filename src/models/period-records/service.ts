import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { MoodService } from "#models/mood/service"
import { PeriodIntensityService } from "#models/period-intensity/service"
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
  }: {
    authorizedUser: UserEntity
    recordId: PeriodRecordEntity["id"]
  }): Promise<PeriodRecordEntity> {
    const record = await this.periodRecordRepository.findOne({
      relations: { symptoms: true, user: true, mood: true, intensity: true },
      where: { id: recordId },
    })
    if (record === null) {
      throw new NotFoundException({ message: "Not found." })
    }
    if (record.user.id !== authorizedUser.id) {
      throw new NotFoundException({ message: "Access denied." })
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
      order: { date: "ASC", id: "ASC" },
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
    const intensity = await this.periodIntensityService.find({ intensitySlug: input.intensitySlug }).catch(() => {
      throw new BadRequestException({ fields: { intensitySlug: "Invalid value." } })
    })

    const mood = await this.moodService.find({ moodSlug: input.moodSlug }).catch(() => {
      throw new BadRequestException({ fields: { moodSlug: "Invalid value." } })
    })

    const symptoms = await Promise.all(
      input.symptomsIds.map((symptomId) => this.symptomsService.find({ symptomId }))
    ).catch(() => {
      throw new BadRequestException({ fields: { symptomsIds: "Invalid value." } })
    })

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
    const record = await this.find({ authorizedUser, recordId: input.id })
    if (record.user.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }

    if (Object.keys(input).length === 0) return record

    if (input.date !== undefined) {
      record.date = input.date
    }

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
    const periodRecord = await this.find({ authorizedUser, recordId })
    if (periodRecord.user.id !== authorizedUser.id) {
      throw new ForbiddenException({ message: "Access denied." })
    }
    await this.periodRecordRepository.delete(recordId)
    return periodRecord
  }
}
