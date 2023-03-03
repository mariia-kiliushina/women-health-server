import { eachDayOfInterval, format } from "date-fns"

const FORMAT = "yyyy-MM-dd"

export const getPeriodOfDates = (startDate: string, endDate: string) => {
  const newStartDate = format(new Date(startDate), FORMAT)
  const newEndDate = format(new Date(endDate), FORMAT)
  const dates = eachDayOfInterval({ start: new Date(newStartDate), end: new Date(newEndDate) })
  return dates.map((date) => format(date, FORMAT))
}
