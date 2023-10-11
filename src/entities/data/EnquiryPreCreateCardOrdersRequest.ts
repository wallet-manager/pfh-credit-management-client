

export interface EnquiryPreCreateCardOrdersRequest {

    merchantId: number
    offset: number
    limit: number
    ascending: boolean
    orderId: string
    createdDateFrom: number
    createdDateTo: number
    partnerName: string
    programName: string
    cardProfileName: string

}