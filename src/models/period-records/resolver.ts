import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"

import { SearchPeriodRecordsArgs } from "./dto/search-period-records.args"
import { PeriodRecordEntity } from "./entities/period-record.entity"
import { PeriodRecord } from "./models/period-record.model"
import { PeriodRecordsService } from "./service"

@Resolver(() => PeriodRecord)
@UseGuards(AuthorizationGuard)
export class PeriodRecordsResolver {
  constructor(private readonly periodRecordsService: PeriodRecordsService) {}

  @Query((returns) => PeriodRecord, { name: "periodRecord" })
  find(
    @Args("id", { type: () => Int })
    recordId: PeriodRecordEntity["id"],
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<PeriodRecordEntity> {
    return this.periodRecordsService.find({ authorizedUser, recordId })
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

  // @Mutation((returns) => ActivityRecord, { name: "createActivityRecord" })
  // create(
  //   @Args("input", ValidationPipe)
  //   input: CreateActivityRecordInput,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ): Promise<PeriodRecordEntity> {
  //   return this.activityRecordsService.create({ authorizedUser, input })
  // }

  // @Mutation((returns) => ActivityRecord, { name: "updateActivityRecord" })
  // update(
  //   @Args("input", ValidationPipe)
  //   input: UpdateActivityRecordInput,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ): Promise<PeriodRecordEntity> {
  //   return this.activityRecordsService.update({ authorizedUser, input })
  // }

  // @Mutation((returns) => ActivityRecord, { name: "deleteActivityRecord" })
  // delete(
  //   @Args("id", { type: () => Int })
  //   recordId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ): Promise<ActivityRecordEntity> {
  //   return this.activityRecordsService.delete({ authorizedUser, recordId })
  // }
}
