import { BalanceAdjustmentType } from "../enums"

export interface AdjustBalanceRequest {
    
    merchantId: number
    customerNumber: string
    type: BalanceAdjustmentType
    amount: string
    currencyCode: string
    authCode: string
    memo: string
    merchantOrderId: string
    attributes: object[],
    createdBy: string

}