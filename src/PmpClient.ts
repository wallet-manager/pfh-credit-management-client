import { default as axios, AxiosResponse } from 'axios'

import FormData from 'form-data';

import { WalletManagerUtils, WalletManagerRequestCallback } from 'wallet-manager-client-utils';
import { Response } from 'wallet-manager-client-utils/dist/src/entities/Response';
import { ClientConfig } from 'wallet-manager-client-utils/dist/src/entities/Config'

import { CreateRewardRepaymentRequest } from './entities/pmp-reward/CreateRewardRepaymentRequest';
import { CreateCustomerRequest } from './entities/pmp-credit-card/CreateCustomerRequest';
import {CreateCustomerApplicationRequest} from './entities/pmp-credit-card/CreateCustomerApplicationRequest';

import { AxiosInstance } from 'axios';

import { Constants } from 'wallet-manager-client-utils';

export class PmpClient {

    readonly instance: AxiosInstance;
    readonly utils: WalletManagerUtils;
    readonly clientConfig: ClientConfig;

    timeout: number;

    constructor(privateKey: string, clientConfig: ClientConfig, requestCallback: WalletManagerRequestCallback = () => { return }, timeout = 10000) {
        this.utils = new WalletManagerUtils(privateKey, clientConfig.instanceId, requestCallback);
        this.instance = this.utils.createAxiosInstance(clientConfig.baseURL, clientConfig.contentTypeJson);
        this.timeout = timeout;
        this.clientConfig = clientConfig;
    }

    /**
     * CC1 Create Customer
     * @param request 
     * @returns 
     */
    async createCustomer(request: CreateCustomerRequest): Promise<Response<unknown>> {
        const path = `/merchants/${request.merchantId}/customers`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, request, { timeout: this.timeout });
        return response.data;
    }

    /**
     * CC2 Create Customer Application
     * @param request 
     * @returns 
     */
    async createCustomerApplication(request: CreateCustomerApplicationRequest): Promise<Response<unknown>> {
        const path = `/merchants/${request.merchantId}/customer-applications`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, request, { timeout: this.timeout });
        return response.data;
    }



    /**
     * CL2-3
     * @param request 
     * @returns 
     */
    async createRewardRepayment(request: CreateRewardRepaymentRequest): Promise<Response<unknown>> {
        const path = `/merchants/${request.merchantId}/credit-control/reward/repayments`;
        console.info(`POST ${path}`);
        const response = await this.instance.post(path, request, { timeout: this.timeout });
        return response.data;
    }


}