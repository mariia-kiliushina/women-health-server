import { Entity, PrimaryColumn } from "typeorm"

import { IMood } from "#interfaces/mood"

@Entity("mood")
export class MoodEntity {
  @PrimaryColumn({ type: "varchar" })
  slug: IMood["slug"]
}
