import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { createRequest, findRequestByBranch, findRequest, updateRequestStatus , findByIdRequest, findRequestById} from "../service/request.service";
import { findAccountById } from "../service/account.service";
import { deductIngredientStocks, addBranchIngredientStock, addIngredientStocks } from "../service/ingredient.service";
import { createActivity } from "../service/activities.service";

export const createRequestController = async (request: AuthRequest, response: Response) => {

    const requestOrder = request.body

    await createRequest(requestOrder)


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


    const orderRequest =  await findRequestByBranch(account.branch) 

    await createActivity(account.fullname, account.branch, "manager", `Request Ingredient To MainBranch`)

    response.send(orderRequest)

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


export const getRequuestByIdController = async (request: AuthRequest, response: Response) => {
    const { id } = request.body
    try{
        const requestItem = await findRequestById(id)
        response.send(requestItem)
    } catch {
        response.status(500).send("error")
    }
}
  
export const updateReqeustStatusController = async (request: AuthRequest, response: Response) => {
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

    
   const {id, status} = request.body
   await updateRequestStatus(id, status)


   const orderRequest = await findByIdRequest(id)

   if(status == "to ship"){
       

        if(!orderRequest){
            response.status(500).send("error")
            return
        }

        orderRequest.request.forEach( async (item) => {
            await deductIngredientStocks(item.id, item.quantity , "Main Branch")
        })
   }

   const text = (status == "to ship") ? `approve ${orderRequest?.branch} request` : `reject ${orderRequest?.branch} request`

   await createActivity(account.fullname, account.branch, "manager", text)

   response.send("succes")
}
  

export const CompletedReqeustStatusController = async (request: AuthRequest, response: Response) => {
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
    
    const { id } = request.body

    const orderRequest = await findByIdRequest(id)

     if(!orderRequest){
        response.status(500).send("error")
        return
     }

    await updateRequestStatus(id, "completed")
    
    const branch = orderRequest.branch as string

   
   
    orderRequest.request.forEach( async (item) => {
        await addIngredientStocks(item._id, item.quantity , branch)
    })
   
    const newOrderRequest =  await findRequestByBranch(branch)


    await createActivity(account.fullname, account.branch, "manager", `Request ingridient Received`)

    response.send(newOrderRequest)
}
  










