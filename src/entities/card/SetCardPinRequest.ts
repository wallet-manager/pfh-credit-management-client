
export interface SetCardPinRequest {

    merchantId: number
    cardId: string
    customerNumber: string
    pin: string
    securityCode: string
    encryptedSymmetricKey: string
    checksum?: string
}