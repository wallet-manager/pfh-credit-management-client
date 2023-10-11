import { Person, Address, Email, Phone, OfficialId } from "./E6Person"

export interface CreateCustomerWithPreCreatedCardRequest {

    merchantId: number
    customerNumber: string

    primaryPerson: Person
    address?: Address
    email?: Email
    phone?: Phone
    officialId?: OfficialId

    merchantCustomerRef: string

}