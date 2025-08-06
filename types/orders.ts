export interface OrderIngredient {
  id: string;
  name: string;
  qty: number;
}

export interface OrderItem {
  item_id : string,
  _id : string;
  name: string;
  ingredients: OrderIngredient[];
  price: number;
  branch: string;
  img: string;
  type: string;
  discount: number;
  discountType: string;
  qty: number;
  total: number;
}

export interface OrderInterface {
  orders: OrderItem[];
  vat : number;
  total : number;
  subTotal: number;
  totalDiscount: number;
  grandTotal: number;
  branch: string;
  table: string;
  orderType: string;
  cashier: string;
  date : string,
  time : string,
  status : string,
  serviceFee : number
}


export interface getOrderInterface {
  _id : string,
  orders: OrderItem[];
  vat : number;
  total : number;
  subTotal: number;
  totalDiscount: number;
  grandTotal: number;
  branch: string;
  table: string;
  orderType: string;
  cashier: string;
  date : string,
  time : string,
  status : string,
  serviceFee : number
}
