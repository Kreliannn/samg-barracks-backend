import Refill from "../model/refill.model"
import { refillInterface } from "../types/refill.type"

export const createRefill = async (refill: refillInterface) => {
  return await Refill.create(refill)
}

export const findRefillByDate = async (branch : string, date: string) => {
  return await Refill.find({branch, date})
}



