import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import { AuthRequest } from "../types/request.type";
import { createBranch, getBranch } from "../service/branch.service";
import { createAccount, findAccountByUsername } from "../service/account.service";


export const createBranchController = async (request: AuthRequest, response: Response) => {

    const account: accountInterface = request.body;
    const branchName = account.branch;

     if(await findAccountByUsername(account.username)){
        response.status(409).send("username already exists");
        return
    }

    try{
        await createAccount(account);
        await createBranch(branchName);
        const branch = await getBranch();
        response.send(branch);
    } catch (err) {
        console.log(err);
        response.status(500).send("error occurred")
    }
    
};

export const getBranchController = async (request: AuthRequest, response: Response) => {
    const branch = await getBranch()
    response.send(branch)
};