import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import {CreditManagementClient} from '../src/CreditManagementClient';
import { WalletManagerUtils } from 'wallet-manager-client-utils';

import { EnquiryPreCreateCardsRequest } from '../src/entities/data/EnquiryPreCreateCardsRequest';

import { expect } from 'chai';

import { Header } from 'wallet-manager-client-utils';

import crypto from 'crypto'

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

describe("Signature", async function () {

    it("check signature", async function () {

        const header : Header = {

            address: "0x3Ff0E0de08C24036688e465Ff33C1323D2f654Dd",
            timestamp: 1698288975328,
            session: "20231026102534844",
            sequence: 4,
            signature: "0x756781e2d9c7ed36bf2dc8b3eee5172679f59092a33a83b50c789ea769db38f525cf53b8e184ef9069dc2d063654c418602acce68d6b6ea367b3f7e34bb7f9391b",

        }

        const verifyResult = WalletManagerUtils.verifyHeader(header, '{"primaryPerson":{"firstName":"JIAXING","lastName":"WU"},"address":{"country":"US","state":"Austin","city":"Austin","line1":"123"},"email":{"email":"990511578@qq.com"},"phone":{"phoneNumber":"123123","countryCode":"1264"},"officialId":{"type":"nat","primary":"123456","country":"CN","active":true},"programName":"test_HKD_Consumer_AssetBack","merchantCustomerRef":"YEng2023102610990"}');

        console.info(JSON.stringify(verifyResult));

    }).timeout(30000);


    //uat BPbJSs8yihK7WcGflN+61JBgEf6cei4ydXFybRRZs0NQQqCcrEUY1aOzvACoeePGOTyyOUaDWCbByFVepI+elD12yaAadBUn1m9hBwCrVq0y
    //uat T9i3G31qbXjsI8Lj6QzmrgnZ2evkoL2rN0ugcqkbLVkd0+wVLTubD7gZwWwRXK+Mt3iHxaxneBOzaTrUiak7wm6Igg4XNg1psy0W2s/9OH8C

    it("generate bearer token", async function () {

        const randomBytes = crypto.randomBytes(81);
        
        // Encode the random bytes to BASE64 format
        const base64Encoded = randomBytes.toString('base64');
        
        console.log('Random Bytes:', randomBytes);
        console.log('BASE64 Encoded:', base64Encoded);


        const inputString = base64Encoded

        const md5Hash = crypto.createHash('md5');

        // Update the hash object with the input string
        md5Hash.update(inputString);

        // Generate the MD5 hash
        const md5Encoded = md5Hash.digest('hex');

        console.log('Input String:', inputString);
        console.log('MD5 Encoded:', md5Encoded);

    }).timeout(30000);

});