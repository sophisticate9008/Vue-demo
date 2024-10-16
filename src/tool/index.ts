import axios, { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { MessageBody, UserBody } from "../type";

/**
 * 将数据库中存储的北京时间 LocalDateTime 转换为指定格式的字符串
 * @param localDateTime - 数据库中存储的北京时间 LocalDateTime 字符串 (格式: yyyy-MM-dd'T'HH:mm:ss)
 * @returns 北京时间字符串 (格式: yyyy-MM-dd HH:mm:ss)
 */
export function convertBeijingTime(localDateTime: string): string {
    // 创建一个 Date 对象，传入时间字符串
    const date = new Date(localDateTime);

    // 提取各个时间部分
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，所以需要加 1
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // 拼接成指定格式的字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
/**
 * 快捷显示服务器返回消息
 * @param res - 返回体
 * @returns void
 */
export function myElMessage(res: AxiosResponse): void {
    ElMessage({
        message: res.data.msg,
        type: res.data.code === 200 ? 'success' : 'error'
    })
}


/**
 * 上传文件
 * @param 文件
 * @returns 路径
 */
export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('mf', file)
    const res = await axios.post('/api/file/uploadFile', formData)
    return res.data.path;
}

/**
 * 获得完整路径
 * @param 路径
 * @returns 完整路径
 */
export function intactPath(path: string): string {
    return "/api/file/showFileByPath?path=" + path;
}

/**
 * 获取用户基本信息
 * @param userId - 单个用户账号
 * @returns 单个用户的基本信息
 */
export async function getUserBasicInfo(userId: number): Promise<UserBody>;

/**
 * 获取用户基本信息
 * @param userIds - 用户账号列表
 * @returns 用户基本信息数组
 */
export async function getUserBasicInfo(userIds: number[]): Promise<UserBody[]>;

/**
 * 获取用户基本信息
 * @param userIdOrUserIds - 单个用户账号或用户账号列表
 * @returns 单个用户的基本信息或用户基本信息数组
 */
export async function getUserBasicInfo(userIdOrUserIds: number | number[]): Promise<UserBody | UserBody[]> {
    const userIds = Array.isArray(userIdOrUserIds) ? userIdOrUserIds : [userIdOrUserIds];
    const res = await axios.post('/api/user/basicInfos', { ids: userIds });

    const data = res.data.data as UserBody[];

    // 如果传入的是单个账号，则返回第一个用户信息
    if (!Array.isArray(userIdOrUserIds)) {
        return data[0];
    }

    // 否则返回用户信息数组
    return data;
}
/**
 * 获取未读信息 (未读条数,最久未读)
 * @param 消息列表[], receiverId
 * @returns "{未读条数,最久未读}"
 */
export function computeUnreadInfo(messages: MessageBody[], receiverId: number): 
{ count: number | undefined, messageOldest: MessageBody | null, messageNewest: MessageBody | null } {
    let count = 0;
    let messageOldest: MessageBody | null = null;
    let messageNewest: MessageBody | null = null;
    // 从后向前遍历
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.receiverId == receiverId) {

            if (message.haveRead) {
                break; // 找到第一个已读消息，停止遍历
            }
            if(messageOldest == null) {
                messageNewest = message;
            }
            
            count++; // 统计未读消息数量
            messageOldest = message; // 更新最近的未读消息            
        }

    }

    return {
        count: count > 0 ? count : undefined,
        messageOldest,
        messageNewest,
    };
}
