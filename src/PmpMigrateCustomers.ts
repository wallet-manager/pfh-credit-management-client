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
import { CreateTcspAccountApplicationRequest } from './entities/pmp-tcsp/CreateTcspAccountRequest';

// import {
//     EnumTitle,
//     EnumGender,
//     EnumDocumentType,
//     EnumPurposeApplying,
//     EnumMaritalStatus,
//     EnumEducationLevel,
//     EnumEmploymentStatus,
//     EnumJobTitle,
//     EnumBusinessIndustry,
//     EnumResidentialStatus
// } from "../src/entities/pmp-enums"

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


export async function createCustomerAndApplication(info: CustomerInfo, emailCustomerIdMap:any={}){

    console.info(`Start import data of ${info.email} ${info.customerNumber}`);
    let customerId:string = emailCustomerIdMap[info.email];

    if(!customerId){
        console.info(`Creating customer ${info.email}`);
        // create customer
        const response1 = await createCustomer(info);
        if(response1.error){
            console.info(JSON.stringify(info));
            console.error("Response error of create customer", response1);
            return response1;
        }
        const createCustomerResdult = <{customerId:string}> response1.result
        customerId = createCustomerResdult.customerId;
        emailCustomerIdMap[info.email] = customerId;
    }else{
        console.info(`Usering existing customer ${info.email} - ${customerId}`);
    }

    // create customer application
    const response2 = await createCustomerApplication(customerId , info);
    if(response2.error){
        console.info(JSON.stringify(info));
        console.error("Response error of create customer", response2);
    }
    return response2;
}

export async function importCustomerAndApplication(infos: CustomerInfo[], emailCustomerIdMap:any={}){
    for(const info of infos){
        const result = await createCustomerAndApplication(info, emailCustomerIdMap);
        console.info(`create customer successfully ${info.customerNumber} ${info.email}, result ${JSON.stringify(result)}`);
    }
}

export async function createTcspAccountApplication(merchantId:number, customerNumber:string){

    const request: CreateTcspAccountApplicationRequest = {
        merchantId,
        customerNumber,
        questionVersion: 1, // default 1
        answers: {
            signature: "data:image/png;base64,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",
            signatureDate: "2024-01-01",
            sourceOfFunds: 1,
            totalAssetHKD: "0",
            sourceOfWealth: 1,
            enablePrePayment: false,
            expectedTxPerMonth: "0",
            obtainPersonalInfo: true,
            trustAccountReason: 0,
            sourceOfFundsOthers: "***IMPORTED***",
            enableAdvancePayment: false,
            sourceOfWealthOthers: "***IMPORTED***",
            authorizedToThirdParty: false,
            expectedTxAmountPerMonth: "0",
            seniorPublicFigureDeclaration: false,
            remarks: "***IMPORTED, Please refer to the Xfintech PMP system.***",
          }
    };

    const response = await client.createTcspAccountApplication(request);

    if(response.error){
        console.info(JSON.stringify(response));
        console.error("Response error of create tcsp account", response);
    }

    return response;
}

export async function importTcspAccountApplication(merchantId:number, customerNumberList:string[]){
    for(const customerNumber of customerNumberList){
        const response = await createTcspAccountApplication(merchantId, customerNumber);
        //console.info(`create TCSP customer successfully ${customerNumber} result ${JSON.stringify(response.result)}`);
    }
}