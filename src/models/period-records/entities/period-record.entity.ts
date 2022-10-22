import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { SymptomEntity } from "#models/symptoms/entities/symptom.entity"
import { UserEntity } from "#models/users/entities/user.entity"

import { IPeriodRecord } from "#interfaces/periods"

@Entity("period_record")
export class PeriodRecordEntity {
  @Column({ type: "varchar" })
  date: IPeriodRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IPeriodRecord["id"]

  @Column({ type: "varchar" })
  intensity: IPeriodRecord["intensity"]

  @Column({ type: "varchar" })
  mood: IPeriodRecord["mood"]

  @ManyToMany(() => SymptomEntity, (symptom) => symptom.periodRecords, { onDelete: "CASCADE" })
  @JoinTable()
  symptoms: SymptomEntity[]

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  user: UserEntity
}
