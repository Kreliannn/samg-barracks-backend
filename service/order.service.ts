import Order from "../model/order.model";
import { OrderInterface, OrderItem } from "../types/orders";


export const createOrderService = async (orderData: OrderInterface) => {
    const order = await Order.create(orderData);
    return order;
}

export const checkIfTableExist = async (table : string, branch : string) => {
    const order = await Order.findOne({ table, branch, status : "active" });
    return order?._id.toString();
}

export const insertOrders = async (orderId: string, orders: OrderItem[]) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    order.orders.push(...orders);
    await order.save();
}

export const getOrdersByBranch = async (branch: string, status : string) => {
    const orders = await Order.find({ branch , status});
    return orders;
}

export const updateOrder = async (id: string, total : number, subTotal : number, vat : number, grandTotal : number, totalDiscount : number, serviceFee : number ) => {
    const orders = await Order.findById(id);
    if(orders)
    {
        orders.total  += total
        orders.subTotal += subTotal
        orders.vat += vat
        orders.grandTotal += grandTotal
        orders.totalDiscount += totalDiscount; 
        orders.serviceFee += serviceFee
        console.log(orders)
        await orders.save()
    }
    else
    {
        console.log(orders)
        console.log("errorr")
    }
}


export const updateOrderStatus = async ( id:string ) => {
    await Order.findByIdAndUpdate(id, { status : "completed" })
}