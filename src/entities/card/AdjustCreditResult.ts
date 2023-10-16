import { RepaymentMode } from "../enums"
import { CreditAdjustStatus, CreditAdjustType } from "../enums"

export interface AdjustCreditResult {

    merchantId: number
    orderId: string
    repaymentMode: RepaymentMode
    customerNumber: string
    adjustType: CreditAdjustType
    currency: string
    decimals: number
    adjustCredit: string
    status: CreditAdjustStatus
    createdBy: string
    createdDate: string
    lastModifiedBy: string
    lastModifiedDate: string

}