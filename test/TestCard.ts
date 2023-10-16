import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import { CreditManagementClient } from '../src/CreditManagementClient';
import { AdjustCreditRequest } from '../src/entities/card/AdjustCreditRequest';
import { ActivateCardRequest } from '../src/entities/card/ActivateCardRequest';

import { Person } from '../src/entities/customer/E6Person';

import { expect } from 'chai';
import { AddressType, EmailState, EmailType, PhoneType, OfficialIdType } from '../src/entities/enums';
import { ListCustomerCardsRequest } from '../src/entities/card/ListCustomerCardsRequest';

const clientConfig = CONFIG.clientConfig;
const { privateKey } = CONFIG.identity;

const orderSeq = new Date().getTime();

//
const { programName, cardProfileName } = CONFIG;
//

const merchantId = CONFIG.merchantId;

const client = new CreditManagementClient(privateKey, clientConfig, (request) => {
    console.info(JSON.stringify(request))

});

describe("Test Credit Management - Cards", async function () {

    it("CA2 - Adjust Credit", async function () {
        const request:AdjustCreditRequest = {
            merchantId,
            customerNumber: "3002X10000911930988",
            merchantOrderId: `P-${orderSeq}`,
            currency: "HKD",
            adjustCredit: "1000"
        };

        const response = await client.adjustCredit(request);
        console.info(JSON.stringify(response));

    });

    it("CA3 - List Customer Cards", async function () {
        const request:ListCustomerCardsRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        };

        const response = await client.listCustomerCards(request);
        console.info(JSON.stringify(response));

    });

    it("CA5 - Activate Card", async function () {

        const req:ListCustomerCardsRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        };

        const resp:any = await client.listCustomerCards(req);

        const request:ActivateCardRequest = {
            merchantId,
            cardId : resp.result[0].id,
            memo: "That is reason to activate card."
        };

        const response = await client.activateCard(request);
        console.info(JSON.stringify(response));

    });
});