import Request from "../model/request.model"
import { requestInterface } from "../types/orderRequest.type"



export const createRequest = async ( request : requestInterface) => {
    await Request.create(request)
}

export const findRequestByBranch = async ( branch  : string) => {
    return await Request.find({ branch : branch })
}

export const findRequest = async ( ) => {
    return await Request.find()
}

export const updateRequestStatus = async ( id : string, status : string ) => {
   await Request.findByIdAndUpdate(id, {status})
}
