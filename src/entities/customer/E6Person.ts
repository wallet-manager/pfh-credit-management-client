import { AddressType, EmailState, EmailType, PhoneType, OfficialIdType } from "../enums"

export interface Person {
    firstName: string
    lastName: string
}

export interface Address {
    type: AddressType
    line1: string
    line2: string
    line3: string
    neighborhood?: string
    postalCode?: string
    city: string
    state: string
    country: string
    phoneticLine1?: string
    phoneticLine2?: string
    phoneticLine3?: string
}

export interface Email {
    type: EmailType
    email: string
    state?: EmailState
}

export interface Phone {
    type: PhoneType
    phoneNumber: string
    countryCode: string
}

export interface OfficialId {
    type: OfficialIdType
    primary: string
    country: string
    issuanceDate: string
    expirationDate: string
    active?: boolean
}