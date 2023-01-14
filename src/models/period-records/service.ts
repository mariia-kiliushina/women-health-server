import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { UserEntity } from "#models/users/entities/user.entity"

import { SearchPeriodRecordsArgs } from "./dto/search-period-records.args"
import { PeriodRecordEntity } from "./entities/period-record.entity"

@Injectable()
export class PeriodRecordsService {
  constructor(
    @InjectRepository(PeriodRecordEntity)
    private periodRecordRepository: Repository<PeriodRecordEntity>
  ) {}

  async find({
    authorizedUser,
    recordId,
  }: {
    authorizedUser: UserEntity
    recordId: PeriodRecordEntity["id"]
  }): Promise<PeriodRecordEntity> {
    const record = await this.periodRecordRepository.findOne({
      relations: { symptoms: true, user: true },
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
      relations: { symptoms: true, user: true },
      where: {
        ...(args.date !== undefined && { date: args.date }),
        user: { id: authorizedUser.id },
      },
    })
  }

  // async create({
  //   authorizedUser,
  //   input,
  // }: {
  //   authorizedUser: UserEntity
  //   input: CreateActivityRecordInput
  // }): Promise<ActivityRecordEntity> {
  //   const category = await this.activityCategoriesService
  //     .find({ authorizedUser, categoryId: input.categoryId })
  //     .catch(() => {
  //       throw new BadRequestException({ fields: { categoryId: "Invalid value." } })
  //     })
  //   if (category.owner.id !== authorizedUser.id) {
  //     throw new ForbiddenException({ message: "Access denied." })
  //   }
  //   if (category.measurementType.id === 1 && typeof input.quantitativeValue !== "number") {
  //     throw new BadRequestException({
  //       fields: {
  //         categoryId: "Amount should be filled for «Quantitative» activity.",
  //         quantitativeValue: "Amount should be filled for «Quantitative» activity.",
  //       },
  //     })
  //   }
  //   if (category.measurementType.id === 2 && typeof input.booleanValue !== "boolean") {
  //     throw new BadRequestException({
  //       fields: {
  //         categoryId: "Yes-no option should be filled for «Yes / no» activity.",
  //         booleanValue: "Yes-no option should be filled for «Yes / no» activity.",
  //       },
  //     })
  //   }
  //   const record = this.activityRecordsRepository.create(input)
  //   record.category = category
  //   const createdRecord = await this.activityRecordsRepository.save(record)
  //   return await this.find({ authorizedUser, recordId: createdRecord.id })
  // }

  // async update({
  //   authorizedUser,
  //   input,
  // }: {
  //   authorizedUser: UserEntity
  //   input: UpdateActivityRecordInput
  // }): Promise<ActivityRecordEntity> {
  //   const record = await this.find({ authorizedUser, recordId: input.id })
  //   if (record.category.owner.id !== authorizedUser.id) {
  //     throw new ForbiddenException({ message: "Access denied." })
  //   }
  //   if (Object.keys(input).length === 0) return record
  //   if (input.booleanValue !== undefined) {
  //     record.booleanValue = input.booleanValue
  //   }
  //   if (input.quantitativeValue !== undefined) {
  //     record.quantitativeValue = input.quantitativeValue
  //   }
  //   if (input.comment !== undefined) {
  //     record.comment = input.comment
  //   }
  //   if (input.date !== undefined) {
  //     record.date = input.date
  //   }
  //   if (input.categoryId !== undefined) {
  //     record.category = await this.activityCategoriesService
  //       .find({ authorizedUser, categoryId: input.categoryId })
  //       .catch(() => {
  //         throw new BadRequestException({ fields: { categoryId: "Invalid value." } })
  //       })
  //   }
  //   if (record.category.measurementType.id === 1 && typeof record.quantitativeValue !== "number") {
  //     throw new BadRequestException({
  //       fields: {
  //         categoryId: "Amount should be filled for «Quantitative» activity.",
  //         quantitativeValue: "Amount should be filled for «Quantitative» activity.",
  //       },
  //     })
  //   }
  //   if (record.category.measurementType.id === 2 && typeof record.booleanValue !== "boolean") {
  //     throw new BadRequestException({
  //       fields: {
  //         categoryId: "Yes-no option should be filled for «Yes / no» activity.",
  //         booleanValue: "Yes-no option should be filled for «Yes / no» activity.",
  //       },
  //     })
  //   }
  //   return this.activityRecordsRepository.save(record)
  // }

  // async delete({
  //   authorizedUser,
  //   recordId,
  // }: {
  //   authorizedUser: UserEntity
  //   recordId: ActivityRecordEntity["id"]
  // }): Promise<ActivityRecordEntity> {
  //   const record = await this.find({ authorizedUser, recordId })
  //   if (record.category.owner.id !== authorizedUser.id) {
  //     throw new ForbiddenException({ message: "Access denied." })
  //   }
  //   await this.activityRecordsRepository.delete(recordId)
  //   return record
  // }
}
