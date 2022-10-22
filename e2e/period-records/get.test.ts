import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Get period records", () => {
  it("Find", async () => {
    const responseBody = await fetchGqlApi(`{
      periodRecord(id: 2) {
        date
        id
        intensity
        mood
        symptoms {
          id
          name
        }
        user {
          id
          password
          username
        }
      }
    }`)
    expect(responseBody.data).toEqual({
      periodRecord: {
        date: "2022-10-05",
        id: 2,
        intensity: "no-flow",
        mood: "good",
        symptoms: [{ id: 2, name: "headache" }],
        user: users.johnDoe,
      },
    })
  })

  // it("Get all", async () => {
  //   const responseBody = await fetchGqlApi(`{
  //     periodRecords {
  //       date
  //       intensity
  //       mood
  //       symptoms {id, name}
  //     }
  //   }`)
  //   expect(responseBody.data).toEqual({
  //     periods: [
  //       { date: "2022-10-02", intensity: "no-flow", mood: "good", symptoms: ["headache"], userId: 1 },
  //       { date: "2022-10-05", intensity: "no-flow", mood: "good", symptoms: ["headache"], userId: 1 },
  //       { date: "2022-10-09", intensity: "medium", mood: "frisky", symptoms: ["acne"], userId: 2 },
  //       { date: "2022-10-11", intensity: "heavy", mood: "sad", symptoms: ["headache"], userId: 2 },
  //     ],
  //   })
  // })
})
