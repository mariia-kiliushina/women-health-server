import { medicationCoursesTakings } from "#e2e/constants/medication-courses-takings"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

describe("Medication course taking updating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    updatedMedicationCoursesTaking: unknown
    responseError: unknown
  }>([
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updateMedicationCoursesTaking(input: { id: ${medicationCoursesTakings[1].id}})`,
      updatedMedicationCoursesTaking: undefined,
      responseError: { message: "Access denied." },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateMedicationCoursesTaking(input: {
        id: ${medicationCoursesTakings[1].id},
        isTaken: true,
        time: "14:00"
      })`,
      updatedMedicationCoursesTaking: {
        id: medicationCoursesTakings[1].id,
        date: medicationCoursesTakings[1].date,
        time: "14:00",
        isTaken: true,
        medicationCourse: medicationCoursesTakings[1].medicationCourse,
      },
      responseError: undefined,
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateMedicationCoursesTaking(input: { id: ${medicationCoursesTakings[1].id} })`,
      updatedMedicationCoursesTaking: medicationCoursesTakings[1],
      responseError: undefined,
    },
  ])(
    "$queryNameAndInput",
    async ({ authorizedUserId, queryNameAndInput, updatedMedicationCoursesTaking, responseError }) => {
      await authorize(authorizedUserId)
      const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      ${queryNameAndInput} {
        ${pickFields.medicationCourseTaking}
      }
    }`)
      expect(responseBody.data?.updateMedicationCoursesTaking).toEqual(updatedMedicationCoursesTaking)
      expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
    }
  )

  it("fetching updated medication course taking returns actual data", async () => {
    await authorize(users.johnDoe.id)
    await fetchGqlApi(`mutation QUERY_NAME {
      updateMedicationCoursesTaking(input: {
        id: ${medicationCoursesTakings[1].id},
        isTaken: true,
        time: "14:00"
      }) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      medicationCoursesTaking(id: ${medicationCoursesTakings[1].id}) {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.data).toEqual({
      medicationCoursesTaking: {
        id: medicationCoursesTakings[1].id,
        date: medicationCoursesTakings[1].date,
        time: "14:00",
        isTaken: true,
        medicationCourse: medicationCoursesTakings[1].medicationCourse,
      },
    })
  })
})
