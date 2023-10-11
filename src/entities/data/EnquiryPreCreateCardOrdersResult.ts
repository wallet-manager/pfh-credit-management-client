export interface EnquiryPreCreateCardOrdersResult {

    merchantId	Long
    orderId	String
    partnerName	String
    programName	String
    count	Integer
    cardProfileName	String
    progress	Integer
    status	Enum
    createdBy	String
    createdDate	Datetime
    lastModifiedBy	String
    lastModifiedDate	Datetime

}