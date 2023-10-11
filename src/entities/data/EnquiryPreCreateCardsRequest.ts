export interface EnquiryPreCreateCardsRequest {

    merchantId: number
    offset?: number
    limit?: number
    ascending?: boolean
    orderId?: string
    created_date_from?: number
    created_date_to?: number
    partnerName?: string
    programName?: string
    cardProfileName?: string
    customerNumber?: string

}