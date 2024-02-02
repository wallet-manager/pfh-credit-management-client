import { 
    EnumTitle,
    EnumGender,
    EnumDocumentType,
    EnumPurposeApplying,
    EnumMaritalStatus,
    EnumEducationLevel,
    EnumEmploymentStatus,
    EnumJobTitle,
    EnumBusinessIndustry,
    EnumResidentialStatus,
} from "../pmp-enums"


export interface CustomerInfo extends CustomerBase, ApplicationAnswers{
    merchantId: string,
    forcePasswordChange: boolean
}

export interface CreateCustomerApplicationRequest extends CustomerBase {
    applicationNumber: string, //String	Y
    customerId: string, //String	Y
    referralCode: string, //String	Y
    questionVersion: number, //Integer	Y
    answers: ApplicationAnswers
}

export interface CustomerBase{
    merchantId: string,
    kycRef?: unknown, //JSON Object	N
    firstName: string, //String	Y
    lastName: string, //String	Y
    email: string, //String	N
    phoneCountryCode: string, //String	N
    phoneNumber: string, //String	N
    idType: EnumDocumentType, //Enum	Y
    idIssuedBy: string, //String Enum	Y
    idNumber: string, //String	Y
    dateOfBirth: string, //String	Y
    programName: string, //String	Y
}

export interface ApplicationAnswers {
    alias: string
    title: EnumTitle
    gender: EnumGender
    industry: EnumBusinessIndustry
    jobTitle: EnumJobTitle
    chineseName: string
    companyName: string
    nationality: string
    deliveryCity: string
    idTypeOthers: string
    idDateOfIssue: string
    maritalStatus: EnumMaritalStatus
    usCitizenship: boolean
    educationLevel: EnumEducationLevel
    idDateOfExpiry: string
    industryOthers: string
    jobTitleOthers: string
    otherIncomeHKD: string
    deliveryCountry: string
    residentialCity: string
    employmentStatus: EnumEmploymentStatus
    monthlySalaryHKD: string
    residentialStatus: EnumResidentialStatus
    deliveryPostalCode: string
    purposeForApplying: EnumPurposeApplying
    residentialCountry: string
    employmentStartDate: string
    deliveryAddressLine1: string
    deliveryAddressLine2: string
    deliveryAddressLine3: string
    educationLevelOthers: string
    officeTelephoneNumber: string
    residentialPostalCode: string
    authorizedToThirdParty: boolean
    residentialAddressLine1: string
    residentialAddressLine2: string
    residentialAddressLine3: string
    residentialStatusOthers: string
    purposeForApplyingOthers: string
    sameAsResidentialAddress: boolean
    residentialTelephoneNumber: string
}