import { Request, Response } from "express";
import {   findAccountById ,} from "../service/account.service";
import { AuthRequest } from "../types/request.type";
import { findYearlyWasteByBranch, findMonthWasteByBranch, createWaste } from "../service/waste.service";




export const getWasteController = async (request: AuthRequest, response: Response) => {

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

    const { month } = request.params

    const wastes = month == "year" ? await findYearlyWasteByBranch(account.branch) :  await findMonthWasteByBranch(account.branch, Number(month))

    response.send(wastes)
};



export const createWasteController = async (request: AuthRequest, response: Response) => {

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

    const waste = request.body

    await createWaste(waste)

    response.send("success")
};

