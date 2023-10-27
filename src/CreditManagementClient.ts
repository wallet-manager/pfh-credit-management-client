import { default as axios , AxiosResponse} from 'axios'

import FormData from 'form-data';

import { WalletManagerUtils, WalletManagerRequestCallback} from 'wallet-manager-client-utils';
import { Response} from 'wallet-manager-client-utils/dist/src/entities/Response';
import { ClientConfig } from 'wallet-manager-client-utils/dist/src/entities/Config'


import { PreCreateCardRequest } from './entities/admin/PreCreateCardRequest';
import { PreCreateCardResult } from './entities/admin/PreCreateCardResult';
import { DecryptIdNumberRequest } from './entities/admin/DecryptIdNumberRequest';
import { DecryptDocumentRequest } from './entities/admin/DecryptDocumentRequest';

import { CreateCustomerWithPreCreatedCardRequest } from './entities/customer/CreateCustomerWithPreCreatedCardRequest';
import { UploadDocumentRequest } from './entities/customer/UploadDocumentRequest';

import { EnquiryPreCreateCardsRequest } from './entities/data/EnquiryPreCreateCardsRequest';
import { EnquiryPreCreateCardsResult } from './entities/data/EnquiryPreCreateCardsResult';

import { GetCustomerOfferingRequest } from './entities/customer/GetCustomerOfferingRequest';

import { AdjustCreditRequest } from './entities/card/AdjustCreditRequest';
import { AdjustCreditResult } from './entities/card/AdjustCreditResult';

import { ActivateCardRequest } from './entities/card/ActivateCardRequest';

import { GetSecureInfoRequest } from './entities/card/GetSecureInfoRequest';

import { ListCustomerCardsRequest } from './entities/card/ListCustomerCardsRequest';

import { AxiosInstance } from 'axios';

import { Constants } from 'wallet-manager-client-utils';

export class CreditManagementClient{

    readonly instance:AxiosInstance;
    readonly utils:WalletManagerUtils;
    readonly clientConfig:ClientConfig;

    timeout:number;

    constructor(privateKey:string, clientConfig:ClientConfig, requestCallback:WalletManagerRequestCallback = ()=>{return}, timeout=10000){
        this.utils = new WalletManagerUtils(privateKey, clientConfig.instanceId, requestCallback);
        this.instance = this.utils.createAxiosInstance(clientConfig.baseURL, clientConfig.contentTypeJson);
        this.timeout = timeout;
        this.clientConfig = clientConfig;
    }

    /**
     * AD1
     * @param request 
     * @returns 
     */
    async preCreateCards(request:PreCreateCardRequest):Promise<Response<PreCreateCardResult>>{
        const path = `/admin/pre-created-cards`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, request, {timeout:this.timeout});
        return response.data;
    }

    /**
     * AD2
     * @param request 
     * @returns 
     */
    async decryptIdNumber(request:DecryptIdNumberRequest):Promise<Response<unknown>>{
        const path = `/admin/decrypt/official-ids/${request.customerNumber}`;
        console.info(`GET ${path}`);
        const response = await this.instance.get(path, {timeout:this.timeout});
        return response.data;
    }

    /**
     * AD3
     * @param request 
     * @returns 
     */
    async decryptIdDocument(request:DecryptDocumentRequest):Promise<AxiosResponse>{
        const path = `/admin/decrypt/documents/${request.fileId}`;
        console.info(`GET ${path}`);
        return await this.instance.get(path, {timeout:this.timeout, responseType: 'stream'});
    }

    /**
     * CU1-1
     * @param request 
     * @returns 
     */
    async createCustomerWithPreCreatedCard(request:CreateCustomerWithPreCreatedCardRequest):Promise<Response<unknown>>{
        const path = `/merchants/${request.merchantId}/customers/${request.customerNumber}/assign`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, request, {timeout:this.timeout});
        return response.data;
    }

    /**
     * CU1-3
     * @param request 
     * @returns 
     */
    async uploadDocument(request:UploadDocumentRequest):Promise<Response<unknown>>{

        const signHeaders = this.utils.sign();

        const path = `/merchants/${request.merchantId}/upload`;
        console.info(`MULT-PART POST ${path}`);

        const formData = new FormData();
        formData.append("document", request.documentData, request.documentName);
        formData.append('documentType', request.documentType + "");
        formData.append('merchantCustomerRef', request.merchantCustomerRef);

        const headers:any = {};
        headers[Constants.HEADER_ADDRESS] = signHeaders.address;
        headers[Constants.HEADER_SEQUENCE] = signHeaders.sequence;
        headers[Constants.HEADER_SESSION] = signHeaders.session;
        headers[Constants.HEADER_SIGNATURE] = signHeaders.signature;
        headers[Constants.HEADER_TIMESTAMP] = signHeaders.timestamp;

        const response = await axios.post(this.clientConfig.baseURL + path, formData, {
            headers
        });

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
        const response = await this.instance.get(path, {timeout:this.timeout});
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
        const response = await this.instance.post(path, request, {timeout:this.timeout});
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
            timeout:this.timeout,
            params: {}
        });
        return response.data;
    }

    /**
     * CA4
     * @param request 
     * @returns 
     */
        async getSecureInfos(request:GetSecureInfoRequest):Promise<Response<unknown>>{
            const path = `/merchants/${request.merchantId}/cards/${request.cardId}/secure`;
            console.info(`GET ${path}`);
            const response = await this.instance.get(path, {timeout:this.timeout});
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
            timeout:this.timeout,
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
            timeout:this.timeout,
            params: request
        });
        return response.data;
    }




}