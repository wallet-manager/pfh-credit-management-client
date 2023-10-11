import { WalletManagerUtils, WalletManagerRequestCallback} from 'wallet-manager-client-utils';
import { Response} from 'wallet-manager-client-utils/dist/src/entities/Response';
import { ClientConfig } from 'wallet-manager-client-utils/dist/src/entities/Config'


import { PreCreateCardRequest } from './entities/admin/PreCreateCardRequest';
import { PreCreateCardResult } from './entities/admin/PreCreateCardResult';

import { CreateCustomerWithPreCreatedCardRequest } from './entities/customer/CreateCustomerWithPreCreatedCardRequest';
import { Card } from './entities/customer/E6Card';

import { EnquiryPreCreateCardsRequest } from './entities/data/EnquiryPreCreateCardsRequest';
import { EnquiryPreCreateCardsResult } from './entities/data/EnquiryPreCreateCardsResult';



import { AxiosInstance } from 'axios';

export class CreditManagementClient{

    readonly instance:AxiosInstance;
    readonly utils:WalletManagerUtils;

    constructor(privateKey:string, clientConfig:ClientConfig, requestCallback:WalletManagerRequestCallback = ()=>{return}){
        this.utils = new WalletManagerUtils(privateKey, clientConfig.instanceId, requestCallback);
        this.instance = this.utils.createAxiosInstance(clientConfig.baseURL, clientConfig.contentTypeJson);
    }

    async preCreateCards(request:PreCreateCardRequest):Promise<Response<PreCreateCardResult>>{
        const path = `/admin/pre-created-cards`;
        const response = await this.instance.post(path, request);
        return response.data;
    }

    async createCustomerWithPreCreatedCard(request:CreateCustomerWithPreCreatedCardRequest):Promise<Response<Card[]>>{
        const path = `/merchants/${request.merchantId}/customers/${request.customerNumber}/assign`;
        const response = await this.instance.post(path, request);
        return response.data;
    }

    async enquiryPreCreateCards(request:EnquiryPreCreateCardsRequest):Promise<Response<EnquiryPreCreateCardsResult>>{
        const path = `/merchants/${request.merchantId}/pre-created-cards`;
        console.info(path);
        const response = await this.instance.get(path, {
            params: request
        });
        return response.data;
    }




}