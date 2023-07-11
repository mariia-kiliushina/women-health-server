import { medicationCoursesTakings } from "#e2e/constants/medication-courses-takings"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.jessicaStark.id)
})

describe("Find medication courses takings", () => {
  test.each<{
    queryNameAndArgs: string
    foundTakings: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `medicationCoursesTakings(dates:
        ["${medicationCoursesTakings[3].date}","${medicationCoursesTakings[4].date}"])`,
      foundTakings: [medicationCoursesTakings[3], medicationCoursesTakings[4]],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `medicationCoursesTakings(dates: ["${medicationCoursesTakings[1].date}"])`,
      foundTakings: [],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `medicationCoursesTakings(dates: ["1000-12-11"])`,
      foundTakings: [],
      responseError: undefined,
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundTakings, responseError }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.medicationCourseTaking}
      }
    }`)
    expect(responseBody.data?.medicationCoursesTakings).toEqual(foundTakings)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})
