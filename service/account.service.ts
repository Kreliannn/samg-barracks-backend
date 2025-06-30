import Account from "../model/accounts.model"
import { accountInterface } from "../types/account.type";

export const createAccount = async (accountData: accountInterface) => {
    const account = await Account.create(accountData)
    return account
}

export const findAccountByUsername = async (username: string) => {
    const account = await Account.findOne({ username });
    return account;
}

export const findAccountById = async (id: string) => {
    const account = await Account.findById(id);
    return account;
}