import { AuthRequest } from "../types/request.type";
import { Request, Response } from "express";
import { createIngredients , getIngredientsByBranch, updateIngredients, deductIngredientStocks} from "../service/ingredient.service";
import fs from "fs";
import cloudinary from "../utils/cloudinary"
import { findAccountById } from "../service/account.service";
import { accountInterface } from "../types/account.type";
import { get } from "http";

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
        const { name, stocks, type } = request.body;

        const account = await findAccountById(request.id)

        if(!account){
            response.status(404).json({ error: 'Account not found' });
            return;
        }
   

        await createIngredients({ name, stocks, branch: account.branch, img: url, type });

        const ingredients = await getIngredientsByBranch(account.branch);
        
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

        const { id, name, stocks } = request.body;

        const account = await findAccountById(request.id)

        if(!account){
            response.status(404).json({ error: 'Account not found' });
            return;
        }
   
        await updateIngredients(id, name, stocks)

        const ingredients = await getIngredientsByBranch(account.branch);
        
        response.send(ingredients);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
        
    
};


export const getIngredientsController = async (request: AuthRequest, response: Response) => {
    if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    const ingredients = await getIngredientsByBranch(account?.branch || "");
    response.send(ingredients);
}




export const deductIngredientController = async (request: AuthRequest, response: Response) => {
    const res = request.body
    const refills : refillInterface[] = res
    refills.forEach( async (item) => {
        await deductIngredientStocks(item.id, item.qty)
    })
    response.send("success")
}
