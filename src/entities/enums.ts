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


export enum OfficialIdType {
    tax = "tax",
    nat = "nat",
    ppt = "ppt",
    dl = "dl",
    suppl = "suppl",
    alt = "alt",
    other = "other"
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
