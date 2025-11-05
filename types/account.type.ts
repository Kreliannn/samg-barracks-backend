

export interface accountInterface {
    fullname: string,
    username: string,
    password: string,
    role: {
        isAdmin : boolean,
        isCashier : boolean,
        isManager : boolean,
    },
    branch: string,
}