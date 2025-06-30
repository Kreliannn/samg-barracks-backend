import Ingredients from "../model/ingredients.model"
import { ingredientsInterface } from "../types/ingredients.type"

export const createIngredients = async (ingredientData: ingredientsInterface) => {
    const ingredients = await Ingredients.create(ingredientData)
    return ingredients
}

