import Order from "../model/order.model";
import { OrderInterface, OrderItem , getOrderInterface} from "../types/orders";
import { generateId , getTotaldiscount, getTotalWithVat, getTotalVat} from "../utils/customFunction";

export const createOrderService = async (orderData: OrderInterface) => {
    const order = await Order.create(orderData);
    return order;
}

export const checkIfTableExist = async (table : string, branch : string) => {
    const order = await Order.findOne({ table, branch, status : "active" });
    return order;
}

export const findOrderById = async (id : string) => {
    return Order.findById(id)
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
  const formattedDate = new Date().toLocaleDateString('en-CA');
  const date = formattedDate.toString()
  const orders :   getOrderInterface[] = await Order.find({ branch , status, date});
  return orders;
}

export const getTodayCompletedAndCanceledOrder = async (branch: string, date : string) => {
  const orders : getOrderInterface[] = await Order.find({ branch ,  status: { $in: ["completed", "canceled"] }, date});
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

export const updateOrderStatusToPending = async ( id:string ) => {
    await Order.findByIdAndUpdate(id, { status : "pending" })
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


export const applyDiscountToExisitngOrder = async (orderId : string ,ItemId : string,  discount : number, type : string) => {

  const order = await findOrderById(orderId)
  if(!order) return

  let popItem = false

  order.orders.forEach((item) => {
      if(item.item_id == ItemId){

          if(item.qty <= 1) popItem = true

          item.qty -= 1
          item.total -= item.price
          item.vat = item.total * 0.12

          const itemPriceVat = item.price * 0.12

          let discountedPrice = item.price - discount; 

          if(type == "pwd" || type == "senior") discountedPrice -= itemPriceVat

          const newItem : OrderItem = {
              item_id : generateId(),
              _id : item._id,
              name: item.name,
              ingredients: [],
              price: item.price,
              branch: item.branch,
              img: item.img,
              type: item.type,
              discount: discount,
              discountType: type,
              qty: 1,
              total: discountedPrice,
              vat : type == "pwd" || type == "senior" ? 0 : item.price * 0.12
          }

          order.orders.push(newItem) 
      }
  })

  if (popItem) {
    const index = order.orders.findIndex((item) => item.item_id === ItemId);
    if (index !== -1) order.orders.splice(index, 1);
  } 

  await order.save()
}


export const updateOrderFields = async (orderId : string ) => {

  const order = await findOrderById(orderId)
  if(!order) return

  const orders = order.orders.map(o => o.toObject()) as unknown as OrderItem[];

  const totalWithVat = getTotalWithVat(orders);
  const subTotal = getTotalWithVat(orders);
  const totalDiscount = getTotaldiscount(orders);
  const vat = getTotalVat(orders);
  const serviceFee = subTotal * 0.1;
  const discountedTotal = (totalWithVat - totalDiscount) + serviceFee;

  order.total = totalWithVat
  order.vat = vat
  order.subTotal = subTotal
  order.grandTotal = discountedTotal
  order.totalDiscount = totalDiscount
  order.serviceFee =serviceFee

  await order.save()
}

export const deleteOrderByBranch = async (branch : string ) => {
  await Order.deleteMany({branch})
}

export const startTimer = async (id : string, time : string) => {
  await Order.findByIdAndUpdate(id, { unliTimer : time })
}

