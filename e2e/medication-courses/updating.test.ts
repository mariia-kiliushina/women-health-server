import { medicationCourses } from "#e2e/constants/medication-courses"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

describe("Medication course updating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    updatedMedicationCourse: unknown
    responseError: unknown
  }>([
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updateMedicationCourse(input: { id: ${medicationCourses.duphaston.id}})`,
      updatedMedicationCourse: undefined,
      responseError: { message: "Access denied." },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateMedicationCourse(input: { id: ${medicationCourses.selen.id}, name:"magnesium"})`,
      updatedMedicationCourse: {
        id: medicationCourses.selen.id,
        name: "magnesium",
        user: medicationCourses.selen.user,
      },
      responseError: undefined,
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateMedicationCourse(input: { id: ${medicationCourses.selen.id} })`,
      updatedMedicationCourse: medicationCourses.selen,
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedMedicationCourse, responseError }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      ${queryNameAndInput} {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.data?.updateMedicationCourse).toEqual(updatedMedicationCourse)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("fetching updated medication course returns actual data", async () => {
    await authorize(users.johnDoe.id)
    await fetchGqlApi(`mutation QUERY_NAME {
      updateMedicationCourse(input: {
        id: ${medicationCourses.selen.id},
        name: "copper"
      }) {
        ${pickFields.medicationCourse}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      medicationCourse(id: ${medicationCourses.selen.id}) {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.data).toEqual({
      medicationCourse: {
        id: medicationCourses.selen.id,
        name: "copper",
        user: medicationCourses.selen.user,
      },
    })
  })
})
