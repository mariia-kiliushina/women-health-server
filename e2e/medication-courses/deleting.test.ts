import { medicationCourses } from "#e2e/constants/medication-courses"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Medication course deletion", () => {
  it("prevents deleting other user's medication courses", async () => {
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      deleteMedicationCourse(id: ${medicationCourses.zinc.id}) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
  })

  it("deleting returns a correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      deleteMedicationCourse(id: ${medicationCourses.duphaston.id}) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteMedicationCourse: medicationCourses.duphaston })
  })

  it("the deleted record is not found", async () => {
    await fetchGqlApi(`mutation QUERY_NAME {
      deleteMedicationCourse(id: ${medicationCourses.duphaston.id}) {
        ${pickFields.medicationCourse}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      medicationCourse(id: ${medicationCourses.duphaston.id}) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})
