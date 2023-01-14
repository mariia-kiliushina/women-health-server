import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { PeriodIntensityEntity } from "./entities/period-intensity.entity"

@Injectable()
export class PeriodIntensityService {
  constructor(
    @InjectRepository(PeriodIntensityEntity)
    private intensityRepository: Repository<PeriodIntensityEntity>
  ) {}

  getAll(): Promise<PeriodIntensityEntity[]> {
    return this.intensityRepository.find()
  }

  find({ intensitySlug }: { intensitySlug: PeriodIntensityEntity["slug"] }): Promise<PeriodIntensityEntity> {
    return this.intensityRepository.findOneOrFail({ where: { slug: intensitySlug } })
  }
}
