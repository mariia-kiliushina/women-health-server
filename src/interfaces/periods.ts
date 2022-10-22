import { ISymptom } from "./symptoms"
import { IUser } from "./user"

type Intensity = "no-flow" | "light" | "medium" | "heavy"

export interface IPeriodRecord {
  date: string
  id: number
  intensity: Intensity
  mood: string
  symptoms: ISymptom[]
  user: IUser
}
