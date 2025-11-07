import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import { AuthRequest } from "../types/request.type";
import {  deleteByBranch,createBranch, getBranch, findTableByBranch, updateTables, getBranchByBranch } from "../service/branch.service";
import { createAccount, findAccountByUsername } from "../service/account.service";
import { findAccountById , deleteAccountByBranch} from "../service/account.service";
import { addBranchIngredientStock, popIngredientStockByBranch } from "../service/ingredient.service";
import { getMenu } from "../service/menu.service";
import { getIngredientsByBranch } from "../service/ingredient.service";
import { getTodaySales, getToTalSales, getTodayDiscount } from "../utils/customFunction";
import { getOrdersByBranch , deleteOrderByBranch} from "../service/order.service";
import { findRequest, findRequestByBranch, deleteRequestByBranch } from "../service/request.service";
import { branchInterface } from "../types/branch.type";
import { deleteOrderNumberByBranch } from "../service/orderNumber.service";
import { createChange, updateChange, findChangeByDate } from "../service/change.service";
import { changeInterface } from "../types/change.type";
import { getDate } from "../utils/customFunction";
import { createActivity , getActivity} from "../service/activities.service";



export const createBranchController = async (request: AuthRequest, response: Response) => {

    const account: accountInterface = request.body;
    const branchName = account.branch;

     if(await findAccountByUsername(account.username)){
        response.status(409).send("username already exist");
        return
    }

    if(await getBranchByBranch(branchName)){
        response.status(409).send("branch already exist");
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

    await createActivity(account.fullname, account.branch, "manager", `Edit Table Layout`)

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

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });


    const orders = await getOrdersByBranch(account.branch, "completed")
    const orderRequest =  (account.branch == "Main Branch") ? await findRequest() : await findRequestByBranch(account.branch)
    const pendingRequest = orderRequest.filter((item) => item.status == "pending")
    const toShipRequest = orderRequest.filter((item) => item.status == "to ship")

    
    const orderToday = orders.filter((order) => order.date == getDate(time))

   
  
    response.send({ 
        totalIngredients: (await getIngredientsByBranch()).length,
        totalMenus: (await getMenu()).length,
        salesToday: (await getToTalSales(orderToday)).toLocaleString(),
        pendingRequests: pendingRequest.length,
        toShipRequests: toShipRequest.length,
        discountToday : (await getTodayDiscount(orders, getDate(time) ))
    })
};



export const getCashierDashboardController = async (request: AuthRequest, response: Response) => {
   
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

    const {date} = request.params

    
  

    const orders = await getOrdersByBranch(account.branch, "completed")

    const activeTable =  await getOrdersByBranch(account.branch, "active")

    const ordersToday = orders.filter((item) => item.date == date)

    console.log("cash",ordersToday.length)

    response.send({ 
        activeTatble:(activeTable.length),
        salesToday: (await getToTalSales(ordersToday)).toLocaleString(),
    })
};



export const deleteBranch = async (request: AuthRequest, response: Response) => {
   const  { branch } = request.params

   await deleteByBranch(branch)

   await deleteAccountByBranch(branch)

   await deleteOrderNumberByBranch(branch)
   
   await deleteOrderByBranch(branch)

   await deleteRequestByBranch(branch)

   await popIngredientStockByBranch(branch)

    const allbranch = await getBranch();

    response.send(allbranch);
};


export const changeController = async (request: AuthRequest, response: Response) => {

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

   const  change : changeInterface = request.body
   const changeRecord = await findChangeByDate(change.date, account.branch )

   if(changeRecord){
     await updateChange(changeRecord._id.toString(), change.change)
   } else {
     await createChange(change)
   }

   response.send("success")
};


export const getChangeController = async (request: AuthRequest, response: Response) => {
   
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

    const {date} = request.params


    const res = await findChangeByDate(date, account.branch )

    const  change = res ?  res.change : 0

    response.send({ change })
};



export const getBranchActivities = async (request: AuthRequest, response: Response) => {
   
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

    const activities = await getActivity(account.branch)

    response.send(activities)
};

