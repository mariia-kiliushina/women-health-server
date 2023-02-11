import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreatePeriodRecordInput } from "./dto/create-period-record.input"
import { SearchPeriodRecordsArgs } from "./dto/search-period-records.args"
import { UpdatePeriodRecordInput } from "./dto/update-period-record.input"
import { PeriodRecordEntity } from "./entities/period-record.entity"
import { PeriodRecord } from "./models/period-record.model"
import { PeriodRecordsService } from "./service"

@Resolver(() => PeriodRecord)
@UseGuards(AuthorizationGuard)
export class PeriodRecordsResolver {
  constructor(private readonly periodRecordsService: PeriodRecordsService) {}

  @Query((returns) => PeriodRecord, { name: "periodRecord" })
  find(
    @Args("id", { type: () => Int, nullable: true })
    recordId: PeriodRecordEntity["id"],
    @Args("date", { type: () => String, nullable: true })
    date: PeriodRecordEntity["date"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<PeriodRecordEntity> {
    return this.periodRecordsService.find({ authorizedUser, recordId, date })
  }

  @Query((returns) => [PeriodRecord], { name: "periodRecords" })
  search(
    @Args()
    args: SearchPeriodRecordsArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<PeriodRecordEntity[]> {
    return this.periodRecordsService.search({ args, authorizedUser })
  }

  @Mutation((returns) => PeriodRecord, { name: "createPeriodRecord" })
  create(
    @Args("input", ValidationPipe)
    input: CreatePeriodRecordInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<PeriodRecordEntity> {
    return this.periodRecordsService.create({ authorizedUser, input })
  }

  @Mutation((returns) => PeriodRecord, { name: "updatePeriodRecord" })
  update(
    @Args("input", ValidationPipe)
    input: UpdatePeriodRecordInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<PeriodRecordEntity> {
    return this.periodRecordsService.update({ authorizedUser, input })
  }

  @Mutation((returns) => PeriodRecord, { name: "deletePeriodRecord" })
  delete(
    @Args("id", { type: () => Int })
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<PeriodRecordEntity> {
    return this.periodRecordsService.delete({ authorizedUser, recordId })
  }
}
