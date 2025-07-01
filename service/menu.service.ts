import Menu from "../model/menu.model"
import { menuInterface  , menuIngredientsInterface} from "../types/menu.type"

export const createMenu = async (menuData: menuInterface) => {
    const menu = await Menu.create(menuData)
    return menu
}

export const getMenuByBranch = async (branch: string) => {
    const menu = await Menu.find({ branch: branch })
    return menu  
}

export const updateMenu = async (id: string, name: string, ingredients: menuIngredientsInterface[], type: string, price: number) => {
    const updatedMenu = await Menu.findByIdAndUpdate(id, { name, ingredients, type, price })
    return updatedMenu
}
