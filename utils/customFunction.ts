import { getOrderInterface , OrderInterface, OrderItem} from "../types/orders"
import { getMenuById } from "../service/menu.service"


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

    const last30DaysSales = sortDailySales.slice(-3);

    return last30DaysSales
}


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



export const getTopCategory = async (orders : getOrderInterface[]) => {
 
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


export const getThisMonthSales = (orders : getOrderInterface[]) => {
 
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



export const getTodaySales = (orders : getOrderInterface[]) => {
 
    let todaySales = 0

    const formattedDate = new Date().toISOString().split('T')[0];

    const today = formattedDate.toString()

    orders.forEach((item) => {
        if(item.date == today){
            todaySales += item.grandTotal
        }
    })

    return todaySales
}
