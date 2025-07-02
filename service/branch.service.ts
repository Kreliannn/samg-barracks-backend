import Branch from "../model/branch.model"
import { branchInterface } from "../types/branch.type"

export const createBranch = async (branchName: string) => {
    const branch = await Branch.create({ branch : branchName})
    return branch
}

export const getBranch = async () => {
    const branch = await Branch.find();
    return branch;
}