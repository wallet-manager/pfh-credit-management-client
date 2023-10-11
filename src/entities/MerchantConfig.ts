import { Config } from 'wallet-manager-client-utils';

export interface MerchantConfig extends Config {
    merchantId: number

    programName: string
    cardProfileName: string
}