import { importCustomerAndApplication } from './PmpMigrateCustomers';
import { CustomerInfo } from './entities/pmp-credit-card/CreateCustomerApplicationRequest';

import { loadConfig } from 'wallet-manager-client-utils';

const infos = loadConfig<CustomerInfo[]>('customer-infos');

async function run(){
    console.info(JSON.stringify(infos));
    // importCustomerAndApplication(infos);
}

run();