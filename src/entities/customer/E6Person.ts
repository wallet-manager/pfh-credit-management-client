import { AddressType, EmailState, EmailType, PhoneType, OfficialIdType } from "../enums"

export interface Person {
    firstName: string
    lastName: string
}

export interface Address {
    line1: string
    line2: string
    line3: string
    postalCode?: string
    city: string
    country: string
}

export interface Email {
    email: string
    state?: EmailState
}

export interface Phone {
    phoneNumber: string
    countryCode: string
}

export interface OfficialId {
    type: OfficialIdType
    idNumber: string
    country: string
    issuanceDate: string
    expirationDate: string
}