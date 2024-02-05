import { default as randomstring } from 'randomstring';
import { v4 as uuid } from 'uuid';


import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from './entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');

import { PmpClient } from './PmpClient';

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

async function createCustomer(info: CustomerInfo){

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
    return response;

}

async function createCustomerApplication(customerId: string, info: CustomerInfo){

    const applicationNumber = uuid();

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

    return response;
}


export async function createCustomerAndApplication(info: CustomerInfo){

    console.info(`Creating customer ${info.email}`);

    // create customer
    const response1 = await createCustomer(info);
    if(response1.error){
        console.info(JSON.stringify(info));
        console.error("Response error of create customer", response1);
        return response1;
    }else{

        const createCustomerResdult = <{customerId:string}> response1.result

        // create customer application
        const response2 = await createCustomerApplication(createCustomerResdult.customerId , info);
        if(response2.error){
            console.info(JSON.stringify(info));
            console.error("Response error of create customer", response2);
        }
        return response2;
    }

}


export async function importCustomerAndApplication(infos: CustomerInfo[]){
    for(const info of infos){
        const result = await createCustomerAndApplication(info);
        console.info(`create customer successfully ${info.email}, result ${JSON.stringify(result)}`);
    }
}