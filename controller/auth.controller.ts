import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import { createAccount, findAccountByUsername, getAccountByBranch } from "../service/account.service";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { AuthRequest } from "../types/request.type";


dotenv.config();

const secret = process.env.JWT_SECRET || "defaultsecret";

export const registerController = async (request: Request, response: Response) => {

    const account: accountInterface = request.body;

    if(await findAccountByUsername(account.username)){
        response.status(409).send("username already exists");
        return
    }

    try{
        const result = await createAccount(account);
        const accounts = await getAccountByBranch(result.branch);
        response.send(accounts)
    } catch (err) {
        console.log(err);
        response.status(500).send("error occurred")
    }
    
};




export const loginController = async (request: Request, response: Response) => {

    const { username, password} = request.body;
    
    console.log("login")

    const user = await findAccountByUsername(username);
    
    if(!user){
        response.status(404).send("user not found");
        return
    }  

    if(user.password !== password)
    {
        response.status(401).send("invalid credentials");
        return
    }  


    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1d" });

    response.send({fullname : user.fullname, role : user.role, branch : user.branch , token : token});
};





 
