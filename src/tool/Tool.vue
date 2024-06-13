<script setup>
import { useUserState } from "../provide";
import { ref } from 'vue';
import axios from 'axios';
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
await fetchUserInfo();
</script>