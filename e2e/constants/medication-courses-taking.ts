import { medicationCourses } from "./medication-courses"

export const medicationCoursesTaking = {
  1: {
    id: 1,
    date: "2022-02-25",
    isTaken: true,
    medicationCourse: medicationCourses.duphaston,
    time: "10:00",
  },
  2: {
    id: 2,
    date: "2022-02-25",
    isTaken: false,
    medicationCourse: medicationCourses.duphaston,
    time: "22:00",
  },
  3: {
    id: 3,
    date: "2022-02-26",
    isTaken: false,
    medicationCourse: medicationCourses.zinc,
    time: "08:00",
  },
  4: {
    id: 4,
    date: "2022-02-27",
    isTaken: false,
    medicationCourse: medicationCourses.zinc,
    time: "08:00",
  },
} as const
