import { IMedicationCourse } from "./medication-course"

export interface IMedicationCourseTaking {
  date: string
  id: number
  isTaken: boolean
  medicationCourse: IMedicationCourse
  time: string
}
