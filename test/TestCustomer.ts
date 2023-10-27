
import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {CreditManagementClient} from '../src/CreditManagementClient';
import { CreateCustomerWithPreCreatedCardRequest } from '../src/entities/customer/CreateCustomerWithPreCreatedCardRequest'; 
import { GetCustomerOfferingRequest } from '../src/entities/customer/GetCustomerOfferingRequest';

import { UploadDocumentRequest } from '../src/entities/customer/UploadDocumentRequest';
import { DocumentType } from '../src/entities/enums';

import { expect } from 'chai';
import { AddressType, EmailState, EmailType, PhoneType, OfficialIdType} from '../src/entities/enums';

const clientConfig = CONFIG.clientConfig;
const { privateKey } = CONFIG.identity;

const orderSeq = new Date().getTime();

//
const {programName, cardProfileName} = CONFIG;
//

const merchantId = CONFIG.merchantId;

const client = new CreditManagementClient(privateKey, clientConfig, (request) => {
    console.info(JSON.stringify(request))

});

describe("Test Credit Management - Customer", async function () {

    it("CU1-1 - Create Customer With Pre Created Card", async function () {

        const request:CreateCustomerWithPreCreatedCardRequest = {
            merchantId,
            customerNumber: "3002X10001094860513",
            primaryPerson: {
                firstName: "EFG",
                lastName: "testing"
            },
            address: {
                line1: "building",
                line2: "street",
                line3: "region",
                postalCode: "ccc",
                city: "New York",
                country: "US"
            },
            deliveryAddress: {
                line1: "building",
                line2: "street",
                line3: "region",
                postalCode: "ccc",
                city: "New York",
                country: "US"
            },
            email: {
                email: "test@18m.dev",
                state: EmailState.verified
            },
            phone: {
                phoneNumber: "98765432",
                countryCode: "852"
            },
            officialId: {
                type: OfficialIdType.identity_card,
                idNumber: "H12345678",
                country: "HK",
                issuanceDate: "20200101",
                expirationDate: "20300101"
            },
            merchantCustomerRef: `C-${orderSeq}`
        };

        const response = await client.createCustomerWithPreCreatedCard(request);
        console.info(JSON.stringify(response));

    }).timeout(10000);


    it("CU1-3 - Upload document", async function () {

        const request:UploadDocumentRequest = {
            merchantId,
            documentType: DocumentType.id_back,
            merchantCustomerRef: "C-1698312008973",
            documentName: "abc.txt",
            documentData: Buffer.from('some content')
        }

        const response = await client.uploadDocument(request);

        console.info(JSON.stringify(response));
    
    });

    it("CU13 - Get Customer Offering", async function () {

        const request: GetCustomerOfferingRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        }

        const response = await client.getCustomerOffering(request);

        console.info(JSON.stringify(response));
    });

});