import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { findAccountById } from "../service/account.service";
import { getOrdersByBranch, createOrderService, checkIfTableExist , insertOrders, updateOrder, updateOrderStatus} from "../service/order.service";
import { deductIngredientStocks } from "../service/ingredient.service";
import { OrderInterface , OrderItem, getOrderInterface} from "../types/orders";
import { get30DaysSales, getYearlySales, getTopMenu , getTopCategory, getThisMonthSales, getToTalSales, getTodaySales} from "../utils/customFunction";

export const createOrderController = async (request: AuthRequest, response: Response) => {
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

    const orderId  = await checkIfTableExist(request.body.table, request.body.branch);

    const orders : OrderItem[] = request.body.orders;

    orders.forEach(async (order) => {
        const orderQuantity = order.qty
        order.ingredients.forEach(async (ingredient) => {
            await deductIngredientStocks(ingredient.id, (orderQuantity * ingredient.qty), account.branch);
        })
    })

    if(orderId){
        const order : getOrderInterface = request.body
        await updateOrder(orderId, order.total, order.subTotal, order.vat, order.grandTotal, order.totalDiscount, order.serviceFee)
        await insertOrders(orderId, request.body.orders);
        response.send("success");
        return
    }

 
    
    await createOrderService(request.body)

   response.send("success")
}



export const updateStatusOrderController = async (request: AuthRequest, response: Response) => {
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

    await updateOrderStatus(id)

    const orders = await getOrdersByBranch(account.branch, "active");

   response.send(orders)
}


export const getActiveOrderController = async (request: AuthRequest, response: Response) => {
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

    const orders = await getOrdersByBranch(account.branch, "active");

    response.send(orders)
}


export const getCompletedOrderController = async (request: AuthRequest, response: Response) => {
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

    const orders = await getOrdersByBranch(account.branch, "completed");

    response.send(orders)

}


export const getBranchSalesController = async (request: AuthRequest, response: Response) => {
    
    const { branch } = request.params

    const orders = await getOrdersByBranch(branch, "completed");

    console.log(getTopCategory(orders))

    response.send({
        todaySales : getTodaySales(orders),
        totalSales :  getToTalSales(orders),
        thisMonthSales :  getThisMonthSales(orders),
        last30days : get30DaysSales(orders),
        topCategory :  getTopCategory(orders),
        topMenu : getTopMenu(orders),
        yearlySales : getYearlySales(orders)
    })
}