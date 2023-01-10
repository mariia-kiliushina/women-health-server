import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#helpers/authorization.guard"

import { SymptomEntity } from "./entities/symptom.entity"
import { Symptom } from "./models/symptom.model"
import { SymptomsService } from "./service"

@Resolver(() => Symptom)
@UseGuards(AuthorizationGuard)
export class SymptomsResolver {
  constructor(private symptomsService: SymptomsService) {}

  @Query((returns) => [Symptom], { name: "symptoms" })
  getAll(): Promise<SymptomEntity[]> {
    return this.symptomsService.getAll()
  }

  @Query((returns) => Symptom, { name: "symptom" })
  find(
    @Args("id", { type: () => Int })
    id: Symptom["id"]
  ): Promise<SymptomEntity> {
    return this.symptomsService.find({ symptomId: id })
  }
}
