import { moods } from "./moods"
import { periodIntensity } from "./period-intensities"
import { symptoms } from "./symptoms"
import { users } from "./users"

export const periodRecords = {
  "1": {
    date: "2022-10-02",
    id: 1,
    intensity: periodIntensity.light,
    mood: moods.good,
    symptoms: [symptoms.headache],
    user: users.johnDoe,
  },
  "2": {
    date: "2022-10-05",
    id: 2,
    intensity: periodIntensity.medium,
    mood: moods.good,
    symptoms: [symptoms.acne, symptoms.headache],
    user: users.johnDoe,
  },
  "3": {
    date: "2022-10-02",
    id: 3,
    intensity: periodIntensity.medium,
    mood: moods.sad,
    symptoms: [symptoms.acne],
    user: users.jessicaStark,
  },
  "4": {
    date: "2022-10-11",
    id: 4,
    intensity: periodIntensity.light,
    mood: moods.sad,
    symptoms: [symptoms.headache],
    user: users.jessicaStark,
  },
} as const
