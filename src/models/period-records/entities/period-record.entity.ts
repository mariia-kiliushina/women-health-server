import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { MoodEntity } from "#models/mood/entities/mood.entity"
import { PeriodIntensityEntity } from "#models/period-intensity/entities/period-intensity.entity"
import { SymptomEntity } from "#models/symptoms/entities/symptom.entity"
import { UserEntity } from "#models/users/entities/user.entity"

import { IPeriodRecord } from "#interfaces/periods"

@Entity("period_record")
export class PeriodRecordEntity {
  @Column({ type: "varchar" })
  date: IPeriodRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IPeriodRecord["id"]

  @ManyToOne(() => PeriodIntensityEntity, { onDelete: "CASCADE" })
  intensity: PeriodIntensityEntity

  @ManyToOne(() => MoodEntity, { onDelete: "CASCADE" })
  mood: MoodEntity

  @ManyToMany(() => SymptomEntity, (symptom) => symptom.periodRecords, { onDelete: "CASCADE" })
  @JoinTable()
  symptoms: SymptomEntity[]

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity
}
