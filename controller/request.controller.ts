import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { createRequest, findRequestByBranch, findRequest, updateRequestStatus } from "../service/request.service";
import { findAccountById } from "../service/account.service";



export const createRequestController = async (request: AuthRequest, response: Response) => {

    const requestOrder = request.body

    await createRequest(requestOrder)

    response.send(requestOrder)
}



export const getRequuestByBranchController = async (request: AuthRequest, response: Response) => {
    if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    if(!account)
    {
        response.status(404).send("account not found");
        return;
    }


    const orderRequest = (account.branch != "Main Branch") ? await findRequestByBranch(account.branch) : await findRequest()

    response.send(orderRequest)
}
  
export const updateReqeustStatusController = async (request: AuthRequest, response: Response) => {
    const {id, status} = request.body
   updateRequestStatus(id, status)
   response.send("succes")
   
}
  
  










