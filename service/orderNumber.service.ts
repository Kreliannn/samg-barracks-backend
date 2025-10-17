import OrderNumber from "../model/orderNumber.model";
import { orderNumberInterface } from "../types/orderNumber.type";


export const generateOrderNumber = async (branch : string) => {
    
    const formattedDate = new Date().toISOString().split('T')[0];
    const date = formattedDate.toString()

    const orderNumbersData = await OrderNumber.find({ branch, date })

    if(!orderNumbersData) return 1

    let generatedNumber = 0

    const exisitngOrderNumbers = orderNumbersData.map((item) => item.num )

    for (let i = 1; i <= 50; i++) {
        if (!exisitngOrderNumbers.includes(i)) {
            generatedNumber = i;
            break;
        }
    }

    await OrderNumber.create({
        branch,
        date,
        num : generatedNumber
    })

    return generatedNumber
}

export const removeOrderNumber = async (branch : string, num : number) => {
    await OrderNumber.deleteMany({branch, num})
}

export const deleteOrderNumberByBranch = async (branch : string) => {
    await OrderNumber.deleteMany({branch})
}

