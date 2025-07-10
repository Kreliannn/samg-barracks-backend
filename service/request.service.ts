import Request from "../model/request.model"
import { requestInterface } from "../types/orderRequest.type"



export const createRequest = async ( request : requestInterface) => {
    await Request.create(request)
}