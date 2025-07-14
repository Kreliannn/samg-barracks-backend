import Ingredients from "../model/ingredients.model"
import { ingredientsInterface, branchStockInterface } from "../types/ingredients.type"
import { getBranch } from "./branch.service"

export const createIngredients = async (ingredientData: ingredientsInterface) => {
    const ingredients = await Ingredients.create(ingredientData)
    return ingredients
}

export const getIngredientsByBranch = async () => {
    const ingredients = await Ingredients.find()
    return ingredients  
}

//update
export const updateIngredients = async (id: string, name : string, stocks : number, price : number,branch : string) => {
    const ingredient = await Ingredients.findById(id)
    if(!ingredient) return 
    ingredient.stocks.forEach((item, index) => {
        if(item.branch == branch){
            ingredient.stocks[index].stock = stocks
        }
    })
    ingredient.name = name
    ingredient.price = price
    await ingredient.save()
}

export const deductIngredientStocks = async (id: string, qty: number, branch : string) => {
    const ingredient = await Ingredients.findById(id);
    if (!ingredient) {      
       return
    }   

    ingredient.stocks.forEach((item, index) => {
        if(item.branch == branch && ingredient.stocks[index].stock){
            const newStock = ingredient.stocks[index].stock - qty; 
            ingredient.stocks[index].stock = (newStock > 0 ) ? newStock : 0; 
        }
    })

    await ingredient.save();
}

export const addIngredientStocks = async (id: string, qty: number, branch : string) => {
    const ingredient = await Ingredients.findById(id);
    if (!ingredient) {    
        console.log("not found")  
        return
    }   

    ingredient.stocks.forEach((item, index) => {
        if (item.branch === branch) {
            const currentStock = ingredient.stocks[index].stock ?? 0; 
            ingredient.stocks[index].stock = currentStock + qty;
        }
    })

    await ingredient.save();
}

export const createIngredientBranchData = async () => {

    const branchStock : branchStockInterface[] = []

    const branches = await getBranch()

    if(!branches) return []

    branches.forEach((item) => {
        branchStock.push({
            branch : item.branch,
            stock : 0
        })
    })

    return branchStock
}


export const addBranchIngredientStock = async (branch: string) => {
  const ingredients = await Ingredients.find();

  if (!ingredients) return;

  for (const ingredient of ingredients) {
    ingredient.stocks.push({
      branch: branch,
      stock: 0,
    });

    await ingredient.save(); 
  }
};
