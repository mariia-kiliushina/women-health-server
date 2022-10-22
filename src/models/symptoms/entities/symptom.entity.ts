import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { PeriodRecordEntity } from "#models/period-records/entities/period-record.entity"

import { ISymptom } from "#interfaces/symptoms"

@Entity("symptom")
export class SymptomEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: ISymptom["id"]

  @Column({ type: "varchar" })
  name: ISymptom["name"]

  @ManyToMany(() => PeriodRecordEntity, (periodRecord) => periodRecord.symptoms, { onDelete: "CASCADE" })
  periodRecords: PeriodRecordEntity[]
}
