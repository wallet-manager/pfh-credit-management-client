import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {CreditManagementClient} from '../src/CreditManagementClient';
import { EnquiryPreCreateCardsRequest } from '../src/entities/data/EnquiryPreCreateCardsRequest';
import { EnquiryCardTransactionsRequest } from '../src/entities/data/EnquiryCardTransactionsRequest';

import { expect } from 'chai';

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

describe("Test Credit Management - Data", async function () {


    

    it("DT5 - Enquiry pre created card", async function () {

        const request:EnquiryPreCreateCardsRequest = {
            merchantId,
            created_date_from: new Date().getTime()/1000 - 100000,
            created_date_to: new Date().getTime()/1000,
            orderId: "P-1696818023051"
        };

        const response = await client.enquiryPreCreateCards(request);
        console.info(JSON.stringify(response));

    });


    it("DT6 - Enquiry card transactions", async function () {

        const request:EnquiryCardTransactionsRequest = {
            merchantId,
            offset: 0,
            limit: 20,
            ascending: false,
            creationTimeFrom: 0,
            creationTimeTo: new Date().getTime(),
            programName: programName,
            customerNumber: '3002X10001151020530',
            //transactionType: number
            //isAuthorization: false,
            skipCompletedAuthorization: false
        };

        console.info(request);
        const response = await client.enquiryCardTransactions(request);
        console.info("", response.result);

    });

});