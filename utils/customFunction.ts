import { getOrderInterface , OrderInterface, OrderItem} from "../types/orders"
import { getMenuById } from "../service/menu.service"
import { getMenuInterface } from "../types/menu.type"
import { changeInterface, shiftInterface } from "../types/change.type"


export const get30DaysSales = (orders : getOrderInterface[]) => {
 
    interface dailySalesInterface {
        date : string,
        sales : number,
    }

    const dailySales : dailySalesInterface[]  = []

    orders.forEach((item) => {
       if(dailySales.some((day) => day.date === item.date)){
            dailySales.forEach((day, index) => {
                if(day.date === item.date){
                    dailySales[index].sales += item.grandTotal
                }
            })
       } else {
            const newDay = {
                date : item.date,
                sales : item.grandTotal
            }
            dailySales.push(newDay)
       }
    })

    const sortDailySales = dailySales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const last30DaysSales = sortDailySales.slice(-20);

    return last30DaysSales
}


export const getThisMonthSales = (orders: getOrderInterface[]) => {
  interface dailySalesInterface {
    date: string;
    sales: number;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailySales: dailySalesInterface[] = [];

  // Create all days in local timezone
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dailySales.push({ date, sales: 0 });
  }

  // Add actual sales
  orders.forEach((item) => {
    const match = dailySales.find((d) => d.date === item.date);
    if (match) match.sales += item.grandTotal;
  });

  return dailySales;
};


export const getThisWeekSales = (orders: getOrderInterface[]) => {
  interface dailySalesInterface {
    date: string; // "Monday", "Tuesday", ...
    sales: number;
  }

  const daysOfWeek = [
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat",
    "Sun",
  ];

  // Get current date
  const now = new Date();

  // Find Monday of this week
  const firstDayOfWeek = new Date(now);
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ...
  const diffToMonday = (dayOfWeek + 6) % 7; // shift so Monday = start
  firstDayOfWeek.setDate(now.getDate() - diffToMonday);

  // Build all 7 days
  const dailySales: dailySalesInterface[] = daysOfWeek.map((day, index) => {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + index);

    return { date: day, sales: 0 };
  });

  // Add actual sales if the order falls within this week
  orders.forEach((item) => {
    const itemDate = new Date(item.date);
    const start = new Date(firstDayOfWeek);
    const end = new Date(firstDayOfWeek);
    end.setDate(start.getDate() + 6);

    if (itemDate >= start && itemDate <= end) {
      const weekdayIndex = (itemDate.getDay() + 6) % 7; // convert so Monday=0
      dailySales[weekdayIndex].sales += item.grandTotal;
    }
  });

  return dailySales;
};


export const getTodaySales = (orders: getOrderInterface[]) => {

 const today = new Date()
 const todayStr = today.toISOString().split("T")[0]

  // Filter only today's orders
  const todayOrders = orders.filter((item) => item.date == todayStr)

  // Return only existing transactions (no defaults)
  return todayOrders.map((item) => ({
    date: item.time, // already like "10:30 AM"
    sales: item.grandTotal,
  }))
}


export const getTodayOrders = (orders: getOrderInterface[]) => {

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  
  const todayOrders = orders.filter((item) => item.date == todayStr)

 
  return todayOrders
}


export const getThisWeekOrders = (orders: getOrderInterface[]) => {
  const today = new Date()

  // Find Monday of this week
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay() // treat Sunday as 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek - 1))

  // Find Sunday of this week
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const start = formatDate(monday)
  const end = formatDate(sunday)

  // Filter orders within this week
  const thisWeekOrders = orders.filter((item) => {
    return item.date >= start && item.date <= end
  })

  return thisWeekOrders
}



export const getThisMonthOrders = (orders: getOrderInterface[]) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  const formatDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const start = formatDate(startOfMonth)
  const end = formatDate(endOfMonth)

  // Filter orders that are within this month
  const thisMonthOrders = orders.filter((item) => {
    return item.date >= start && item.date <= end
  })

  return thisMonthOrders
}

export const getOrdersByDateRange = (orders: getOrderInterface[],start: string, end: string) => {
  const filteredOrders = orders.filter((item) => {
    return item.date >= start && item.date <= end;
  });

  return filteredOrders;
};


export const getTopMenu = (orders : getOrderInterface[]) => {
 
    interface menuInterface {
        id : string,
        menu : string,
        sold : number,
        img : string
    }

    const data : menuInterface[]  = []

    orders.forEach((item) => {
       item.orders.forEach((order) => {
        if(data.some((item) => item.id === order._id)){
            data.forEach((item, index) => {
                if(item.id === order._id){
                    data[index].sold += order.qty
                }
            })
        } else {
            const newMenu = {
                id : order._id,
                menu : order.name,
                sold : order.qty,
                img : order.img
            }
            data.push(newMenu)
        }
       })
    })

    const sortedData = data.sort((a, b) => a.sold - b.sold);

    return sortedData
    
}

export const getYearlySales = (orders : getOrderInterface[]) => {
 
    const yearlySales = [
        { month : "01" , sales : 0},
        { month : "02" , sales : 0},
        { month : "03" , sales : 0},
        { month : "04" , sales : 0},
        { month : "05" , sales : 0},
        { month : "06" , sales : 0},
        { month : "07" , sales : 0},
        { month : "08" , sales : 0},
        { month : "09" , sales : 0},
        { month : "10" , sales : 0},
        { month : "11" , sales : 0},
        { month : "12" , sales : 0},
    ]

    orders.forEach((order) => {
        const orderDate = order.date.split("-")
        const month = orderDate[1] 
        yearlySales.forEach((item, index) => {
            if(item.month == month)
            {
                yearlySales[index].sales += order.grandTotal
            }
        })
    })

    return yearlySales
}



export const getTopCategory =  (orders : getOrderInterface[]) => {
 
    interface topCategoryInterface {
        category : string,
        sold : number
    }

    const topCategory : topCategoryInterface[] = []

    orders.forEach((order) => {
        order.orders.forEach((menu) => {

            const category = menu.type
        
            if(topCategory.some((item) => item.category === category)){
                topCategory.forEach((item, index) => {
                    if(item.category == category){
                        topCategory[index].sold += menu.qty
                    }
                })
            } else {
                const newCategory = {
                    category : menu.type,
                    sold : menu.qty
                }
                topCategory.push(newCategory)
            }
        })
    })

    return topCategory
}


export const getToTalSales = (orders : getOrderInterface[]) => {
 
    let totalSales = 0

    orders.forEach((item) => {
        totalSales += item.grandTotal
    })

    return totalSales
}

export const getToTalTax = (orders : getOrderInterface[]) => {
 
    let totalTax = 0

    orders.forEach((item) => {
        totalTax += item.vat
    })

    return totalTax
}








export const getmonth= (orders : getOrderInterface[]) => {
 
    let MonthtotalSales = 0

    const currentMonth =  String(new Date().getMonth() + 1).padStart(2, '0')


    orders.forEach((item) => {
        const itemMonth = item.date.split("-")[1]
        if(itemMonth == currentMonth){
            MonthtotalSales += item.grandTotal
        }
    })

    return MonthtotalSales
}



export const getToday = (orders : getOrderInterface[]) => {
 
    let todaySales = 0

    const formattedDate = new Date().toLocaleDateString('en-CA');

    const today = formattedDate.toString()

    orders.forEach((item) => {
        if(item.date == today){
            todaySales += item.grandTotal
        }
    })

    return todaySales
}


export const getTodayDiscount = (orders : getOrderInterface[], today : string) => {
 
    let todayDiscount = 0

    orders.forEach((item) => {
        if(item.date == today){
            item.orders.forEach((order) => {
                if(order.discountType != "none"){
                    todayDiscount += 1
                }
            })
        }
    })

    return todayDiscount
}


export function generateId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    return (
      timestamp +
      "xxxxxxxxxxxxxxxx".replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
      })
    ).toLowerCase();
  }



  export const getTotalWithVat = (items : OrderItem[] ) => {
    let total = 0
    items.forEach((item) => {
      total += (item.price * item.qty)
    })
    return total
}

export const getTotaldiscount= (items : OrderItem[] ) => {
  let totalDiscount = 0
  items.forEach((item) => {
    totalDiscount += item.discount
  })
  return totalDiscount
}

export const getTotalVat= (items : OrderItem[] ) => {
  let totalVat = 0
  items.forEach((item) => {
    totalVat += item.vat
  })
  return totalVat
}





export function isTime1To3am(time: string) {
  const [hourStr, minutePart] = time.split(':');
  const hour = parseInt(hourStr);
  const isPM = minutePart.toLowerCase().includes('pm');

  let hour24 = hour % 12 + (isPM ? 12 : 0);

  return hour24 >= 1 && hour24 < 3;
}


export function getDate(time: string) {
  if (!isTime1To3am(time)) {
    return new Date().toLocaleDateString('en-CA');
  } else {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('en-CA');
  }
}

export function plus1Day(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('en-CA');
}

export function minus1Day(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
}




export function getProductReportData(orders: getOrderInterface[], menu : getMenuInterface[]) {

    const products = menu.map((product) => ({
      name : product.name,
      productId : product._id,
      category : product.type,
      sold : 0,
      sales : 0,
      discount : 0
    }))

    orders.forEach((order) => {
      order.orders.forEach((item) => {
        
        products.forEach((product) => {
          if(product.productId == item._id){
            product.discount += item.discount
            product.sold += item.qty
            product.sales += ((item.price * item.qty) - item.discount)
          }
        })

      })
    })


    return products
}



export function getProductCategoryReportData(orders: getOrderInterface[], menu : getMenuInterface[]) {

    const allCategory = [...new Set(menu.map(product => product.type))];


    const getCategoryIndex = (category : string) => {
      return allCategory.indexOf(category);
    }

    const categorys = allCategory.map((item) => ({
      name : "test",
      category : item,
      sold : 0,
      sales : 0,
      discount : 0
    }))


    orders.forEach((order) => {
      order.orders.forEach((item) => {
        menu.forEach((product) => {
          if(product._id == item._id){
            const index = getCategoryIndex(product.type)
            categorys[index].discount += item.discount
            categorys[index].sold += item.qty
            categorys[index].sales += ((item.price * item.qty) - item.discount)
          }
        })
      })
    })


    return categorys
}

export const processShiftData = (shifts : changeInterface[], orders : getOrderInterface[]) => {

   const processedShift : shiftInterface[] = []

   shifts.forEach((shift) => {
        const newShift : shiftInterface = {
            date : shift.date,
            start : shift.start, 
            end : shift.end,
            change : shift.change,
            sales : 0,
            discount : 0,
            vat : 0,
            transaction : 0,
            serviceFee : 0
        }

        orders.forEach((order) => {
            if(order.date == newShift.date){
                newShift.sales += order.grandTotal
                newShift.discount += order.totalDiscount
                newShift.vat += order.vat
                newShift.serviceFee += order.serviceFee,
                newShift.transaction += 1
            }
        })

        processedShift.unshift(newShift)
    })

    return processedShift
}