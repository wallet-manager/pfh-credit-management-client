
export interface CreateCustomerRequest {
    merchantId: string,
    email: string,
    phoneCountryCode: string,
    phoneNumber: string,
    password: string,
    passcode: string,
    forcePasswordChange?: boolean
}