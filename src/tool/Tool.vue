<script setup lang="ts">
import { useUserState } from "../provide";
import { onBeforeUnmount, onMounted, ref } from 'vue';

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
var websocket = ref<WebSocketService>();
const initWebsocketUUID = async () => {
    const uuid = crypto.randomUUID();
    userState.setWebsocketUuid(uuid);
    websocket.value = new WebSocketService('/websocket')
}
initWebsocketUUID()
const disconnect = async () => {
    navigator.sendBeacon('/api/session/stop')
    websocket.value?.closeConnection()

}


window.addEventListener('beforeunload', () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('beforeunload', currentTime.toString());
    disconnect();
});
setTimeout(() => {
    if (localStorage.getItem('beforeunload')) {
        const beforeunloadTime = parseInt(localStorage.getItem('beforeunload') || '0');
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - beforeunloadTime;
        console.log(timeDifference);
        if (timeDifference < 1500) {
            disconnect();
        }
    }
    localStorage.removeItem('beforeunload');
}, 1000);
</script>
