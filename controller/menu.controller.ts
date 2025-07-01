import { AuthRequest } from "../types/request.type";
import { Request, Response } from "express";
import fs from "fs";
import cloudinary from "../utils/cloudinary"
import { findAccountById } from "../service/account.service";
import { accountInterface } from "../types/account.type";
import { menuIngredientsInterface, menuInterface } from "../types/menu.type";
import { createMenu, getMenuByBranch } from "../service/menu.service";

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
        const { name, type, ingredients, price } = request.body;


        const account = await findAccountById(request.id)

        if(!account){
            response.status(404).json({ error: 'Account not found' });
            return;
        }
   
        await createMenu({
            name,
            ingredients : ingredients,
            type,
            price,
            branch: account.branch,
            img: url
        })
        

        const menu = await getMenuByBranch(account.branch);

        response.send(menu);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
};