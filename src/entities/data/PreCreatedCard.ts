import { CardType, PreCreatedCardStatus } from "../enums";

export interface PreCreatedCard {
    merchantId: number
    orderId: string
    orderSeq: number
    partnerName: string
    programName: string
    customerNunber: string
    embossedName: string
    cardNumber: string
    cardCreateTime: number
    type: CardType
    expiry: number
    cardProfileName: string
    status: PreCreatedCardStatus
    createdBy: string
    createdDate: string
    modifiedBy: string
    lastModifiedDate: string
}