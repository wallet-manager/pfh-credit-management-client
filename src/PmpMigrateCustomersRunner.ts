import { importCustomerAndApplication } from './PmpMigrateCustomers';
import { CustomerInfo } from './entities/pmp-credit-card/CreateCustomerApplicationRequest';

import { loadConfig } from 'wallet-manager-client-utils';
const infos = loadConfig<CustomerInfo[]>('customer-infos');

import { appendFile, writeFile } from './utils/FileUtils';

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

async function run1(){
    // console.info(JSON.stringify(infos));
    importCustomerAndApplication(infos, emailCustomerIdMap);
}

async function run(){
    writeFile('./ouput/update-customer-number.sql', "-- update customer number");
    for(const info of infos){
        if(info.email != ''){
            const updateCustomerNumberSql = `update pmp.customer_applications set customer_number = '${info.customerNumber}' where email = '${info.email}' and status = 1 and customer_number is null;\n`;
            appendFile('./ouput/update-customer-number.sql', updateCustomerNumberSql);

        }
        
    }
}

run();