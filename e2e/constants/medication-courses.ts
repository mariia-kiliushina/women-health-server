import { users } from "./users"

export const medicationCourses = {
  duphaston: {
    id: 1,
    name: "duphaston",
    user: users.johnDoe,
  },
  selen: {
    id: 2,
    name: "selen",
    user: users.johnDoe,
  },
  zinc: {
    id: 3,
    name: "zinc",
    user: users.jessicaStark,
  },
} as const
