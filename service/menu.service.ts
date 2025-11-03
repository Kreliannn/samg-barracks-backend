import Menu from "../model/menu.model"
import { menuInterface  , menuIngredientsInterface, menuVariantInterface, getMenuInterface,} from "../types/menu.type"

export const createMenu = async (menuData: menuInterface) => {
    const menu = await Menu.create(menuData)
    return menu
}

export const getMenu = async () => {
    const menu : getMenuInterface[] = await Menu.find()
    return menu  
}

export const getMenuById = async (id : string) => {
    const menu : menuInterface  = await Menu.findById(id) as menuInterface
    return menu  
}

export const updateMenu = async (id: string, name: string, ingredients: menuIngredientsInterface[], index: number, price: number) => {
    const menu = await Menu.findById(id) 
    if(!menu ) return 
    menu.name = name
    menu.variants[index].price = price
    menu.variants[index].ingredients = ingredients as any
    await menu.save()
}


export const addMenuVariant = async (id: string, variant : menuVariantInterface) => {
    const menu = await Menu.findById(id) 
    if(!menu ) return 
    menu.variants.push(variant)
    await menu.save()
}

