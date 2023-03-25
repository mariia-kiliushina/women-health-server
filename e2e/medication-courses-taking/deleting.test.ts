import { medicationCoursesTakings } from "#e2e/constants/medication-courses-takings"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Medication course taking deletion", () => {
  it("prevents deleting other user's medication courses taking", async () => {
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      deleteMedicationCoursesTaking(id: ${medicationCoursesTakings[3].id}) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
  })

  it("deleting returns a correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      deleteMedicationCoursesTaking(id: ${medicationCoursesTakings[1].id}) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteMedicationCoursesTaking: medicationCoursesTakings[1] })
  })

  it("the deleted record is not found", async () => {
    await fetchGqlApi(`mutation QUERY_NAME {
      deleteMedicationCoursesTaking(id: ${medicationCoursesTakings[1].id}) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      medicationCoursesTaking(id: ${medicationCoursesTakings[1].id}) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})
