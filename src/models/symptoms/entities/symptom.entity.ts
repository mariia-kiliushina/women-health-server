import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

// import { PeriodRecordEntity } from "#models/periods/entities/periods.entity"
import { ISymptom } from "#interfaces/symptoms"

@Entity("symptom")
export class SymptomEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: ISymptom["id"]

  @Column({ type: "varchar" })
  name: ISymptom["name"]

  // @ManyToMany(() => PeriodRecordEntity, (periodRecord) => periodRecord.symptoms, { onDelete: "CASCADE" })
  // @JoinTable()
  // periodRecords: PeriodRecordEntity[]
}
