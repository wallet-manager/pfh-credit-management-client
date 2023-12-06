import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');
import BigNumber from "bignumber.js";

import { CreditManagementClient } from '../src/CreditManagementClient';
import { AdjustCreditRequest } from '../src/entities/card/AdjustCreditRequest';
import { ActivateCardRequest } from '../src/entities/card/ActivateCardRequest';
import { GetSecureInfoRequest } from '../src/entities/card/GetSecureInfoRequest';
import { GetSecureInfoEncryptedRequest } from '../src/entities/card/GetSecureInfoEncryptedRequest';
import { GetPublicKeyForCardSecurityRequest } from '../src/entities/card/GetPublicKeyForCardSecurityRequest';
import { SetCardPinRequest } from '../src/entities/card/SetCardPinRequest';
import { SetCardPinRequestV2 } from '../src/entities/card/SetCardPinRequestV2';

import {EncryptCardPin, PublicKeyDTO, SetPinEncryptedDTO, generateDHKeys} from '../src/EncrypteCardPin'

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
            adjustCredit: "1000",
            createdBy: "charles"
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

    it("CA4 - Get Secure Info", async function () {
        const req:ListCustomerCardsRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        };

        const resp:any = await client.listCustomerCards(req);

        const request:GetSecureInfoRequest = {
            merchantId,
            cardId : resp.result[0].id,
        };

        const response = await client.getSecureInfos(request);
        console.info(JSON.stringify(response));

    }).timeout(100000);


    it("CA4-1 - Get Secure Info encrypted", async function () {
        const req:ListCustomerCardsRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        };

        const resp:any = await client.listCustomerCards(req);

        const request:GetSecureInfoEncryptedRequest = {
            merchantId,
            cardId : resp.result[0].id,
            publicKey: "MIIBCgKCAQEAoXHXlBmibeX4gj22DVM6175tLtZrvWq1H0QiiYFTM5sTbUYG+j4l2f3H6CaDUtEYg/tI/QAgmu/kUZIKqrL053eln2xYxjspR1JWMSkbrZPgdDpXQE0X8jH+CaT5DjDzrSTc1ZWqhXOSnL6EymGcpxkx/dgbkmTqRaRp5/uMmYTFpGnfFqHmo/QRo8K/8CpfPNm2eoWSSYJxGH7iRLgMT6Imseuoy0eRvIDPO7IgzVisgVrwKI/TKu4+PKjZyJFDNKM6M/YUW1BW87jsEpwYWk30HsMhB4DoL20DIXtcWMC0xOqwoObkVfqNSkKjsCYUKOMtvui2TCRoWZfvPzFS5wIDAQAB"
        };

        const response = await client.getSecureInfosEncrypted(request);
        console.info(JSON.stringify(response));

    }).timeout(100000);

    it("CA12 - Set Card PIN", async function () {

        const req:ListCustomerCardsRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        };

        const resp:any = await client.listCustomerCards(req);

        const request:SetCardPinRequest = {
            merchantId,
            cardId : resp.result[0].id,
            customerNumber: "3002X10000911930988",
            securityCode: "548",
            "pin":"NQZWwdTXEaDYJztZd/wQ+g==",
            "encryptedSymmetricKey":"BC8utRQpakD2rVuXe64nVp6sdf25kX4ByFfINeBplbqesctf5aJeH2sTpiT2j729WqjAdsUNYBquHgMxbzB4srSO7RE+SxghQ6KUgTGXQTPKdjOraq60+CG3se2fDlGFy6ksIaNtiHBICPj5CQl6dvF+cfkE",
            "checksum":"51fee1e2f3ea244e96f669ca7e876323e5cdaa6b3fd5f30767e9ac72253ee90d"
        };

        const response = await client.setCardPin(request);
        console.info(JSON.stringify(response));

    });


    it("CA12-1 - Set Card PIN V2", async function () {

        const req:ListCustomerCardsRequest = {
            merchantId,
            customerNumber: "3002X10000911930988"
        };

        const resp:any = await client.listCustomerCards(req);

        const request:SetCardPinRequestV2 = {
            merchantId,
            cardId : resp.result[0].id,
            customerNumber: "3002X10000911930988",
            securityCode: "548",
            //securityCode: "IBrFFh8XYxmJMr6HWRoGM3BS9LCq1jc71lRlF7SNwDuPbecA2RU2jjzl1QlbKqPMCicygpBzrq8QwtVSAUJxgmFdMjl8VBUCTriHtTaBBnL/iqrr/L0+0qIRw0sz4+ZnKhV1Z498DyaF3oj7aDDkIqNkMlUWMPWuhMWqKDKIk7M=",
            pin: "ChbLfsr+YWq/Hz0eyVTVCW+WrkHZEhzD6XVGR8LBJ8dvj9LiN8DBqNOEIcXGfifYtLPIRPB8R5Cu596I61+fzpbIW+F5Q3Wgjti7A6g5s6rWjA+z6Afwqro4NN6tm6Bl1kuj95lMxNk4dc1pf3sjOlxDYIhFaM4yC3bk4m7/y7w=",
            keySessionId: 1701834319065
        };

        const response = await client.setCardPinV2(request);
        console.info(JSON.stringify(response));

    });


    it("CA13 - Get public key", async function () {
   
        const request:GetPublicKeyForCardSecurityRequest = {
            merchantId
        };

        const response = await client.getPublicKeyForCardSecurity(request);
        console.info(JSON.stringify(response));

		// const publicKeyStr = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE5iB2C0SJoV63MaX+3gQxsSL9xA6AboKNdt7mLm+/xTrSVjzr+fAzEWj5cPqvhOyXd6woJ6wg8LrKQQfYh4zewQ==";
		// const publicKey:PublicKeyDTO  = {
        //     publicKey:publicKeyStr

        // }

        // console.info(generateDHKeys());

        // const pinEncrypted = await EncryptCardPin.createSetPinEncryptedPayload(publicKey, "123654");
        // console.info("pin:" + pinEncrypted.pin);
        // console.info("encrypted key:" + pinEncrypted.encryptedSymmetricKey);
        // console.info("checksum:" + pinEncrypted.checksum);

    }).timeout(100000);

    it("CA13-1 - Get public key (RSA)", async function () {
   
        const request:GetPublicKeyForCardSecurityRequest = {
            merchantId
        };

        const response = await client.getPublicKeyForCardSecurityRsa(request);
        console.info(JSON.stringify(response));

    }).timeout(100000);


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