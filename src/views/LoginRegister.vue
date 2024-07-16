<template>
    <div v-if="isLoggedIn">
        <Tool></Tool>
    </div>

    <div class="login-register">
        <div class="tabs">
            <button @click="activeTab = 'login'" :class="{ active: activeTab === 'login' }">
                Login
            </button>
            <button @click="activeTab = 'register'" :class="{ active: activeTab === 'register' }">
                Register
            </button>
        </div>
        <div v-if="activeTab === 'login'">
            <h2>Login</h2>
            <form @submit.prevent="handleLogin">
                <div>
                    <el-input type="Account" v-model="loginAccount" placeholder="Account" required clearable />
                </div>
                <div>
                    <el-input type="password" v-model="loginPassword" placeholder="Password" required clearable />
                </div>
                <div class="verification-code-container">
                    <el-input type="code" v-model="loginCode" placeholder="Code" required clearable />
                    <img :src="verificationCodeUrl" @click="refreshVerificationCode" alt="verification code"
                     class="verification-code" />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
        <div v-if="activeTab === 'register'">
            <h2>Register</h2>
            <form @submit.prevent="handleRegister">
                <div>
                    <el-input type="Account" v-model="registerAccount" placeholder="Account" required clearable />
                </div>
                <div>
                    <el-input v-model="registerPassword" type="password" placeholder="Password" required clearable />
                </div>
                <div>
                    <el-input type="password" v-model="registerConfirmPassword" placeholder="Confirm Password" required
                     clearable />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import Tool from '../tool/Tool.vue';
// 状态定义
const activeTab = ref('login');
const loginAccount = ref('');
const loginPassword = ref('');
const loginCode = ref('');
const registerAccount = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');
const verificationCodeUrl = ref('http://localhost:8888/login/getCode');

// 路由
const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);

// 获取用户信息


// 登录处理
const handleLogin = async () => {
    try {
        const response = await axios.post('/api/login/login', {
            account: loginAccount.value,
            password: loginPassword.value,
            code: loginCode.value,
        });
        ElMessage(response.data.msg);
        if (response.data.code == 200) {
            isLoggedIn.value = true;
            window.localStorage.setItem('authToken', response.data.args.jwtToken);
            setTimeout(() => {
                const redirectPath = route.query.redirect || '/';
                router.push(redirectPath as string);
            }, 500);

        }
    } catch (error) {
        console.error('登录失败:', error);
    }
};

// 注册处理
const handleRegister = async () => {
    if (registerPassword.value !== registerConfirmPassword.value) {
        ElMessage.error('密码不匹配');
        return;
    }
    try {
        const response = await axios.get('/api/user/register', {
            params: {
                account: registerAccount.value,
                password: registerPassword.value,
            }

        });
        ElMessage(response.data.msg);
    } catch (error) {
        console.error('注册失败:', error);
    }
};

// 刷新验证码
const refreshVerificationCode = () => {
    verificationCodeUrl.value = `http://localhost:8888/login/getCode?timestamp=${new Date().getTime()}`;
};



</script>

<style scoped>
h2 {
    text-align: center;
}

.login-register {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.tabs button {
    padding: 10px 20px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
}

.tabs button.active {
    border-bottom: 2px solid #42b983;
    font-weight: bold;
}

form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

form div {
    width: 300px;
    margin-bottom: 5px;
}

.verification-code-container {
    display: flex;
    align-items: center;
}

.verification-code {
    margin-left: 10px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"] {
    padding: 10px;
    border: none;
    background-color: #42b983;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    width: 300px;
}

button[type="submit"]:hover {
    background-color: #339966;
}
</style>