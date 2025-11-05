import { getAccount } from "../controller/accounts.controller";
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



export const getAccountByBranch = async (branch: string) => {
    const accounts = await Account.find({ branch: branch });
    return accounts;
}

export const deleteAccountById = async (id: string) => {
    await Account.findByIdAndDelete(id)
}

export const deleteAccountByBranch = async (branch: string) => {
    await Account.deleteMany({branch})
}

export const reformatAccRole = async () => {
    const accounts = await Account.find()
    accounts.forEach(async(acc) => {
        acc.role = {
        isAdmin : true,
        isCashier : false,
        isManager : false,
    },
        await acc.save()
    })
 
}



export const toggleAccountRole = async (id: string, role: string) => {
    const account = await Account.findById(id);

    if (!account) return;

    if (!account.role) {
        account.role = { isAdmin: false, isManager: false, isCashier: false };
    }

    switch (role) {
        case "admin":
        account.role.isAdmin = !account.role.isAdmin;
        break;
        case "manager":
        account.role.isManager = !account.role.isManager;
        break;
        case "cashier":
        account.role.isCashier = !account.role.isCashier;
        break;
    }

    await account.save();
};
