<template>
    <div class="form-container">
        <el-card class="box-card">
            <h2>添加委托</h2>
            <el-form :model="form" @submit.prevent="handleSubmit" ref="formRef" :rules="rules">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginTime">
                    <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择日期和时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期和时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="金额" prop="money">
                    <el-input v-model="form.money" type="number"></el-input>
                </el-form-item>
                <el-form-item label="结果数量" prop="num">
                    <el-input v-model="form.num" type="number"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit" class="full-width-button">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const form = ref({
    account: '',
    name: '',
    description: '',
    beginTime: '',
    endTime: '',
    money: 0,
    num: 0
});

const rules = ref({
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    beginTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
    money: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    num: [{ required: true, message: '请输入结果数量', trigger: 'blur' }]
});

const formRef = ref(null);

const handleSubmit = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                const response = await axios.post('/commission/add', form.value, {
                    headers: { 'Content-Type': 'application/json' }
                });
                ElMessage.success('委托添加成功');
            } catch (error) {
                ElMessage.error('委托添加失败');
            }
        } else {
            ElMessage.error('表单验证失败');
        }
    });
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