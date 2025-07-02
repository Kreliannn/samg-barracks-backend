import Order from "../model/order.model";
import { OrderInterface, OrderItem } from "../types/orders";


export const createOrderService = async (orderData: OrderInterface) => {
    const order = await Order.create(orderData);
    return order;
}

export const checkIfTableExist = async (table : string, branch : string) => {
    const order = await Order.findOne({ table, branch });
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

export const getOrdersByBranch = async (branch: string) => {
    const orders = await Order.find({ branch });
    return orders;
}