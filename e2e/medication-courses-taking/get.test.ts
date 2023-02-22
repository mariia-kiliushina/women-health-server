import { medicationCoursesTaking } from "#e2e/constants/medication-courses-taking"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get medication course taking", () => {
  it("Finds existing course taking successfully", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCoursesTaking(id: 2) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.data).toEqual({ medicationCoursesTaking: medicationCoursesTaking[2] })
  })

  it("Returns an appropriate error when finding a nonexisting course taking", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCoursesTaking(id: 78787) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response.message).toEqual("Not found.")
  })

  it("Returns an appropriate error when finding a course taking of another user", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCoursesTaking(id: 3) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response.message).toEqual("Access denied.")
  })
})

describe("Search for medication courses", () => {
  it("Search for all courses", async () => {
    const responseBody = await fetchGqlApi(`{
      medicationCoursesTakings {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.data).toEqual({
      medicationCoursesTakings: [medicationCoursesTaking[1], medicationCoursesTaking[2]],
    })
  })
})
