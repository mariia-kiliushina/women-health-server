import { medicationCourses } from "#e2e/constants/medication-courses"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Medication course taking creation", () => {
  test.each<{
    queryNameAndInput: string
    createdMedicationCourseTaking: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createMedicationCoursesTaking(input: {
        date: "2022-02-27",
        medicationCourseId: 2,
        time: "8:00",
     })`,
      createdMedicationCourseTaking: undefined,
      responseError: { fields: { time: "Should have format HH:mm." } },
    },
    {
      queryNameAndInput: `createMedicationCoursesTaking(input: {
        date: "2022-02-27",
        medicationCourseId: 2,
        time: "08:00",
     })`,
      createdMedicationCourseTaking: {
        id: 5,
        date: "2022-02-27",
        isTaken: false,
        time: "08:00",
        medicationCourse: medicationCourses.selen,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdMedicationCourseTaking, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      ${queryNameAndInput} {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.data?.createMedicationCoursesTaking).toEqual(createdMedicationCourseTaking)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Medication course taking created and found after creation", () => {
  it("created medicationCourse has been found successfully", async () => {
    await fetchGqlApi(`mutation QUERY_NAME {
        createMedicationCoursesTaking(input:{
          date: "2022-02-27",
          time: "08:00",
          medicationCourseId: 2,
        }) {
          ${pickFields.medicationCourseTaking}
        }
      }`)

    const fetchCreatedMedicationCourseResponseBody = await fetchGqlApi(`{
         medicationCoursesTaking(id: 5) {
          ${pickFields.medicationCourseTaking}
        }
      }`)

    console.log(fetchCreatedMedicationCourseResponseBody.data)
    console.log(fetchCreatedMedicationCourseResponseBody.errors?.[0])

    expect(fetchCreatedMedicationCourseResponseBody.data).toEqual({
      medicationCoursesTaking: {
        id: 5,
        date: "2022-02-27",
        isTaken: false,
        medicationCourse: medicationCourses.selen,
        time: "08:00",
      },
    })
  })
})
