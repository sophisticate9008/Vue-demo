export interface CommissionBody {
    name: string;
    description: string;
    beginTime: string;
    endTime: string;
    id: number;
    money: number;
    num: number;
    state: number;
    currentNum: number;
    account: string;
}

export interface ReplyBody {
    id: number;
    content: string;
    account: string;
    commissionId: number;
    replyTime: string;
    state: number;
}

export interface UserBody {
    id: number;
    account: string;
    name: string;
    // phone: string;
    // email: string;
    avatarPath: string;
    sex: number;
    age: number;
    signature: string;
}

export interface SideBarItemBody {
    title: string;
    url: string;
    icon: string;

}
export interface MessageBody {
    id: number;
    content: string;
    sender: string;
    receiver: string;
    sendTime: string;
    haveRead: boolean;
}