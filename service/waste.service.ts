import Waste from "../model/waste.model"
import { wasteInterface } from "../types/waste.type"

export const createWaste = async (data: wasteInterface) => {
  return await Waste.create(data)
}

export const findYearlyWasteByBranch = async (branch: string) => {
  const year = new Date().getFullYear()
  const startOfYear = `${year}-01-01`
  const endOfYear = `${year}-12-31`

  return await Waste.find({
    branch,
    date: { $gte: startOfYear, $lte: endOfYear },
  })
}


export const findMonthWasteByBranch = async (branch: string, month: number) => {
  const year = new Date().getFullYear()

  const monthStr = month.toString().padStart(2, "0")

  const startOfMonth = `${year}-${monthStr}-01`

  const endOfMonthDate = new Date(year, month, 0) 
  const endOfMonth = `${year}-${monthStr}-${endOfMonthDate.getDate().toString().padStart(2, "0")}`

  return await Waste.find({
    branch,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  })
}


