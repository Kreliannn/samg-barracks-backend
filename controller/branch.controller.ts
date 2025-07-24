import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import { AuthRequest } from "../types/request.type";
import { createBranch, getBranch, findTableByBranch, updateTables, getBranchByBranch } from "../service/branch.service";
import { createAccount, findAccountByUsername } from "../service/account.service";
import { findAccountById } from "../service/account.service";
import { addBranchIngredientStock } from "../service/ingredient.service";
import { getMenu } from "../service/menu.service";
import { getIngredientsByBranch } from "../service/ingredient.service";
import { getTodaySales, getToTalSales } from "../utils/customFunction";
import { getOrdersByBranch } from "../service/order.service";
import { findRequest, findRequestByBranch } from "../service/request.service";

export const createBranchController = async (request: AuthRequest, response: Response) => {

    const account: accountInterface = request.body;
    const branchName = account.branch;

     if(await findAccountByUsername(account.username)){
        response.status(409).send("username already exist");
        return
    }

    try{
        await createAccount(account);
        await createBranch(branchName);
        await addBranchIngredientStock(branchName)
        const branch = await getBranch();
        response.send(branch);
    } catch (err) {
        console.log(err);
        response.status(500).send("error occurred")
    }
    
};

export const getTablesController = async (request: AuthRequest, response: Response) => {

   if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    if(!account)
    {
        response.status(500).send("no account")
        return
    }

    const tables = await findTableByBranch(account.branch)
    response.send(tables)
};

export const updateTableController = async (request: AuthRequest, response: Response) => {

   if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    if(!account)
    {
        response.status(500).send("no account")
        return
    }

    const branch = await getBranchByBranch(account.branch)

     if(!branch)
    {
        response.status(500).send("no branch found")
        return
    }

    const id = branch._id.toString()

    const { tables } = request.body
    
    await updateTables(id, tables)

    response.send("succes   ")
   
};


export const getBranchController = async (request: AuthRequest, response: Response) => {
    const branch = await getBranch()
    response.send(branch)
};



export const getManagerDashboardController = async (request: AuthRequest, response: Response) => {
   
     if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    if(!account)
    {
        response.status(500).send("no account")
        return
    }

    const orders = await getOrdersByBranch(account.branch, "completed")
    const orderRequest =  (account.branch == "Main Branch") ? await findRequest() : await findRequestByBranch(account.branch)
    const pendingRequest = orderRequest.filter((item) => item.status == "pending")
    const toShipRequest = orderRequest.filter((item) => item.status == "to ship")

    response.send({ 
        totalIngredients: (await getIngredientsByBranch()).length,
        totalMenus: (await getMenu()).length,
        salesToday: (await getToTalSales(orders)).toLocaleString(),
        pendingRequests: pendingRequest.length,
        toShipRequests: toShipRequest.length
    })
};