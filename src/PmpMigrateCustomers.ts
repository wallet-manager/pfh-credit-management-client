import { default as randomstring } from 'randomstring';
import { v4 as uuid } from 'uuid';
import { createHash } from 'crypto';

import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from './entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');

import { appendFile, writeFile } from './utils/FileUtils';

import { PmpClient } from './PmpClient';

const clientConfig = CONFIG.clientConfig;
const { privateKey } = CONFIG.identity;

import { CreateCustomerRequest } from '../src/entities/pmp-credit-card/CreateCustomerRequest';
import { CreateCustomerApplicationRequest, CustomerInfo} from '../src/entities/pmp-credit-card/CreateCustomerApplicationRequest';
import { CreateTcspAccountApplicationRequest } from './entities/pmp-tcsp/CreateTcspAccountRequest';

const UPDATE_CUSTOMER_NUMBER_SQL_FILE = './ouput/update-customer-number.sql';

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

    const password = createHash('sha256').update(
            randomstring.generate(16)
        ).digest('hex');

    const passcode = createHash('sha256').update(
            randomstring.generate({
                length: 6,
                charset: 'numeric'
            })
        ).digest('hex');

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
        merchantId: 6,
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

    writeFile(UPDATE_CUSTOMER_NUMBER_SQL_FILE, '-- update customer number');

    for(const info of infos){
        const result = await createCustomerAndApplication(info, emailCustomerIdMap);
        console.info(`create customer successfully ${info.customerNumber} ${info.email}, result ${JSON.stringify(result)}`);

        // output update customer number sql
        const {applicationNumber} = <{applicationNumber:string}>result.result;
        const updateCustomerNumberSql = `update pmp.customer_applications set customer_number = '${info.customerNumber}' where email = '${info.email}' and application_number = '${applicationNumber}' and customer_number is null;`
        appendFile(UPDATE_CUSTOMER_NUMBER_SQL_FILE, updateCustomerNumberSql);
        
    }
}

export async function createTcspAccountApplication(merchantId:number, customerNumber:string){

    const request: CreateTcspAccountApplicationRequest = {
        merchantId,
        customerNumber,
        questionVersion: 1, // default 1
        answers: {
            signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAADICAYAAAAeGRPoAAAAAXNSR0IArs4c6QAACLNJREFUeF7t18GNAjEUREFPZhAZEBmEBpYmg8EHP9VKe/VuV3+pNcfwQ4AAAQIECGwvcGyfQAACBAgQIEBgGHRHQIAAAQIEAgIGPVCiCAQIECBAwKC7AQIECBAgEBAw6IESRSBAgAABAgbdDRAgQIAAgYCAQQ+UKAIBAgQIEDDoboAAAQIECAQEDHqgRBEIECBAgIBBdwMECBAgQCAgYNADJYpAgAABAgQMuhsgQIAAAQIBAYMeKFEEAgQIECBg0N0AAQIECBAICBj0QIkiECBAgAABg+4GCBAgQIBAQMCgB0oUgQABAgQIGHQ3QIAAAQIEAgIGPVCiCAQIECBAwKC7AQIECBAgEBAw6IESRSBAgAABAgbdDRAgQIAAgYCAQQ+UKAIBAgQIEDDoboAAAQIECAQEDHqgRBEIECBAgIBBdwMECBAgQCAgYNADJYpAgAABAgQMuhsgQIAAAQIBAYMeKFEEAgQIECBg0N0AAQIECBAICBj0QIkiECBAgAABg+4GCBAgQIBAQMCgB0oUgQABAgQIGHQ3QIAAAQIEAgIGPVCiCAQIECBAwKC7AQIECBAgEBAw6IESRSBAgAABAgbdDRAgQIAAgYCAQQ+UKAIBAgQIEDDoboAAAQIECAQEDHqgRBEIECBAgIBBdwMECBAgQCAgYNADJYpAgAABAgQMuhsgQIAAAQIBAYMeKFEEAgQIECBg0N0AAQIECBAICBj0QIkiECBAgAABg+4GCBAgQIBAQMCgB0oUgQABAgQIGHQ3QIAAAQIEAgIGPVCiCAQIECBAwKC7AQIECBAgEBAw6IESRSBAgAABAgbdDRAgQIAAgYCAQQ+UKAIBAgQIEDDoboAAAQIECAQEDHqgRBEIECBAgIBBdwMECBAgQCAgYNADJYpAgAABAgQMuhsgQIAAAQIBAYMeKFEEAgQIECBg0N0AAQIECBAICBj0QIkiECBAgAABg+4GCBAgQIBAQMCgB0oUgQABAgQIGHQ3QIAAAQIEAgIGPVCiCAQIECBAwKC7AQIECBAgEBAw6IESRSBAgAABAgbdDRAgQIAAgYCAQQ+UKAIBAgQIEDDoboAAAQIECAQEDHqgRBEIECBAgIBBdwMECBAgQCAgYNADJYpAgAABAgQMuhsgQIAAAQIBAYMeKFEEAgQIECBg0N0AAQIECBAICBj0QIkiECBAgAABg+4GCBAgQIBAQMCgB0oUgQABAgQIGHQ3QIAAAQIEAgIGPVCiCAQIECBAwKC7AQIECBAgEBAw6IESRSBAgAABAgbdDRAgQIAAgYCAQQ+UKAIBAgQIEDDoboAAAQIECAQEDHqgRBEIECBAgIBBdwMECBAgQCAgYNADJYpAgAABAgQMuhsgQIAAAQIBAYMeKFEEAgQIECBg0N0AAQIECBAICBj0QIkiECBAgAABg+4GCBAgQIBAQMCgB0oUIS1wG2PM32c6pXAECFwWMOiXCT1AYJnAHPHH+fr9N+yfZX/JwwQIbC9g0LevUICwwPwyf5/5Xr7Sw02LRuAPAgb9D4ieILBYYA67r/PFyJ4nsLuAQd+9Qf8/AQIECBAYYxh0Z0CAAAECBAICBj1QoggECBAgQMCguwECBAgQIBAQMOiBEkUgQIAAAQIG3Q0QIECAAIGAgEEPlCgCAQIECBAw6G6AAAECBAgEBAx6oEQRCBAgQICAQXcDBAgQIEAgIGDQAyWKQIAAAQIEDLobIECAAAECAQGDHihRBAIECBAgYNDdAAECBAgQCAgY9ECJIhAgQIAAAYPuBggQIECAQEDAoAdKFIEAAQIECBh0N0CAAAECBAICBj1QoggECBAgQMCguwECBAgQIBAQMOiBEkUgQIAAAQIG3Q0QIECAAIGAgEEPlCgCAQIECBAw6G6AAAECBAgEBAx6oEQRCBAgQICAQXcDBAgQIEAgIGDQAyWKQIAAAQIEDLobIECAAAECAQGDHihRBAIECBAgYNDdAAECBAgQCAgY9ECJIhAgQIAAAYPuBggQIECAQEDAoAdKFIEAAQIECBh0N0CAAAECBAICBj1QoggECBAgQMCguwECBAgQIBAQMOiBEkUgQIAAAQIG3Q0QIECAAIGAgEEPlCgCAQIECBAw6G6AAAECBAgEBAx6oEQRCBAgQICAQXcDBAgQIEAgIGDQAyWKQIAAAQIEDLobIECAAAECAQGDHihRBAIECBAgYNDdAAECBAgQCAgY9ECJIhAgQIAAAYPuBggQIECAQEDAoAdKFIEAAQIECBh0N0CAAAECBAICBj1QoggECBAgQMCguwECBAgQIBAQMOiBEkUgQIAAAQIG3Q0QIECAAIGAgEEPlCgCAQIECBAw6G6AAAECBAgEBAx6oEQRCBAgQICAQXcDBAgQIEAgIGDQAyWKQIAAAQIEDLobIECAAAECAQGDHihRBAIECBAgYNDdAAECBAgQCAgY9ECJIhAgQIAAAYPuBggQIECAQEDAoAdKFIEAAQIECBh0N0CAAAECBAICBj1QoggECBAgQMCguwECBAgQIBAQMOiBEkUgQIAAAQIG3Q0QIECAAIGAgEEPlCgCAQIECBAw6G6AAAECBAgEBAx6oEQRCBAgQICAQXcDBAgQIEAgIGDQAyWKQIAAAQIEDLobIECAAAECAQGDHihRBAIECBAgYNDdAAECBAgQCAgY9ECJIhAgQIAAAYPuBggQIECAQEDAoAdKFIEAAQIECBh0N0CAAAECBAICBj1QoggECBAgQMCguwECBAgQIBAQMOiBEkUgQIAAAQIG3Q0QIECAAIGAgEEPlCgCAQIECBAw6G6AAAECBAgEBAx6oEQRCBAgQICAQXcDBAgQIEAgIGDQAyWKQIAAAQIEDLobIECAAAECAQGDHihRBAIECBAgYNDdAAECBAgQCAgY9ECJIhAgQIAAAYPuBggQIECAQEDAoAdKFIEAAQIECBh0N0CAAAECBAICBj1QoggECBAgQOALRf0GyajXJyUAAAAASUVORK5CYII=",
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