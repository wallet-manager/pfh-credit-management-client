import { DocumentType } from "../enums"


export interface UploadDocumentRequest {

    merchantId: number
    documentType: DocumentType
    merchantCustomerRef: string
    documentName: string
    documentData: Buffer

}