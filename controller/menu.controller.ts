import { AuthRequest } from "../types/request.type";
import { Request, Response } from "express";
import fs from "fs";
import cloudinary from "../utils/cloudinary"
import { findAccountById } from "../service/account.service";
import { accountInterface } from "../types/account.type";
import { menuIngredientsInterface, menuInterface } from "../types/menu.type";
import { createMenu, getMenu, updateMenu, addMenuVariant } from "../service/menu.service";
import { menuVariantInterface } from "../types/menu.type";

export const createMenuController = async (request: AuthRequest, response: Response) => {
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
        const { name, type, variants } = request.body;

        const menuVariants: menuVariantInterface[] = variants ? JSON.parse(variants) : [];

        const account = await findAccountById(request.id)

        if(!account){
            response.status(404).send({ error: 'user not found' });
            return;
        }
   
        await createMenu({
            name,
            variants : menuVariants,
            type,
            branch: account.branch,
            img: url
        })

        const menu = await getMenu();

        response.send(menu);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
};

export const updateMenuController = async (request: AuthRequest, response: Response) => {
    try {
     
        if(!request.id){
            console.log("not autenitcated")
            response.status(500).json({ error: 'not autenitcated' });
            return;
        }

      
        const { id, name, index, ingredients, price } = request.body;

        const parsedIngredients: menuIngredientsInterface[] = ingredients ? ingredients : [];
    
        await updateMenu(id, name, parsedIngredients, index, price);
        
        const menu = await getMenu();

        response.send(menu);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
};


export const getMenusController = async (request: AuthRequest, response: Response) => {
    if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const account = await findAccountById(request.id);

    const menu = await getMenu();
    response.send(menu);
}


export const addMenuVariantController = async (request: AuthRequest, response: Response) => {
    if(!request.id)
    {
        response.status(500).send("not authenticated")
        return
    }

    const { variants , id } = request.body

    await addMenuVariant(id, variants)

    const menu = await getMenu();
    
    response.send(menu);
}