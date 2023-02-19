import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Medication course creation", () => {
  test.each<{
    queryNameAndInput: string
    createdMedicationCourse: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createMedicationCourse(input: { name: "vitamin C" })`,
      createdMedicationCourse: {
        id: 4,
        name: "vitamin C",
        user: users.johnDoe,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdMedicationCourse, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation QUERY_NAME {
      ${queryNameAndInput} {
        ${pickFields.medicationCourse}
      }
    }`)
    expect(responseBody.data?.createMedicationCourse).toEqual(createdMedicationCourse)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  describe("Medication course created and found after creation", () => {
    it("created medicationCourse is found successfully", async () => {
      await fetchGqlApi(`mutation QUERY_NAME {
        createMedicationCourse(input:{ name: "vitamin C" }) {
          ${pickFields.medicationCourse}
        }
      }`)
      const fetchCreatedMedicationCourseResponseBody = await fetchGqlApi(`{
        medicationCourse(id: 4) {
          ${pickFields.medicationCourse}
        }
      }`)
      expect(fetchCreatedMedicationCourseResponseBody.data).toEqual({
        medicationCourse: {
          id: 4,
          name: "vitamin C",
          user: users.johnDoe,
        },
      })
    })
  })
})
