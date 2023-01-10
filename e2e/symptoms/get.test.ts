import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get symptoms", () => {
  it("Find", async () => {
    const responseBody = await fetchGqlApi(`{
      symptom(id: 2) {
        ${pickFields.symptom}
      }
    }`)
    expect(responseBody.data).toEqual({
      symptom: { id: 2, name: "headache" },
    })
  })

  it("Get all", async () => {
    const responseBody = await fetchGqlApi(`{
      symptoms {
        ${pickFields.symptom}
      }
    }`)
    expect(responseBody.data).toEqual({
      symptoms: [
        { id: 1, name: "acne" },
        { id: 2, name: "headache" },
      ],
    })
  })
})
