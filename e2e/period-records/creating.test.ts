import { moods } from "#e2e/constants/moods"
import { periodIntensities } from "#e2e/constants/period-intensities"
import { symptoms } from "#e2e/constants/symptoms"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Period record creating", () => {
  test.each<{
    queryNameAndInput: string
    createdPeriodRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createPeriodRecord(input: {
        date: "2023-01-19",
        intensitySlug: "${periodIntensities.medium.slug}",
        moodSlug: "${moods.good.slug}",
        symptomsIds: [${symptoms.acne.id}, ${symptoms.headache.id}],
      })`,
      createdPeriodRecord: {
        date: "2023-01-19",
        id: 5,
        intensity: periodIntensities.medium,
        mood: moods.good,
        symptoms: [symptoms.acne, symptoms.headache],
        user: users.johnDoe,
      },
      responseError: undefined,
    },
    {
      queryNameAndInput: `createPeriodRecord(input: {
        date: "A_DATE_OF_INVALID_FORMAT",
        intensitySlug: "${periodIntensities.medium.slug}",
        moodSlug: "${moods.good.slug}",
        symptomsIds: [${symptoms.acne.id}, ${symptoms.headache.id}],
      })`,
      createdPeriodRecord: undefined,
      responseError: {
        fields: {
          date: "Should have format YYYY-MM-DD.",
        },
      },
    },
    {
      queryNameAndInput: `createPeriodRecord(input: {
        date: "2023-01-19",
        intensitySlug: "NONEXISTENT_INTENSITY_SLUG",
        moodSlug: "${moods.good.slug}",
        symptomsIds: [${symptoms.acne.id}],
      })`,
      createdPeriodRecord: undefined,
      responseError: {
        fields: {
          intensitySlug: "Invalid value.",
        },
      },
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdPeriodRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation CREATE_PERIOD_RECORD {
      ${queryNameAndInput} {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.data?.createPeriodRecord).toEqual(createdPeriodRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("created periodRecord is found successfully", async () => {
    await fetchGqlApi(`mutation CREATE_PERIOD_RECORD {
      createPeriodRecord(input:{
        date: "2023-01-19",
        moodSlug: "${moods.good.slug}",
        intensitySlug: "${periodIntensities.medium.slug}",
        symptomsIds: [${symptoms.acne.id}, ${symptoms.headache.id}],
      }) {
        ${pickFields.periodRecord}
      }
    }`)
    const fetchcreatedPeriodRecordResponseBody = await fetchGqlApi(`{
      periodRecord(id: 5) {
        ${pickFields.periodRecord}
      }
    }`)
    expect(fetchcreatedPeriodRecordResponseBody.data).toEqual({
      periodRecord: {
        date: "2023-01-19",
        id: 5,
        intensity: periodIntensities.medium,
        mood: moods.good,
        symptoms: [symptoms.acne, symptoms.headache],
        user: users.johnDoe,
      },
    })
  })
})
