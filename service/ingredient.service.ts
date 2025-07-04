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

export const deductIngredientStocks = async (id: string, qty: number) => {
    const ingredient = await Ingredients.findById(id);
    if (!ingredient) {      
        throw new Error("Ingredient not found");
    }   
    const newStock = ingredient.stocks - qty; 
    ingredient.stocks = (newStock > 0 ) ? newStock : 0; 
    await ingredient.save();
}