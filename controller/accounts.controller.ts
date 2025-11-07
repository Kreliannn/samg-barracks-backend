import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import {   toggleAccountRole,createAccount, findAccountById , getAccountByBranch, deleteAccountById} from "../service/account.service";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { AuthRequest } from "../types/request.type";
import { createActivity } from "../service/activities.service";




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

    const deletedAcc = await deleteAccountById(id)
    
    const branchAccounts = await getAccountByBranch(account.branch);
    
    await createActivity(account.fullname, account.branch, "admin", `deleted ${deletedAcc?.fullname} account`)

    response.send(branchAccounts);
};




export const updateRoleController = async (request: AuthRequest, response: Response) => {

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

    const { id , role } = request.body

    await toggleAccountRole(id , role)
    
    const branchAccounts = await getAccountByBranch(account.branch);

    const updatedUser = await findAccountById(id)

    await createActivity(account.fullname, account.branch, "admin", `grant ${role} role to ${updatedUser?.fullname}`)

    response.send(branchAccounts);
};