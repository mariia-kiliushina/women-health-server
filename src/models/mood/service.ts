import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { MoodEntity } from "./entities/mood.entity"

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntity)
    private moodRepository: Repository<MoodEntity>
  ) {}

  getAll(): Promise<MoodEntity[]> {
    return this.moodRepository.find()
  }

  find({ moodSlug }: { moodSlug: MoodEntity["slug"] }): Promise<MoodEntity> {
    return this.moodRepository.findOneOrFail({ where: { slug: moodSlug } })
  }
}
