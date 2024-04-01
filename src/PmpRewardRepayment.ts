import { loadConfig } from 'wallet-manager-client-utils';
import { MerchantConfig } from '../src/entities/MerchantConfig'
const CONFIG = loadConfig<MerchantConfig>('config');

import {PmpClient} from '../src/PmpClient';
import { appendFile, writeFile } from './utils/FileUtils';

import { CreateRewardRepaymentRequest } from '../src/entities/pmp-reward/CreateRewardRepaymentRequest';
import { EnumRepaymentType } from '../src/entities/enums';
import { json } from 'express';


const clientConfig = CONFIG.clientConfig;
const { privateKey } = CONFIG.identity;

const merchantId = CONFIG.merchantId;

const client = new PmpClient(privateKey, clientConfig, (request) => {
    console.info(JSON.stringify(request), 30000)

});

/*
select json_agg(c) from (
select 
w.program_name as "programName",
w.customer_number as "customerNumber", 
w.client_id as "clientId", 
w.currency as "currency", 
w.balance as "balance",
a.customer_id as "customerId"
from pmp.asset_custody_wallets w join pmp.customer_accounts a on (w.customer_number = a.customer_number)
where w.client_id like 'R%' and w.balance <> 0 
) c
*/

interface RewardRepayment{
    programName:string
    customerNumber:string
    clientId:string
    currency:string
    balance: number
    customerId:string;
}

// uat
const rewardRepaymentList:RewardRepayment[] = 
[
    {"programName":"PFH_BLACK_CARD","customerNumber":"3002X10001220500553","clientId":"R3002X10001220500553","currency":"USD-M-BEP20","balance":2000000,"customerId":"296a7cc0-4dd0-4690-ae64-e1c9dcd5577d"}, 
//  {"programName":"PFH_BLACK_CARD","customerNumber":"3002X10001220500553","clientId":"R3002X10001220500553","currency":"USD-M-BEP20","balance":210000000,"customerId":"296a7cc0-4dd0-4690-ae64-e1c9dcd5577d"}, 
//  {"programName":"PFH_BLACK_CARD","customerNumber":"3002X10001260190224","clientId":"R3002X10001260190224","currency":"USD-M-BEP20","balance":6681,"customerId":"3185d644-aec1-451e-97be-85dee4fc8732"}, 
//  {"programName":"PFH_GOLD_CARD","customerNumber":"3002X10001264860756","clientId":"R3002X10001264860756","currency":"USD-M-BEP20","balance":11600000,"customerId":"843b5029-9edb-4ba7-b41b-14888ad46930"}, 
//  {"programName":"PFH_BLACK_CARD","customerNumber":"3002X10001264400546","clientId":"R3002X10001264400546","currency":"USD-M-BEP20","balance":58380000,"customerId":"843b5029-9edb-4ba7-b41b-14888ad46930"}, 
//  {"programName":"PFH_BLACK_CARD","customerNumber":"3002X10001260170978","clientId":"R3002X10001260170978","currency":"USD-M-BEP20","balance":58380000,"customerId":"358dcd1a-d7e5-46c4-9fdb-485cd0bc7b8e"}, 
//  {"programName":"PFH_WHITE_CARD","customerNumber":"3002X10001301440323","clientId":"R3002X10001301440323","currency":"USD-M-BEP20","balance":4992594,"customerId":"a2c306fd-20a2-4618-9e96-c6cb39a40daa"}, 
//  {"programName":"PFH_GOLD_CARD","customerNumber":"3002X10001331700688","clientId":"R3002X10001331700688","currency":"USD-M-BEP20","balance":4611402,"customerId":"12dd2c30-92de-48ab-af16-6f984896f895"}, 
//  {"programName":"PFH_GOLD_CARD","customerNumber":"3002X10001340870183","clientId":"R3002X10001340870183","currency":"USD-M-BEP20","balance":20590000,"customerId":"d29e3130-2d61-4df0-9b0b-64b61d299634"}, 
//  {"programName":"PFH_GOLD_CARD","customerNumber":"3002X10001380170981","clientId":"R3002X10001380170981","currency":"USD-M-BEP20","balance":5780000,"customerId":"2dd279aa-48eb-4919-9d67-0aa110f35ed7"}, 
//  {"programName":"PFH_WHITE_CARD","customerNumber":"3002X10001390870265","clientId":"R3002X10001390870265","currency":"USD-M-BEP20","balance":32060000,"customerId":"153e62c9-cd1d-4b91-8f4f-2baaca24388c"}, 
//  {"programName":"PFH_GOLD_CARD","customerNumber":"3002X10001380130779","clientId":"R3002X10001380130779","currency":"USD-M-BEP20","balance":2620000,"customerId":"153e62c9-cd1d-4b91-8f4f-2baaca24388c"}
];

// production
const rewardRepaymentList1:RewardRepayment[] = 
[{"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002331780225","clientId":"R3002X10002331780225","currency":"USDM-ERC20","balance":1048780000,"customerId":"8e3fe9d4-ca71-4a95-8cfb-961533298aaf"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002310680743","clientId":"R3002X10002310680743","currency":"USDM-ERC20","balance":999420000,"customerId":"793ea7f3-f45a-4585-82ab-1023af6b0ddf"}, 
 {"programName":"HKD_Consumer_AssetBack","customerNumber":"3002X10002653130892","clientId":"R3002X10002653130892","currency":"USDM-ERC20","balance":1120000,"customerId":"8b4a62a5-b554-4ab4-bd48-bc114db93a6c"}, 
 {"programName":"HKD_Consumer_AssetBack","customerNumber":"3002X10002681040881","clientId":"R3002X10002681040881","currency":"USDM-ERC20","balance":5650000,"customerId":"ab605df8-96e4-479c-bb2f-b9384985b2d4"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002300590449","clientId":"R3002X10002300590449","currency":"USDM-ERC20","balance":4980000,"customerId":"0eeae1ad-812c-48f8-a52b-c7454cf8f6e9"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002310520238","clientId":"R3002X10002310520238","currency":"USDM-ERC20","balance":121960000,"customerId":"25755f16-8fe1-4526-9989-576a8cb10755"}, 
 {"programName":"HKD_Consumer_AssetBack","customerNumber":"3002X10002662430846","clientId":"R3002X10002662430846","currency":"USDM-ERC20","balance":595080000,"customerId":"5772d72b-b79b-4218-8b0e-00bdf49bceac"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002310480920","clientId":"R3002X10002310480920","currency":"USDM-ERC20","balance":97470000,"customerId":"05a0c8af-dc69-4d64-87e6-6c7c8727e471"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002310360130","clientId":"R3002X10002310360130","currency":"USDM-ERC20","balance":24260000,"customerId":"7892c08d-60b2-452d-ba8b-230df0f071f4"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002301190793","clientId":"R3002X10002301190793","currency":"USDM-ERC20","balance":99470000,"customerId":"8aad0b0d-fc4a-402b-9686-830fe416e78c"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002321440343","clientId":"R3002X10002321440343","currency":"USDM-ERC20","balance":5630000,"customerId":"2f5a8917-8a6d-421b-897d-30984d3a84ca"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002322140546","clientId":"R3002X10002322140546","currency":"USDM-ERC20","balance":524120000,"customerId":"ad246c49-23e4-49de-aeb2-a3a7ffcd3814"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002331920128","clientId":"R3002X10002331920128","currency":"USDM-ERC20","balance":2604010000,"customerId":"26fa6eec-3187-4b4b-8d9a-912e84e6a0f6"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002310420249","clientId":"R3002X10002310420249","currency":"USDM-ERC20","balance":87340000,"customerId":"725ebc03-7b66-4576-83a8-b446c44ddfd8"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002300570821","clientId":"R3002X10002300570821","currency":"USDM-ERC20","balance":143980000,"customerId":"f8b32b6b-80c9-48f8-8098-c04184db2cbe"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002310380898","clientId":"R3002X10002310380898","currency":"USDM-ERC20","balance":545600000,"customerId":"c5886b7e-dce0-4f94-b51b-801b9f756c94"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002330360169","clientId":"R3002X10002330360169","currency":"USDM-ERC20","balance":9720000,"customerId":"bea4949d-90c3-4677-a766-1f1ee3edb27b"}, 
 {"programName":"HKD_Consumer_AssetBack","customerNumber":"3002X10002672820648","clientId":"R3002X10002672820648","currency":"USDM-ERC20","balance":57920000,"customerId":"8a135eb4-9739-40c5-b44b-9cc4a2bd8cba"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10002330400213","clientId":"R3002X10002330400213","currency":"USDM-ERC20","balance":330470000,"customerId":"7151d4c7-c05e-4880-854c-ff5bf74deb11"}, 
 {"programName":"HKD_Consumer_Quick","customerNumber":"3002X10000600270779","clientId":"R3002X10000600270779","currency":"USDM-ERC20","balance":913160000,"customerId":"f13001c2-861c-49e6-9801-6c15cb36c92a"}];


const REDEEM_REWARD_HISTORY_SQL = './ouput/redeem-reward-history.sql'

let ts = new Date().getTime();

async function callRedeem(reward:RewardRepayment){
    const request:CreateRewardRepaymentRequest = {
        merchantId:6,
        orderId: `P-${ts++}`,
        customerNumber: reward.customerNumber,
        assetCurrency: reward.currency,
        assetCurrencyDecimals: 6,
        assetRepaymentAmount: reward.balance + "",
        type: EnumRepaymentType.API,
        createdBy : "auto"
    };

    return await client.createRewardRepayment(request);
}


async function rewardReapyment(rewardRepaymentList:RewardRepayment[]){
    writeFile(REDEEM_REWARD_HISTORY_SQL, "-- redeem reward history\n");
    for(const rr of rewardRepaymentList){

        const resposne = await callRedeem(rr);

        if(resposne.error){
            console.info(`Redeem failed ${rr.customerNumber}`);
            console.info("Error to redeem", resposne.error)
        }else{
            const sql = `INSERT INTO pmp_access.redeem_reward_histories(merchant_id, program_name, customer_number, customer_id, asset_currency, asset_currency_decimals, asset_repayment_amount, created_by, created_date, last_modified_by, last_modified_date) VALUES (6, '${rr.programName}', '${rr.customerNumber}', '${rr.customerId}', '${rr.currency}', 6, ${rr.balance}, 'auto', now(), 'auto', now());`
            appendFile(REDEEM_REWARD_HISTORY_SQL, sql + "\n");
            console.info(`Redeem successfully ${rr.customerNumber}`);
        }
    }
}


async function run(){
    // console.info(rewardRepaymentList);
    rewardReapyment(rewardRepaymentList);
}

run();