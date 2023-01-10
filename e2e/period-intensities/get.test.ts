import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get period intensities", () => {
  it("Find", async () => {
    const responseBody = await fetchGqlApi(`{
      periodIntensity(slug: "medium") {
        ${pickFields.periodIntensity}
      }
    }`)
    expect(responseBody.data).toEqual({
      periodIntensity: { slug: "medium" },
    })
  })

  it("Get all", async () => {
    const responseBody = await fetchGqlApi(`{
      periodIntensities {
        ${pickFields.periodIntensity}
      }
    }`)
    expect(responseBody.data).toEqual({
      periodIntensities: [{ slug: "light" }, { slug: "medium" }],
    })
  })
})
