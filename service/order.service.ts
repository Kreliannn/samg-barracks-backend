import Order from "../model/order.model";
import { OrderInterface, OrderItem , getOrderInterface} from "../types/orders";


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
    const orders :   getOrderInterface[] = await Order.find({ branch , status});
    return orders;
}

export const getTodayOrdersByBranch = async (branch: string, status : string) => {
  const formattedDate = new Date().toISOString().split('T')[0];
  const date = formattedDate.toString()
  const orders :   getOrderInterface[] = await Order.find({ branch , status, date});
  return orders;
}

export const getTodayCompletedAndCanceledOrder = async (branch: string) => {
  const formattedDate = new Date().toISOString().split('T')[0];
  const date = formattedDate.toString()
  const orders :   getOrderInterface[] = await Order.find({ branch ,  status: { $in: ["completed", "canceled"] }, date});
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

export const toggleOrderStatus= async ( id:string ) => {
    const order = await Order.findById(id)
    if(order?.status == "completed"){
      await Order.findByIdAndUpdate(id, { status : "canceled" })
    } else {
      await Order.findByIdAndUpdate(id, { status : "completed" })
    }
    
}

export const updateOrderTable = async ( id:string, table : string ) => {
    await Order.findByIdAndUpdate(id, { table })
}

export const updatePaymentMethod = async ( id : string , paymentMethod : string) => {
    await Order.findByIdAndUpdate(id, { paymentMethod })
}

export const editDate = async () => {
  const allOrders = await Order.find({ branch : "branch 1"});
  if (!allOrders) return;

  const endDay = 24;

  for (let i = 0; i < allOrders.length; i++) {
    const order = await Order.findById(allOrders[i]._id);
    if (!order) continue;

    const day = Math.min(10 + i, endDay);
    const formattedDate = `2025-09-${String(day).padStart(2, "0")}`;

    order.date = formattedDate; // Assuming `date` is a String or Date field
    await order.save();
  }
};


export const popOrderItemAndGetTotal = async (order_id : string, item_id : string) => {
  const order = await Order.findById(order_id)
  if(!order) return  0
  order.orders.forEach((item) => {
    if(item.item_id == item_id){  
      order.subTotal -= item.total

      const subTotal = order.subTotal 
      const serviceFee = subTotal * 0.10
        
      order.serviceFee = serviceFee
      order.grandTotal = subTotal + serviceFee
      order.totalDiscount -= item.discount
      order.vat -=  item.vat
    }
  })

  order.orders.pull({ item_id: item_id }); 
  
  if((order.orders.length - 1) == 0){
    await Order.findByIdAndDelete(order_id)
    return order.table
  } 
  await order.save();
  return "none"
};

export const updateOrderGrandTotal = async (order_id : string, total : number) => {
  const order = await Order.findById(order_id)
  if(!order) return
  order.grandTotal -= total
  await order.save();
};


export const mergeOrders = async (order1_id : string, order2_id : string) => {
  const order1 = await Order.findById(order1_id)
  const order2 = await Order.findById(order2_id)
  if(!order1 || !order2) return  0

  order2.orders.forEach((order) => {
    order1.orders.push(order)
  })

  order1.subTotal += order2.subTotal
  order1.vat += order2.vat  
  order1.total += order2.total
  order1.totalDiscount += order2.totalDiscount
  order1.grandTotal += order2.grandTotal
  order1.serviceFee += order2.serviceFee 

  await order1.save();
  await Order.findByIdAndDelete(order2_id);
};



export const popOrderItem = async (order_id : string, item_id : string) => {
  const order = await Order.findById(order_id)
  if(!order) return  0
  order.orders.forEach((item) => {
    if(item.item_id == item_id){  
      order.subTotal -= item.total

      const subTotal = order.subTotal 
      const serviceFee = subTotal * 0.10
        
      order.serviceFee = serviceFee
      order.grandTotal = subTotal + serviceFee
      order.totalDiscount -= item.discount
      order.vat -=  item.vat
    }
  })

  order.orders.pull({ item_id: item_id }); 
  
  await order.save();
};