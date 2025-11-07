import { AuthRequest } from "../types/request.type";
import { Request, Response } from "express";
import {getIngredientsById, createIngredients , getIngredientsByBranch, updateIngredients, deductIngredientStocks, createIngredientBranchData} from "../service/ingredient.service";
import fs from "fs";
import cloudinary from "../utils/cloudinary"
import { findAccountById } from "../service/account.service";
import { accountInterface } from "../types/account.type";
import { get } from "http";
import { branchStockInterface } from "../types/ingredients.type";
import { createRefill, findRefillByDate } from "../service/refill.service";
import { createActivity } from "../service/activities.service";


interface refillInterface {
    id : string,
    qty : number
}



export const createIngredientsController = async (request: AuthRequest, response: Response) => {
    try {
        if (!request.file) {
            response.status(400).json({ error: 'No file uploaded' });
            return;
        }
        
        if(!request.id){
            console.log("not autenitcated")
            response.status(500).json({ error: 'not autenitcated' });
            return;
        }

        const uploadResult = await cloudinary.uploader.upload(request.file.path, {
        folder: 'nextjs_uploads',
        });

        fs.unlinkSync(request.file.path);

        const url = uploadResult.secure_url
        const { name, type , price} = request.body;

        const account = await findAccountById(request.id)

        if(!account){
            response.status(404).json({ error: 'Account not found' });
            return;
        }

        const stocks : branchStockInterface[] = await createIngredientBranchData()
   

        await createIngredients({ name, stocks, branch: account.branch, img: url, type , price});

        await createActivity(account.fullname, account.branch, "manager", `Added ${name} ingridient`)

        const ingredients = await getIngredientsByBranch();
        
        response.send(ingredients);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
        
    
};



export const EditIngredientsController = async (request: AuthRequest, response: Response) => {
    try {

        if(!request.id){
            console.log("not autenitcated")
            response.status(500).json({ error: 'not autenitcated' });
            return;
        }

        const { id, name, stocks, price } = request.body;

        const account = await findAccountById(request.id)

        if(!account){
            response.status(404).json({ error: 'Account not found' });
            return;
        }
   
        await updateIngredients(id, name, stocks, price ,account.branch)

        const ingredients = await getIngredientsByBranch();

        const updatedIngredient = await getIngredientsById(id)

        await createActivity(account.fullname, account.branch, "manager", `Edit ${updatedIngredient?.name} Ingridient data`)
        
        response.send(ingredients);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
        
    
};


export const getIngredientsController = async (request: AuthRequest, response: Response) => {
    const ingredients = await getIngredientsByBranch();
    response.send(ingredients);
}




export const deductIngredientController = async (request: AuthRequest, response: Response) => {
    if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    if(!account)
    {
        response.status(500).send("not found")
        return
    }


    
    const refills : refillInterface[] = request.body.refill
    const date = request.body.date


    refills.forEach( async (item) => {
        await deductIngredientStocks(item.id, item.qty, account?.branch)
        const ing = await getIngredientsById(item.id)
        if(ing){
            await createRefill({
                branch : account.branch,
                date : date,
                ingredient : ing.name,
                qty : item.qty
            })
        }
       
    })

    response.send("success")
}



export const getRefillController = async (request: AuthRequest, response: Response) => {
  if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    if(!account)
    {
        response.status(500).send("not found")
        return
    }

    const { date } = request.params


    const refills = await findRefillByDate(account.branch, date)

    console.log(refills, date)

    response.send(refills)
};