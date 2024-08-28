<script setup lang="ts">
import { useUserState } from "../provide";
import { ref } from 'vue';

import axiosClient from "../utils/AxiosClient";
import axios from "axios";
import { ElMessage } from "element-plus";
import { WebSocketService } from "../utils/WebSocket";
const isLogin = ref(false);
const userState = useUserState();
const fetchUserInfo = async () => {
    // 在这里调用 useUserState 函数
    try {
        const response = await axios.get('/api/user/info');
        userState.setUserInfo(response.data.data);
        console.log(response.data.data);
        // 更新全局状态或其他操作
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};
const judgeLogin = async () => {
    const response = await axiosClient.get('/api/login/isLogin');
    if (response.data.code == 200) {
        isLogin.value = true;
    } else {
        isLogin.value = false;
    }
}
await judgeLogin();

if (isLogin.value) {
    await fetchUserInfo();
} else {
    if (window.localStorage.getItem('authToken')) {
        window.localStorage.removeItem('authToken');
        ElMessage.error('登录状态失效,请重新登录');
    }

}
var webSocketInstance: WebSocketService;
const initWebsocket = async () => {
    const uuid = crypto.randomUUID();
    await axios.get("/api/message/initUuid?uuid=" + uuid);
    webSocketInstance = new WebSocketService('/websocket', uuid)
    userState.setWebsocketInstance(webSocketInstance);
    const messages = await axios.get("/api/message/loadAll");
    webSocketInstance.messageLoaded = messages.data.data;
    webSocketInstance.user = userState.userInfo;
}
initWebsocket()
const disconnect = async (arg: string) => {
    if(!isLogin.value) {
        return;
    }
    let data = new FormData();
    data.append("arg", arg);
    navigator.sendBeacon('/api/session/stop', data)
}


window.addEventListener('beforeunload', () => {
    disconnect("beforeunload");
});


disconnect("load");
</script>
