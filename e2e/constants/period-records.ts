import { symptoms } from "./symptoms"
import { users } from "./users"

export const periodRecords = {
  "1": {
    date: "2022-10-02",
    id: 1,
    intensity: "light",
    mood: "good",
    symptoms: [symptoms.headache],
    user: users.johnDoe,
  },
  "2": {
    date: "2022-10-05",
    id: 2,
    intensity: "medium",
    mood: "good",
    symptoms: [symptoms.acne, symptoms.headache],
    user: users.johnDoe,
  },
  "3": {
    date: "2022-10-02",
    id: 3,
    intensity: "medium",
    mood: "sad",
    symptoms: [symptoms.acne],
    user: users.jessicaStark,
  },
  "4": {
    date: "2022-10-11",
    id: 4,
    intensity: "light",
    mood: "sad",
    symptoms: [symptoms.headache],
    user: users.jessicaStark,
  },
} as const
