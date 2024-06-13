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