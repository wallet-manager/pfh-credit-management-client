import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {CreditManagementClient} from '../src/CreditManagementClient';
import { PreCreateCardRequest } from '../src/entities/admin/PreCreateCardRequest';

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

describe("Test Credit Management - Admin", async function () {

    it("AD1 - Pre Create Cards", async function () {

        const request:PreCreateCardRequest = {
            merchantId,
            count: 10,
            programName,
            cardProfileName,
            preCreatedCardOrderId: `P-${orderSeq}`
        };

        const response = await client.preCreateCards(request);
        console.info(JSON.stringify(response));

    });

});