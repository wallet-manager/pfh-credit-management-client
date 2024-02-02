

export interface EnquiryCardTransactionsRequest {

    merchantId: number,
    offset: number,
    limit: number,
    ascending: boolean,
    creationTimeFrom?: number
    creationTimeTo?: number
    programName?: string
    customerNumber?: string
    transactionType?: number
    isAuthorization?: boolean
    skipCompletedAuthorization?: boolean

}