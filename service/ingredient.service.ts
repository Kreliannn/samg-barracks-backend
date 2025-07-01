import Ingredients from "../model/ingredients.model"
import { ingredientsInterface } from "../types/ingredients.type"

export const createIngredients = async (ingredientData: ingredientsInterface) => {
    const ingredients = await Ingredients.create(ingredientData)
    return ingredients
}

export const getIngredientsByBranch = async (branch: string) => {
    const ingredients = await Ingredients.find({ branch: branch })
    return ingredients  
}

export const updateIngredients = async (id: string, name : string, stocks : number) => {
    const updatedIngredient = await Ingredients.findByIdAndUpdate(id, { name, stocks })
}