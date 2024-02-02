import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {PmpClient} from '../src/PmpClient';

import { CreateRewardRepaymentRequest } from '../src/entities/pmp-reward/CreateRewardRepaymentRequest';
import { EnumRepaymentType } from '../src/entities/enums';

import { expect } from 'chai';

const clientConfig = CONFIG.clientConfig;
const { privateKey } = CONFIG.identity;

const orderSeq = new Date().getTime();

//
const {programName, cardProfileName} = CONFIG;
//

const merchantId = CONFIG.merchantId;

const client = new PmpClient(privateKey, clientConfig, (request) => {
    console.info(JSON.stringify(request), 30000)

});

describe("Test Credit Management - Reward", async function () {

    it("CL2-3 - Create Reward Repayment", async function () {

        const request:CreateRewardRepaymentRequest = {
            merchantId,
            orderId: `P-${new Date().getTime()}`,
            customerNumber: "3002X10001162040410",
            assetCurrency: "USD-M-BEP20",
            assetCurrencyDecimals: 6,
            assetRepaymentAmount: "10000000",
            type: EnumRepaymentType.API,
            createdBy : "charles"
        };

        const response = await client.createRewardRepayment(request);

        console.info(JSON.stringify(response));

    }).timeout(30000);


});