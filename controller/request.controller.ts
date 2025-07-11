import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { createRequest, findRequestByBranch } from "../service/request.service";
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

    const orderRequest = await findRequestByBranch(account.branch)


    response.send(orderRequest)
}
  

  










