import Change from "../model/change.model"
import { changeInterface, getChangeInterface } from "../types/change.type"

export const createChange = async (change: changeInterface) => {
  return await Change.create(change)
}

export const findChangeByDate = async (date: string, branch : string) => {
  return await Change.findOne({date, branch})
}


export const updateChange = async (id : string, newChange : number) => {
  const change = await Change.findById(id)
  if(!change) return
  change.change = newChange
  await change.save()
}


