import * as fs from'fs'

import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {CreditManagementClient} from '../src/CreditManagementClient';
import { PreCreateCardRequest } from '../src/entities/admin/PreCreateCardRequest';

import { expect } from 'chai';
import { DecryptIdNumberRequest } from '../src/entities/admin/DecryptIdNumberRequest';
import { DecryptDocumentRequest } from '../src/entities/admin/DecryptDocumentRequest';

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
            count: 1,
            programName,
            cardProfileName,
            preCreatedCardOrderId: `P-${orderSeq}`
        };

        const response = await client.preCreateCards(request);
        console.info(JSON.stringify(response));

    }).timeout(10000);

    it("AD2 - Decrypte ID number", async function () {

        const request:DecryptIdNumberRequest = {
            customerNumber: "3002X10001094860513"
        };

        const response = await client.decryptIdNumber(request);
        console.info(JSON.stringify(response));

    }).timeout(10000);


    it("AD2 - Decrypte document", async function () {

        const writer = fs.createWriteStream("abc.txt")

        const request:DecryptDocumentRequest = {
            fileId: "d4c6338a-f429-412d-b3d0-227920c8fcca"
        };

        const response = await client.decryptIdDocument(request);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
          })
        

    }).timeout(10000);

});