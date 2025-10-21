import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { findAccountById } from "../service/account.service";
import {  updateOrderFields , applyDiscountToExisitngOrder,getTodayCompletedAndCanceledOrder ,toggleOrderStatus,popOrderItem ,mergeOrders ,updateOrderTable  ,getTodayOrdersByBranch ,updatePaymentMethod, updateOrderGrandTotal,popOrderItemAndGetTotal,getOrdersByBranch, createOrderService, checkIfTableExist , insertOrders, updateOrder, updateOrderStatus, findOrderById} from "../service/order.service";
import { deductIngredientStocks } from "../service/ingredient.service";
import { OrderInterface , OrderItem, getOrderInterface} from "../types/orders";
import { get30DaysSales, getYearlySales, getTopMenu , getTopCategory, getThisMonthSales, getToTalSales, getTodaySales} from "../utils/customFunction";
import { generateOrderNumber, removeOrderNumber } from "../service/orderNumber.service";

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

    const exisitingOrder  = await checkIfTableExist(request.body.table, request.body.branch);

    const orders : OrderItem[] = request.body.orders;


    orders.forEach(async (order) => {
        const orderQuantity = order.qty
        order.ingredients.forEach(async (ingredient) => {
            await deductIngredientStocks(ingredient.id, (orderQuantity * ingredient.qty), account.branch);
        })
    })

    if(exisitingOrder && exisitingOrder.table != "Take Away"){
        const order : getOrderInterface = request.body
        await updateOrder(exisitingOrder._id.toString(), order.total, order.subTotal, order.vat, order.grandTotal, order.totalDiscount, order.serviceFee)
        await insertOrders(exisitingOrder._id.toString(), request.body.orders);
        const updatedOrder = await findOrderById(exisitingOrder._id.toString())
        order.orderNumber = updatedOrder?.orderNumber ?? 0
        response.send(order)
        return 
    }


    const newOrder : OrderInterface = request.body

    newOrder.orderNumber = await generateOrderNumber(account.branch, newOrder.date)
    
    await createOrderService(newOrder)



    response.send(newOrder)
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

    const { id , paymentMethod , orderNumber} = request.body

    await updateOrderStatus(id)

    await updatePaymentMethod(id, paymentMethod)

    await removeOrderNumber(account.branch, orderNumber)

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

    const orders = await getTodayOrdersByBranch(account.branch, "completed");

    response.send(orders)

}


export const getOrderHistoryController = async (request: AuthRequest, response: Response) => {
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

    const formattedDate = new Date().toISOString().split('T')[0];
    const date = formattedDate.toString()

    const orders = await getTodayCompletedAndCanceledOrder(account.branch, date);

    response.send(orders)

}



export const getOrderHistoryByDateController = async (request: AuthRequest, response: Response) => {
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

    const { date } = request.params

    const orders = await getTodayCompletedAndCanceledOrder(account.branch, date);

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



export const refundOrderontroller = async (request: AuthRequest, response: Response) => {
    
   const { branch, order_id, item_id } = request.body

   const table = await popOrderItemAndGetTotal(order_id, item_id)

   const orders = await getOrdersByBranch(branch, "active");

   response.send({orders,table})
}


export const moveOrderontroller = async (request: AuthRequest, response: Response) => {
    
   const { branch, id, table } = request.body

  await updateOrderTable(id, table)
 
   const orders = await getOrdersByBranch(branch, "active");

   response.send(orders)
}


export const mergeOrderontroller = async (request: AuthRequest, response: Response) => {
    
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

   
   const id : string = request.body.id
   const ids : string[] = request.body.ids

   
    for (const item of ids) {
        await mergeOrders(id, item);
    }

    
 
   const orders = await getOrdersByBranch(account.branch, "active");
    

   response.send(orders)
}



export const splitOrderontroller = async (request: AuthRequest, response: Response) => {
    
   const id : string = request.body.id
   const ids : string[] = request.body.item_ids
   const branch = request.body.branch
   const order = request.body.order

   
    for (const item of ids) {
        await popOrderItem(id, item);
    }

    await createOrderService(order)

   const orders = await getOrdersByBranch(branch, "active");

   response.send(orders)
}





export const cancelOrderontroller = async (request: AuthRequest, response: Response) => {
    
    const { id } = request.params

    await toggleOrderStatus(id)
   
    response.send("sucess")
}


export const applyDiscountToOrderontroller = async (request: AuthRequest, response: Response) => {
    
    const { orderId, itemId } = request.body

    await applyDiscountToExisitngOrder(orderId, itemId)

    await updateOrderFields(orderId)
 
   
    response.send("sucess")
}



