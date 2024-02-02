
export interface SetCardPinRequestV2 {

    merchantId: number
    cardId: string
    customerNumber: string
    pin: string
    securityCode: string
    keySessionId: number
}