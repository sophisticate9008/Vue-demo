<template>
    <div class="form-container">
        <el-card class="box-card">
            <h2>编辑用户信息</h2>
            <el-form :model="form" @submit.prevent="handleSubmit">
                <el-form-item label="账号">
                    <el-input v-model="form.account" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex">
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="form.age" type="number"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit" class="full-width-button">保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserState } from '../provide/index.ts';
const userState = useUserState();
const form = userState.userInfo;

// 假设用户信息通过API获取


// 组件挂载时获取用户信息


const handleSubmit = async () => {
    try {
        const response = await axios.post('/api/user/changeProfile', form.value);
        ElMessage.success('用户信息已更新');
    } catch (error) {
        ElMessage.error('更新用户信息失败');
    }
};
</script>

<style scoped>
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.box-card {
    max-width: 500px;
    width: 100%;
    padding: 20px;
}
.full-width-button {
  width: 100%;
}
</style>