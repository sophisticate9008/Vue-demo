<script setup>
import { useUserState } from "../provide";
import { ref } from 'vue';
import axios from 'axios';
const isLogin = ref(false);
const fetchUserInfo = async () => {
    const userState = useUserState(); // 在这里调用 useUserState 函数
    try {
        const response = await axios.get('/api/user/info');
        userState.setUserInfo(response.data.data);
        
        // 更新全局状态或其他操作
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};
const judgeLogin = async() => {
    const response = await axios.get('/api/login/isLogin');
    if(response.data.code == 200){
        isLogin.value = true;
    }else{
        isLogin.value = false;
        window.localStorage.removeItem("authToken");
    }
}
await judgeLogin();
if(isLogin.value){
    await fetchUserInfo();
}

</script>