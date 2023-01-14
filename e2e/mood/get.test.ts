import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get mood", () => {
  it("Find", async () => {
    const responseBody = await fetchGqlApi(`{
      mood(slug: "good") {
        ${pickFields.mood}
      }
    }`)
    expect(responseBody.data).toEqual({
      mood: { slug: "good" },
    })
  })

  it("Get all", async () => {
    const responseBody = await fetchGqlApi(`{
      moods {
        ${pickFields.mood}
      }
    }`)
    expect(responseBody.data).toEqual({
      moods: [{ slug: "good" }, { slug: "sad" }],
    })
  })
})
