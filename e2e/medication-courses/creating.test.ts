import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Medication course and medication course takings creation", () => {
  test.each<{
    queryNameAndInput: string
    createdMedicationCourse: unknown
    createdMedicationCourseTakings: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createMedicationCourse(input: { 
        endDate: "2024-10-21",
        name: "vitamin C",
        startDate: "2024-10-20",
        times: ["09:00","16:00"], 
      })`,
      createdMedicationCourse: {
        id: 4,
        name: "vitamin C",
        user: users.johnDoe,
      },
      createdMedicationCourseTakings: [
        {
          date: "2024-10-20",
          id: 5,
          isTaken: false,
          medicationCourse: {
            id: 4,
            name: "vitamin C",
            user: users.johnDoe,
          },
          time: "09:00",
        },
        {
          date: "2024-10-20",
          id: 6,
          isTaken: false,
          medicationCourse: {
            id: 4,
            name: "vitamin C",
            user: users.johnDoe,
          },
          time: "16:00",
        },
        {
          date: "2024-10-21",
          id: 7,
          isTaken: false,
          medicationCourse: {
            id: 4,
            name: "vitamin C",
            user: users.johnDoe,
          },
          time: "09:00",
        },
        {
          date: "2024-10-21",
          id: 8,
          isTaken: false,
          medicationCourse: {
            id: 4,
            name: "vitamin C",
            user: users.johnDoe,
          },
          time: "16:00",
        },
      ],
      responseError: undefined,
    },
  ])(
    "$queryNameAndInput",
    async ({ queryNameAndInput, createdMedicationCourse, createdMedicationCourseTakings, responseError }) => {
      const responseBodyOnCreate = await fetchGqlApi(`mutation QUERY_NAME {
      ${queryNameAndInput} {
        ${pickFields.medicationCourse}
      }
    }`)
      expect(responseBodyOnCreate.data?.createMedicationCourse).toEqual(createdMedicationCourse)
      const ids = [5, 6, 7, 8]

      const getMedicationCoursesTakings = async (ids: number[]) => {
        const array = []
        for (const id of ids) {
          const medicationCoursesTaking = await fetchGqlApi(`query QUERY_NAME {
            medicationCoursesTaking(id: ${id}) {
              ${pickFields.medicationCourseTaking}
            }
          }`)

          array.push(await medicationCoursesTaking.data.medicationCoursesTaking)
        }
        return array
      }

      const medicationCoursesTakingsFetched = await getMedicationCoursesTakings(ids)

      expect(medicationCoursesTakingsFetched).toEqual(createdMedicationCourseTakings)
      expect(responseBodyOnCreate.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
    }
  )

  describe("Medication course created and found after creation", () => {
    it("created medicationCourse is found successfully", async () => {
      await fetchGqlApi(`mutation QUERY_NAME {
        createMedicationCourse(input:{ 
          endDate: "2024-10-21",
          name: "vitamin C",
          startDate: "2024-10-20",
          times: ["09:00","16:00"],
         }) {
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
