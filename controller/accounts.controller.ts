import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import { createAccount, findAccountById , getAccountByBranch, deleteAccountById} from "../service/account.service";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { AuthRequest } from "../types/request.type";





export const getAccount = async (request: AuthRequest, response: Response) => {

    if(!request.id){
        console.log("not autenitcated")
        response.status(500).json({ error: 'not autenitcated' });
        return;
    }
    const account = await findAccountById(request.id);

    if(!account){
        response.status(404).json({ error: 'Account not found' });
        return;
    }

    const branchAccounts = await getAccountByBranch(account.branch);

    response.send(branchAccounts);
};


export const deleteAccount = async (request: AuthRequest, response: Response) => {

    if(!request.id){
        console.log("not autenitcated")
        response.status(500).json({ error: 'not autenitcated' });
        return;
    }
    const account = await findAccountById(request.id);

    if(!account){
        response.status(404).json({ error: 'Account not found' });
        return;
    }

    const { id } = request.params

    await deleteAccountById(id)
    
    const branchAccounts = await getAccountByBranch(account.branch);

    response.send(branchAccounts);
};