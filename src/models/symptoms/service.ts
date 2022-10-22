import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { SymptomEntity } from "./entities/symptom.entity"

@Injectable()
export class SymptomsService {
  constructor(
    @InjectRepository(SymptomEntity)
    private symptomsRepository: Repository<SymptomEntity>
  ) {}

  getAll(): Promise<SymptomEntity[]> {
    return this.symptomsRepository.find()
  }

  find({ symptomId }: { symptomId: SymptomEntity["id"] }): Promise<SymptomEntity> {
    return this.symptomsRepository.findOneOrFail({ where: { id: symptomId } })
  }
}
