
export interface CreateCustomerRequest {
    merchantId: number,
    email: string,
    phoneCountryCode: string,
    phoneNumber: string,
    password: string,
    passcode: string,
    forcePasswordChange?: boolean
}