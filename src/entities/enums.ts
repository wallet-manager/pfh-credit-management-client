import BigNumber from "bignumber.js";

export enum CardType {
    temp = "temp",
    phy = "phy",
    virtual = "virtual"
}

export enum AddressType {
    home = "home",
    ship = "ship",
    biz = "biz"
}

export enum DocumentType {
    id_front = 1,
    id_back = 2
}

export enum OfficialIdType {
    social_insurance = 1,
    tax_id = 2,
    identity_card = 3,
    driving_licence = 4,
    share_code = 5,
    voter_id = 6,
    passport = 7,
    other = 8
}

export enum EmailType {
    work = "work",
    personal = "personal"
}

export enum EmailState {
    verified = "verified",
    unverified = "unverified"

}

export enum PhoneType {
    work = "work",
    home = "home",
    contact = "contact",
    fax = "fax"
}


export enum PreCreatedCardStatus {
    Created = 1,
    Assigned = 2,
    Deleted = 3
}

export enum PreCreatedCardOrderStatus {
    Failed = -2,
    Rejected = -1,
    Pending = 1,
    Approved = 2,
    Executing = 3,
    ExecutedSuccess = 4
}

export enum RepaymentMode {
    Auto = 1,
    ByRequest = 2
}


export enum CreditAdjustType {
    Adjustment = 1,
    SetValue = 2
}

export enum CreditAdjustStatus {
    Rejected = -1,
    Pending = 1,
    Approved = 2,
    Executing = 3,
    ExecutedSuccess = 4,
    ExecutedFailed = 5
}

export enum BalanceAdjustmentType {
    Load = 1,
    Withdraw = 2,
    Fee = 3
}

export enum EnumRepaymentType {
    ByScheduler = 1,
    Manual = 2,
    API = 3
}