import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { findAccountById } from "../service/account.service";
import {updateOrderStatusToPending, startTimer, updateOrderFields , applyDiscountToExisitngOrder,getTodayCompletedAndCanceledOrder ,toggleOrderStatus,popOrderItem ,mergeOrders ,updateOrderTable  ,getTodayOrdersByBranch ,updatePaymentMethod, updateOrderGrandTotal,popOrderItemAndGetTotal,getOrdersByBranch, createOrderService, checkIfTableExist , insertOrders, updateOrder, updateOrderStatus, findOrderById} from "../service/order.service";
import { deductIngredientStocks } from "../service/ingredient.service";
import { OrderInterface , OrderItem, getOrderInterface} from "../types/orders";
import {   getOrdersByDateRange ,getThisMonthOrders, getThisWeekOrders,getTodayOrders, getThisWeekSales, getToTalTax,get30DaysSales, getYearlySales, getTopMenu , getTopCategory, getThisMonthSales, getToTalSales, getTodaySales} from "../utils/customFunction";
import { generateOrderNumber, removeOrderNumber } from "../service/orderNumber.service";

export const createOrderController = async (request: AuthRequest, response: Response) => {
    if (!request.id) {
         response.status(500).send("not authenticated");
         return
    }

    const account = await findAccountById(request.id);
    if (!account){
        response.status(404).send("account not found");
        return
    }  

    const existingOrder = await checkIfTableExist(request.body.table, request.body.branch);
    const orders: OrderItem[] = request.body.orders;

    // FIXED: sequential async loops
    for (const order of orders) {
        const orderQuantity = order.qty;
        for (const ingredient of order.ingredients) {
            await deductIngredientStocks(
                ingredient.id,
                orderQuantity * ingredient.qty,
                account.branch
            );
        }
    }

    if (existingOrder && existingOrder.table != "Take Away") {
        const order: getOrderInterface = request.body;
        await updateOrder(
            existingOrder._id.toString(),
            order.total,
            order.subTotal,
            order.vat,
            order.grandTotal,
            order.totalDiscount,
            order.serviceFee
        );
        await insertOrders(existingOrder._id.toString(), request.body.orders);
        const updatedOrder = await findOrderById(existingOrder._id.toString());
        order.orderNumber = updatedOrder?.orderNumber ?? 0;
         response.send(order);
         return
    }

    const newOrder: OrderInterface = request.body;
    newOrder.orderNumber = await generateOrderNumber(account.branch, newOrder.date);
    await createOrderService(newOrder);

    response.send(newOrder);
};




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

// temporary delete later
export const TEMPORARYupdateStatusOrderController = async (request: AuthRequest, response: Response) => {
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

   
    await updateOrderStatusToPending(id) 

    await updatePaymentMethod(id, paymentMethod)

    const orders = await getOrdersByBranch(account.branch, "active");

   response.send(orders)
}

// temporary delete later
export const TEMPORARYCompleteStatusOrderController = async (request: AuthRequest, response: Response) => {
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

    const { id, orderNumber} = request.body

    await updateOrderStatus(id)

    await removeOrderNumber(account.branch, orderNumber)

    const orders = await getOrdersByBranch(account.branch, "pending");

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

    console.log(orders)

    response.send(orders)
}


export const getPendingeOrderController = async (request: AuthRequest, response: Response) => {
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

    const orders = await getOrdersByBranch(account.branch, "pending");

    console.log(orders)

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

    const formattedDate = new Date().toLocaleDateString('en-CA');
    const date = formattedDate.toString()

    console.log(date)

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
    
    const { branch, type} = request.params

    const orders = await getOrdersByBranch(branch, "completed");

    let filteredOrders = orders


    switch(type)
    {
        case "today":
            filteredOrders = getTodayOrders(orders)
        break;

        case "week":
            filteredOrders = getThisWeekOrders(orders)
        break;

        case "month":
            filteredOrders = getThisMonthOrders(orders)
        break;
    }
    
    response.send({
        totalSales :  getToTalSales(filteredOrders),
        totalTax :  getToTalTax(filteredOrders), 
        totalTransaction :  filteredOrders.length, 
        topCategory :  getTopCategory(filteredOrders), 
        topMenu : getTopMenu(filteredOrders), 
        thisMonthSales : getThisMonthSales(orders),
        thisWeekSales : getThisWeekSales(orders),
        todaySales : getTodaySales(orders),
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
    
    const { orderId, itemId , discount, type } = request.body

    await applyDiscountToExisitngOrder(orderId, itemId, discount, type)

    await updateOrderFields(orderId)
    
 
   
    response.send("sucess")
}




export const getTransactionReportController = async (request: AuthRequest, response: Response) => {
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

    const { type  } = request.params

    const orders = await getOrdersByBranch(account.branch, "completed");

    let filteredOrders = orders
    
    switch(type)
    {
        case "overAll":
            filteredOrders = orders
        break;

        case "today":
            filteredOrders = getTodayOrders(orders)
        break;
    
        case "week":
            filteredOrders = getThisWeekOrders(orders)
        break;
    
        case "month":
            filteredOrders = getThisMonthOrders(orders)
        break;
    }

    response.send(filteredOrders)
}

export const getTransactionReportCustomDateController = async (request: AuthRequest, response: Response) => {

    console.log("ping")

    
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

    const customDate : { start : string, end : string}  = request.body.customDate


    const orders = await getOrdersByBranch(account.branch, "completed");

    let filteredOrders = getOrdersByDateRange(orders, customDate.start, customDate.end)

    response.send(filteredOrders)
}


export const startTimerController = async (request: AuthRequest, response: Response) => {

    const {id, time} = request.body

    await startTimer(id, time)
    
    response.send("success")
}
