import { Entity, PrimaryColumn } from "typeorm"

import { IPeriodIntensity } from "#interfaces/period-intensity"

@Entity("period_intensity")
export class PeriodIntensityEntity {
  @PrimaryColumn({ type: "varchar" })
  slug: IPeriodIntensity["slug"]
}
