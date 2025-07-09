import Menu from "../model/menu.model"
import { menuInterface  , menuIngredientsInterface,} from "../types/menu.type"

export const createMenu = async (menuData: menuInterface) => {
    const menu = await Menu.create(menuData)
    return menu
}

export const getMenu = async () => {
    const menu = await Menu.find()
    return menu  
}

export const getMenuById = async (id : string) => {
    const menu : menuInterface  = await Menu.findById(id) as menuInterface
    return menu  
}

export const updateMenu = async (id: string, name: string, ingredients: menuIngredientsInterface[], type: string, price: number) => {
    const updatedMenu = await Menu.findByIdAndUpdate(id, { name, ingredients, type, price })
    return updatedMenu
}
