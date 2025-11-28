import OrderNumber from "../model/orderNumber.model";
import { orderNumberInterface } from "../types/orderNumber.type";


export const generateOrderNumber = async (branch : string, date : string) => {
    
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

export const generatedNumberV2  = async (branch : string, date : string) => {
    
    const orderNumbersData = await OrderNumber.findOne({ branch }).sort({ createdAt: -1 });

    if(!orderNumbersData) return 1

    const generatedNumber = orderNumbersData.num! + 1

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

export const removeOrderNumberV2 = async (branch : string) => {
    await OrderNumber.deleteMany({branch})
}

export const deleteOrderNumberByBranch = async (branch : string) => {
    await OrderNumber.deleteMany({branch})
}

