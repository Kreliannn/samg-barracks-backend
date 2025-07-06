import Branch from "../model/branch.model"
import { branchInterface } from "../types/branch.type"

export const createBranch = async (branchName: string) => {
    const tables = [{
        table : "Table #1",
        x : 50,
        y : 50
    }]
    const branch = await Branch.create({ branch : branchName, tables : tables })
    return branch
}

export const updateTables = async (id: string, tables : { table : string, s : number, y : number }) => {
    await Branch.findByIdAndUpdate(id, {tables})
    return await Branch.find()
}

export const findTableByBranch = async (branch : string) => {
    const data = await Branch.findOne({ branch});
    if(!data) return []
    return data.tables;
}

export const getBranch = async () => {
    const branch = await Branch.find();
    return branch;
}

export const getBranchByBranch = async ( branch : string) => {
    const data = await Branch.findOne({branch});
    return data;
}