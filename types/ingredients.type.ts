export interface branchStockInterface {
    branch : string,
    stock : number
}



export interface ingredientsInterface {
    name : string,
    stocks : branchStockInterface[],
    branch : string,
    type : string,
    img : string
}