import { getOrderInterface , OrderInterface} from "../types/orders"


interface dailySalesInterface {
    date : string,
    sales : number,
}

export const get30DaysSales = (orders : getOrderInterface[]) => {

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