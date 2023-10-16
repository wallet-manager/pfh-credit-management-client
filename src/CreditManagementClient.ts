import { WalletManagerUtils, WalletManagerRequestCallback} from 'wallet-manager-client-utils';
import { Response} from 'wallet-manager-client-utils/dist/src/entities/Response';
import { ClientConfig } from 'wallet-manager-client-utils/dist/src/entities/Config'


import { PreCreateCardRequest } from './entities/admin/PreCreateCardRequest';
import { PreCreateCardResult } from './entities/admin/PreCreateCardResult';

import { CreateCustomerWithPreCreatedCardRequest } from './entities/customer/CreateCustomerWithPreCreatedCardRequest';
import { Card } from './entities/customer/E6Card';

import { EnquiryPreCreateCardsRequest } from './entities/data/EnquiryPreCreateCardsRequest';
import { EnquiryPreCreateCardsResult } from './entities/data/EnquiryPreCreateCardsResult';

import { GetCustomerOfferingRequest } from './entities/customer/GetCustomerOfferingRequest';

import { AdjustCreditRequest } from './entities/card/AdjustCreditRequest';
import { AdjustCreditResult } from './entities/card/AdjustCreditResult';

import { ActivateCardRequest } from './entities/card/ActivateCardRequest';

import { ListCustomerCardsRequest } from './entities/card/ListCustomerCardsRequest';

import { AxiosInstance } from 'axios';

export class CreditManagementClient{

    readonly instance:AxiosInstance;
    readonly utils:WalletManagerUtils;

    constructor(privateKey:string, clientConfig:ClientConfig, requestCallback:WalletManagerRequestCallback = ()=>{return}){
        this.utils = new WalletManagerUtils(privateKey, clientConfig.instanceId, requestCallback);
        this.instance = this.utils.createAxiosInstance(clientConfig.baseURL, clientConfig.contentTypeJson);
    }

    /**
     * AD1
     * @param request 
     * @returns 
     */
    async preCreateCards(request:PreCreateCardRequest):Promise<Response<PreCreateCardResult>>{
        const path = `/admin/pre-created-cards`;
        const response = await this.instance.post(path, request);
        return response.data;
    }

    /**
     * CU1-1
     * @param request 
     * @returns 
     */
    async createCustomerWithPreCreatedCard(request:CreateCustomerWithPreCreatedCardRequest):Promise<Response<Card[]>>{
        const path = `/merchants/${request.merchantId}/customers/${request.customerNumber}/assign`;
        const response = await this.instance.post(path, request);
        return response.data;
    }

    /**
     * CU13
     * @param request 
     * @returns 
     */
    async getCustomerOffering(request:GetCustomerOfferingRequest):Promise<Response<unknown>>{
        const path = `/merchants/${request.merchantId}/customers/${request.customerNumber}/offering`;
        console.info(`GET ${path}`);
        const response = await this.instance.get(path, {});
        return response.data;
    }

    /**
     * CA2
     * @param request 
     * @returns 
     */
    async adjustCredit(request:AdjustCreditRequest):Promise<Response<AdjustCreditResult>>{
        const path = `/merchants/${request.merchantId}/customers/${request.customerNumber}/offering/adjustCredit`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, request);
        return response.data;
    }

    /**
     * CA3
     * @param request 
     * @returns 
     */
    async listCustomerCards(request:ListCustomerCardsRequest):Promise<Response<unknown>>{
        const path = `/merchants/${request.merchantId}/customers/${request.customerNumber}/cards`;
        console.info(`POST ${path}`);
        const response = await this.instance.get(path, {
            params: {}
        });
        return response.data;
    }


    /**
     * CA5
     * @param request 
     * @returns 
     */
    async activateCard(request:ActivateCardRequest):Promise<Response<unknown>>{
        const path = `/merchants/${request.merchantId}/cards/${request.cardId}/activate`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, {
            memo: request.memo
        });
        return response.data;
    }


    /**
     * DA5
     * @param request 
     * @returns 
     */
    async enquiryPreCreateCards(request:EnquiryPreCreateCardsRequest):Promise<Response<EnquiryPreCreateCardsResult>>{
        const path = `/merchants/${request.merchantId}/pre-created-cards`;
        console.info(path);
        const response = await this.instance.get(path, {
            params: request
        });
        return response.data;
    }




}