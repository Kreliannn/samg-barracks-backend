import { Request, Response } from "express";
import { accountInterface } from "../types/account.type";
import { AuthRequest } from "../types/request.type";
import { createBranch } from "../service/branch.service";
import { createAccount, findAccountByUsername } from "../service/account.service";

export const createBranchController = async (request: AuthRequest, response: Response) => {

    const account: accountInterface = request.body;
    const branchName = account.branch;

     if(await findAccountByUsername(account.username)){
        response.status(409).send("username already exists");
        return
    }

    try{
        await createBranch(branchName);
        await createAccount(account);
        response.send("Branch and account created successfully");
    } catch (err) {
        console.log(err);
        response.status(500).send("error occurred")
    }
    
};

