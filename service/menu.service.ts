import Menu from "../model/menu.model"
import { menuInterface  } from "../types/menu.type"

export const createMenu = async (menuData: menuInterface) => {
    const menu = await Menu.create(menuData)
    return menu
}

export const getMenuByBranch = async (branch: string) => {
    const menu = await Menu.find({ branch: branch })
    return menu  
}

