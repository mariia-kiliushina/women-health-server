import { moods } from "#e2e/constants/moods"
import { periodIntensities } from "#e2e/constants/period-intensities"
import { periodRecords } from "#e2e/constants/period-records"
import { symptoms } from "#e2e/constants/symptoms"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

describe("Period record updating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    updatedPeriodRecord: unknown
    responseError: unknown
  }>([
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updatePeriodRecord(input: { id: ${periodRecords[1].id}, date: "2023-10-09" })`,
      updatedPeriodRecord: undefined,
      responseError: { message: "Access denied." },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updatePeriodRecord(input: { id: ${periodRecords[1].id}, date: "234234" })`,
      updatedPeriodRecord: undefined,
      responseError: {
        fields: {
          date: "Should have format YYYY-MM-DD.",
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updatePeriodRecord(input: { id: ${periodRecords[1].id}, moodSlug: "NONEXISTENT_MOOD_SLUG" })`,
      updatedPeriodRecord: undefined,
      responseError: { fields: { moodSlug: "Invalid value." } },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updatePeriodRecord(input: { id: ${periodRecords[1].id}, intensitySlug: "NONEXISTENT_INTENSITY_SLUG" })`,
      updatedPeriodRecord: undefined,
      responseError: { fields: { intensitySlug: "Invalid value." } },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updatePeriodRecord(input: { id: ${periodRecords[1].id}, symptomsIds: [666666, 34234324] })`,
      updatedPeriodRecord: undefined,
      responseError: { fields: { symptomsIds: "Invalid value." } },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updatePeriodRecord(input: { id: ${periodRecords[1].id} })`,
      updatedPeriodRecord: periodRecords[1],
      responseError: undefined,
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updatePeriodRecord(input: {
        id: ${periodRecords[1].id},
        date: "2022-01-01",
        moodSlug: "${moods.sad.slug}",
        intensitySlug: "${periodIntensities.medium.slug}",
        symptomsIds: [${symptoms.acne.id}, ${symptoms.headache.id}]
      })`,
      updatedPeriodRecord: {
        id: periodRecords[1].id,
        date: "2022-01-01",
        mood: moods.sad,
        intensity: periodIntensities.medium,
        symptoms: [symptoms.acne, symptoms.headache],
        user: periodRecords[1].user,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedPeriodRecord, responseError }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`mutation UPDATE_PERIOD_RECORD {
      ${queryNameAndInput} {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.data?.updatePeriodRecord).toEqual(updatedPeriodRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("fetching updated period record returns actual data", async () => {
    await authorize(users.johnDoe.id)
    await fetchGqlApi(`mutation UPDATE_PERIOD_RECORD {
      updatePeriodRecord(input: {
        id: ${periodRecords[1].id},
        date: "2022-01-01",
        moodSlug: "${moods.sad.slug}",
        intensitySlug: "${periodIntensities.medium.slug}",
        symptomsIds: [${symptoms.acne.id}, ${symptoms.headache.id}]
      }) {
        ${pickFields.periodRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      periodRecord(id: ${periodRecords[1].id}) {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.data).toEqual({
      periodRecord: {
        id: periodRecords[1].id,
        date: "2022-01-01",
        mood: moods.sad,
        intensity: periodIntensities.medium,
        symptoms: [symptoms.headache, symptoms.acne],
        user: periodRecords[1].user,
      },
    })
  })
})
