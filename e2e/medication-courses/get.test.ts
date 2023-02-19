import { medicationCourses } from "#e2e/constants/medication-courses"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get medication course", () => {
  it("Finds existing course successfully", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCourse(id: 2) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.data).toEqual({ medicationCourse: medicationCourses.selen })
  })

  it("Returns an appropriate error when finding a nonexisting course", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCourse(id: 78787) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response.message).toEqual("Not found.")
  })

  it("Returns an appropriate error when finding a course of another user", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCourse(id: 3) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response.message).toEqual("Access denied.")
  })
})

describe("Search for medication courses", () => {
  it("Search for all courses", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCourses {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.data).toEqual({
      medicationCourses: [medicationCourses.duphaston, medicationCourses.selen],
    })
  })
})
