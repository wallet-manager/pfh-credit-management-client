import {EnumRepaymentType} from '../enums'

export interface CreateRewardRepaymentRequest {
    merchantId: number
    orderId: string
    customerNumber: string
    assetCurrency: string
    assetCurrencyDecimals: number
    assetRepaymentAmount: string
    type: EnumRepaymentType
    scheduleDate?: string
    createdBy: string
}