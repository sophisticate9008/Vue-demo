<template>
    <div class="form-container">
        <el-dialog v-model="dialogCropperVisible" title="裁剪图片" width="1000">
            <CropperTool @crop-complete="handleCropComplete"></CropperTool>
        </el-dialog>
        <el-card class="box-card">
            <div class="avatar-container">
                <el-avatar :src="croppedImage? croppedImage: intactPath(form.avatarPath) " :size="200" class="avatar" @click="dialogCropperVisible=true"></el-avatar>
            </div>
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


<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserState } from '../provide/index.ts';
import { myElMessage, uploadFile } from '../tool/index.ts';  // Assuming uploadFile is exported from the tool file
import CropperTool from '../tool/CropperTool.vue';
import { intactPath } from '../tool/index.ts';
const croppedImage = ref('');
const dialogCropperVisible = ref(false);
const userState = useUserState();
const form = userState.userInfo;
const avatarFile = ref<File>();
const handleCropComplete = (file: File) => {
    croppedImage.value = URL.createObjectURL(file);
    dialogCropperVisible.value = false;
    avatarFile.value = file;
};
const handleSubmit = async () => {
    try {
        if (avatarFile.value) {
            const avatarPath = await uploadFile(avatarFile.value);
            form.avatarPath = avatarPath;
        }
        const response = await axios.post('/api/user/changeProfile', form);
        myElMessage(response);
    } catch (error) {
        console.error(error);
        ElMessage("修改失败");
    }
};
</script>

<style scoped>
.form-container {
    margin: 15px;
    display: flex;
    height: 100vh;
    background-color: #f5f5f5;

    border-radius: 5px;
}
.avatar-container {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.box-card {
    max-width: 300px;
    width: 100%;
    padding: 20px;
}

.full-width-button {
    width: 100%;
}

.avatar-preview {
    margin-top: 10px;
    max-width: 100px;
    max-height: 100px;
    border-radius: 50%;
}
</style>