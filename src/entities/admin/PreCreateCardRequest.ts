import BigNumber from "bignumber.js";


export interface PreCreateCardRequest {
    merchantId: number
    count: number
    programName:string
    cardProfileName: string
    preCreatedCardOrderId: string

}