import { default as randomstring } from 'randomstring';
import { v4 as uuid } from 'uuid';


import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');

import { PmpClient } from '../src/PmpClient';
import { createCustomerAndApplication } from '../src/PmpMigrateCustomers';

const clientConfig = CONFIG.clientConfig;
const { privateKey } = CONFIG.identity;

import { CreateCustomerRequest } from '../src/entities/pmp-credit-card/CreateCustomerRequest';
import { CreateCustomerApplicationRequest, CustomerInfo} from '../src/entities/pmp-credit-card/CreateCustomerApplicationRequest';

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
    EnumResidentialStatus
} from "../src/entities/pmp-enums"

//const {customerId, email, phoneContryCode, phoneNumber};

//const {applicationNumber, customerId, firstName, lastName, email, phoneCountryCode, phoneNumber, idIssuedBy, idType, dateOfBirth, programName, maxCreditLimit, referralCode}


const info:CustomerInfo = {
    merchantId: "6",
    forcePasswordChange: true,

    // application
    email: "eu99+12@18m.dev",
    phoneCountryCode: "+852",
    phoneNumber: "12345680",
    firstName: "Charles",
    lastName: "So",
    idType: EnumDocumentType.IdentityCard,
    idIssuedBy: "HK",
    idNumber: "R123456",
    dateOfBirth: "YYYY-MM-DD",
    programName: "PFH_WHITE_CARD",
    
    // answers
    alias: "***N/A***",
    title: EnumTitle.Mr,
    gender: EnumGender.Male,
    industry: EnumBusinessIndustry.Banking,
    jobTitle: EnumJobTitle.Management,
    chineseName: "***N/A***",
    companyName: "***N/A***",
    nationality: "CHN",
    deliveryCity: "HK",
    idTypeOthers: "",
    idDateOfIssue: "2024-01-01",
    maritalStatus: EnumMaritalStatus.Married,
    usCitizenship: false,
    educationLevel: EnumEducationLevel.University,
    idDateOfExpiry: "***N/A***",
    industryOthers: "",
    jobTitleOthers: "",
    otherIncomeHKD: "***N/A***",
    deliveryCountry: "HKG",
    residentialCity: "HK",
    employmentStatus: EnumEmploymentStatus.Fulltime,
    monthlySalaryHKD: "***N/A***",
    residentialStatus: EnumResidentialStatus.SelfOwned,
    deliveryPostalCode: "0000",
    purposeForApplying: EnumPurposeApplying.Work,
    residentialCountry: "HKG",
    employmentStartDate: "",
    deliveryAddressLine1: "line 1",
    deliveryAddressLine2: "***N/A***",
    deliveryAddressLine3: "***N/A***",
    educationLevelOthers: "",
    officeTelephoneNumber: "***N/A***",
    residentialPostalCode: "0000",
    authorizedToThirdParty: false,
    residentialAddressLine1: "line 1",
    residentialAddressLine2: "***N/A***",
    residentialAddressLine3: "***N/A***",
    residentialStatusOthers: "",
    purposeForApplyingOthers: "",
    sameAsResidentialAddress: true,
    residentialTelephoneNumber: "123456"
};

const client = new PmpClient(privateKey, clientConfig, (request) => {
    console.info(JSON.stringify(request), 30000)

});

function getReferralCode(programName: string) {
    // production
    if (programName == "HKD_Consumer_AssetBack") {
        return "ASSETBACK_MANUALIDV";
    }
    if (programName == "HKD_Consumer_Quick") {
        return "QUICK_MANUALIDV";
    }
    if (programName == "HKD_Consumer_Future") {
        return "FUTURE_MANUALIDV";
    }
    if (programName == "HKD_Consumer_Prosperous") {
        return "PROSPEROUS_MANUALIDV";
    }
    // uat
    if (programName == "PFH_WHITE_CARD") {
        return "WHITE_MANUAL";
    }
    if (programName == "PFH_GOLD_CARD") {
        return "GOLD_MANUAL";
    }
    if (programName == "PFH_BLACK_CARD") {
        return "BLACK_MANUAL";
    }
    return "";
}


describe("Test Customer Migration", async function () {

    it("CC1 Create Customer", async function () {

        const password = randomstring.generate(16);

        const passcode = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });

        const {merchantId, email, phoneCountryCode, phoneNumber, forcePasswordChange} = info;

        const request: CreateCustomerRequest = {
            merchantId,
            email,
            phoneCountryCode,
            phoneNumber,
            password,
            passcode,
            forcePasswordChange
        };

        const response = await client.createCustomer(request);
        console.info(JSON.stringify(response));

    }).timeout(30000);


    it("CC2 Create Customer Applications", async function () {

        const applicationNumber = uuid();
        const customerId = '7f2158da-799b-4ab5-a8dd-8c2550f84d31';

        // application
        const { firstName, lastName, email, phoneCountryCode, phoneNumber, idType, idIssuedBy, idNumber, dateOfBirth, programName } = info;
        // answer
        const {
            gender,
            idTypeOthers,
            idDateOfIssue,
            idDateOfExpiry,
            title,
            alias,
            chineseName,
            nationality,
            usCitizenship,
            purposeForApplying,
            purposeForApplyingOthers,
            maritalStatus,
            educationLevel,
            educationLevelOthers,
            authorizedToThirdParty,
            employmentStatus,
            companyName,
            jobTitle,
            industry,
            industryOthers,
            employmentStartDate,
            officeTelephoneNumber,
            monthlySalaryHKD,
            otherIncomeHKD,
            residentialStatus,
            residentialStatusOthers,
            residentialTelephoneNumber,
            residentialAddressLine1,
            residentialAddressLine2,
            residentialAddressLine3,
            residentialPostalCode,
            residentialCity,
            residentialCountry,
            deliveryAddressLine1,
            deliveryAddressLine2,
            deliveryAddressLine3,
            deliveryPostalCode,
            deliveryCity,
            deliveryCountry,

            sameAsResidentialAddress,
            jobTitleOthers,
        } = info;

        const referralCode = getReferralCode(programName);

        const request: CreateCustomerApplicationRequest = {
            merchantId: "6",
            applicationNumber, //String	Y
            customerId, //String	Y
            kycRef: {}, //JSON Object	N
            firstName, //String	Y
            lastName, //String	Y
            email, //String	N
            phoneCountryCode,
            phoneNumber, //String	N
            idType, //Enum	Y
            idIssuedBy, //String Enum	Y
            idNumber, //String	Y
            dateOfBirth, //String	Y
            programName, //String	Y
            referralCode, //String	Y
            questionVersion: 1, //Integer	Y
            answers:  {
                gender,
                idTypeOthers,
                idDateOfIssue,
                idDateOfExpiry,
                title,
                alias,
                chineseName,
                nationality,
                usCitizenship,
                purposeForApplying,
                purposeForApplyingOthers,
                maritalStatus,
                educationLevel,
                educationLevelOthers,
                authorizedToThirdParty,
                employmentStatus,
                companyName,
                jobTitle,
                industry,
                industryOthers,
                employmentStartDate,
                officeTelephoneNumber,
                monthlySalaryHKD,
                otherIncomeHKD,
                residentialStatus,
                residentialStatusOthers,
                residentialTelephoneNumber,
                residentialAddressLine1,
                residentialAddressLine2,
                residentialAddressLine3,
                residentialPostalCode,
                residentialCity,
                residentialCountry,
                deliveryAddressLine1,
                deliveryAddressLine2,
                deliveryAddressLine3,
                deliveryPostalCode,
                deliveryCity,
                deliveryCountry,
    
                sameAsResidentialAddress,
                jobTitleOthers,
            }
        };

        const response = await client.createCustomerApplication(request);

        console.info(JSON.stringify(response));

    }).timeout(30000);


    it("CC1 + CC2 Create Customer and Applications", async function () {

        const result = await createCustomerAndApplication(info);

        console.info(result)


    }).timeout(30000);
});