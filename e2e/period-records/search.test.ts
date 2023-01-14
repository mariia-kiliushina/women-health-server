import { periodRecords } from "#e2e/constants/periods"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Find period record", () => {
  test.each<{
    queryNameAndArgs: string
    foundRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `periodRecord(id: ${periodRecords[2].id})`,
      foundRecord: periodRecords[2],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `periodRecord(id: 3)`,
      foundRecord: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndArgs: `periodRecord(id: 666666)`,
      foundRecord: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.data?.periodRecord).toEqual(foundRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search for period records", () => {
  test.each<{
    queryNameAndArgs: string
    foundRecords: unknown[]
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `periodRecords(date: "2022-10-02")`,
      foundRecords: [periodRecords[1]],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `periodRecords(date: "2022-10-11")`,
      foundRecords: [],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `periodRecords(date: "1997-98-09")`,
      foundRecords: [],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `periodRecords`,
      foundRecords: [periodRecords[1], periodRecords[2]],
      responseError: undefined,
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundRecords, responseError }) => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.data?.periodRecords).toEqual(foundRecords)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})
