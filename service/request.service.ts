import Request from "../model/request.model"
import { requestInterface } from "../types/orderRequest.type"



export const createRequest = async ( request : requestInterface) => {
    await Request.create(request)
}

export const findRequestByBranch = async ( branch  : string) => {
    return await Request.find({ branch : branch })
}