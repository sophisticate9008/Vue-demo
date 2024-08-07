import axios, { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { UserBody } from "../type";

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
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}
/**
 * 快捷显示服务器返回消息
 * @param res - 返回体
 * @returns void
 */
export function myElMessage(res: AxiosResponse) : void {
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
export async function uploadFile(file: File) : Promise<string> {
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
export function intactPath(path: string) : string{
    return "/api/file/showFileByPath?path=" + path;
}

/**
 * 获取用户基本信息
 * @param account - 单个用户账号
 * @returns 单个用户的基本信息
 */
export async function getUserBasicInfo(account: string): Promise<UserBody>;

/**
 * 获取用户基本信息
 * @param accounts - 用户账号列表
 * @returns 用户基本信息数组
 */
export async function getUserBasicInfo(accounts: string[]): Promise<UserBody[]>;

/**
 * 获取用户基本信息
 * @param accountOrAccounts - 单个用户账号或用户账号列表
 * @returns 单个用户的基本信息或用户基本信息数组
 */
export async function getUserBasicInfo(accountOrAccounts: string | string[]): Promise<UserBody | UserBody[]> {
  const accounts = Array.isArray(accountOrAccounts) ? accountOrAccounts : [accountOrAccounts];
  const res = await axios.post('/api/user/basicInfos', { accounts });

  const data = res.data.data as UserBody[];

  // 如果传入的是单个账号，则返回第一个用户信息
  if (!Array.isArray(accountOrAccounts)) {
    return data[0];
  }

  // 否则返回用户信息数组
  return data;
}

