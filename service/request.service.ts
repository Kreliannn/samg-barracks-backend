import Request from "../model/request.model"
import { requestInterface } from "../types/orderRequest.type"



export const createRequest = async ( request : requestInterface) => {
    await Request.create(request)
}

export const findRequestByBranch = async ( branch  : string) => {
    return await Request.find({ branch : branch })
}

export const findRequestById = async ( id  : string) => {
    return await Request.findById(id)
}

export const findRequest = async ( ) => {
    return await Request.find()
}

export const findByIdRequest = async ( id : string ) => {
    return await Request.findById(id)
}

export const updateRequestStatus = async ( id : string, status : string ) => {
   await Request.findByIdAndUpdate(id, {status})
}


export const deleteRequestByBranch = async (branch : string ) => {
  await Request.deleteMany({branch})
}
