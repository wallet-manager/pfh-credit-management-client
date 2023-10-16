import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {CreditManagementClient} from '../src/CreditManagementClient';
import { CreateCustomerWithPreCreatedCardRequest } from '../src/entities/customer/CreateCustomerWithPreCreatedCardRequest'; 
import { GetCustomerOfferingRequest } from '../src/entities/customer/GetCustomerOfferingRequest';


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
            customerNumber: "3002X10000900250281",
            primaryPerson: {
                firstName: "EFG",
                lastName: "testing"
            },
            address: {
                type: AddressType.ship,
                line1: "building",
                line2: "street",
                line3: "region",
                neighborhood: "",
                postalCode: "",
                city: "New York",
                state: "NY",
                country: "US"
            },
            email: {
                type: EmailType.personal,
                email: "test@18m.dev",
                state: EmailState.verified
            },
            phone: {
                type: PhoneType.home,
                phoneNumber: "98765432",
                countryCode: "852"
            },
            officialId: {
                type: OfficialIdType.nat,
                primary: "H12345678",
                country: "HK",
                issuanceDate: "20200101",
                expirationDate: "20300101",
                active: true
            },
            merchantCustomerRef: `C-${orderSeq}`
        };

        const response = await client.createCustomerWithPreCreatedCard(request);
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