import { getOrderInterface , OrderInterface} from "../types/orders"



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