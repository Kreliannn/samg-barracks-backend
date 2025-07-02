import { AuthRequest } from "../types/request.type";
import { Response } from "express";
import { findAccountById } from "../service/account.service";
import { getOrdersByBranch, createOrderService, checkIfTableExist , insertOrders} from "../service/order.service";
import { deductIngredientStocks } from "../service/ingredient.service";
import { OrderInterface , OrderItem} from "../types/orders";

export const createOrderController = async (request: AuthRequest, response: Response) => {
    if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const orderId  = await checkIfTableExist(request.body.table, request.body.branch);

    const orders : OrderItem[] = request.body.orders;

    orders.forEach(async (order) => {
        const orderQuantity = order.qty
        order.ingredients.forEach(async (ingredient) => {
            await deductIngredientStocks(ingredient.id, (orderQuantity * ingredient.qty));
        })
    })

    if(orderId){
        await insertOrders(orderId, request.body.orders);
        response.send("success");
        return
    }

 
    
    await createOrderService(request.body)

   response.send("success")
}


export const getOrderController = async (request: AuthRequest, response: Response) => {
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

    const orders = await getOrdersByBranch(account.branch);

    response.send(orders)
}