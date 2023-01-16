import { periodRecords } from "#e2e/constants/period-records"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Record deleting", () => {
  it("restricts deleting others' period records", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_RECORD{
      deletePeriodRecord(id: ${periodRecords[4].id}) {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
  })

  it("deleting returns a correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_RECORD {
      deletePeriodRecord(id: ${periodRecords[1].id}) {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.data).toEqual({ deletePeriodRecord: periodRecords[1] })
  })

  it("the deleted record is not found", async () => {
    await fetchGqlApi(`mutation DELETE_RECORD {
      deletePeriodRecord(id: ${periodRecords[1].id}) {
        ${pickFields.periodRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      periodRecord(id: ${periodRecords[1].id}) {
        ${pickFields.periodRecord}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})
