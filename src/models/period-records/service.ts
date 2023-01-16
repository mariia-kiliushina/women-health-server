import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { MoodService } from "#models/mood/service"
import { PeriodIntensityService } from "#models/period-intensity/service"
import { SymptomsService } from "#models/symptoms/service"
import { UserEntity } from "#models/users/entities/user.entity"

import { CreatePeriodRecordInput } from "./dto/create-period-record.input"
import { SearchPeriodRecordsArgs } from "./dto/search-period-records.args"
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

    // TODO: Добавить возможность искать по переданным ID-шкам: getAll заменить на search, добавить опциональные параметры поиска (ids).
    // TODO: Добавить обработку ошибки, если были переданы несуществующие ID-шки симптомов.
    const symptoms = (await this.symptomsService.getAll()).filter((symptom) => input.symptomsIds.includes(symptom.id))

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
