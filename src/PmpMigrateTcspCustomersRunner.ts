import { importTcspAccountApplication } from './PmpMigrateCustomers';

import { loadConfig } from 'wallet-manager-client-utils';

const tcspAccountList = loadConfig<string[]>('tcsp-account-list');

async function run(){
    importTcspAccountApplication(6, tcspAccountList);
}

run();