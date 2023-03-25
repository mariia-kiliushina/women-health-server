import { IMood } from "./mood"
import { IPeriodIntensity } from "./period-intensity"
import { ISymptom } from "./symptoms"
import { IUser } from "./user"

export interface IPeriodRecord {
  date: string
  id: number
  intensity: IPeriodIntensity | null
  mood: IMood | null
  symptoms: ISymptom[]
  user: IUser
}
