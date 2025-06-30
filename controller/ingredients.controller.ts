import { AuthRequest } from "../types/request.type";
import { Request, Response } from "express";
import { createIngredients } from "../service/ingredient.service";
import fs from "fs";
import cloudinary from "../utils/cloudinary"



export const createIngredientsController = async (request: AuthRequest, response: Response) => {
    try {
        if (!request.file) {
            response.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const uploadResult = await cloudinary.uploader.upload(request.file.path, {
        folder: 'nextjs_uploads',
        });

        fs.unlinkSync(request.file.path); 

        response.json({ url: uploadResult.secure_url });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Upload failed' });
    }
        
    
};

