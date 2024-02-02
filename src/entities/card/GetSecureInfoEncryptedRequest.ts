import { GetSecureInfoRequest } from "./GetSecureInfoRequest";

export interface GetSecureInfoEncryptedRequest extends GetSecureInfoRequest {

    publicKey: string

}