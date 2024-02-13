import { importCustomerAndApplication } from './PmpMigrateCustomers';
import { CustomerInfo } from './entities/pmp-credit-card/CreateCustomerApplicationRequest';

import { loadConfig } from 'wallet-manager-client-utils';

const infos = loadConfig<CustomerInfo[]>('customer-infos');

/*
select json_build_object('email', email, 'customerId', customer_id) from pmp.customers 

select json_agg(c) from 
(select email as "email", customer_id as "customerId" from pmp.customers ) c
*/
const emailCustomerIdList = loadConfig<{email:string, customerId:string}[]>('email-customer-list');

const emailCustomerIdMap:any = {};
for(const emailCustomer of emailCustomerIdList ){
    emailCustomerIdMap[emailCustomer.email] = emailCustomer.customerId;
}

async function run(){
    // console.info(JSON.stringify(infos));
    importCustomerAndApplication(infos, emailCustomerIdMap);
}

run();