<template>
    <div class="add-commission-container">
        <div class="buttons">
            <div id="title">{{ actionType }}委托 </div>
            <el-button type="primary" icon="Upload" circle @click="handleSubmit" style="height: 4vh; width: 4vh;"></el-button>
            <!-- <el-button type="primary" icon="Switch" circle @click="switchPanel"></el-button> -->
        </div>

        <div class="box-card">
            <div class="editor">
                <MyQuillEditor @update:content="form.description = $event" :content="form.description"/>
            </div>
            <div class="form">
                <el-form :model="form" @submit.prevent="handleSubmit" ref="formRef" :rules="rules">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="description" style="display: none;">
                        <el-input v-model="form.description"></el-input>
                    </el-form-item>
                    <el-form-item label="开始" prop="beginTime">
                        <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择日期和时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束" prop="endTime">
                        <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期和时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="金额" prop="money">
                        <el-input v-model="form.money" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="num">
                        <el-input v-model="form.num" type="number"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserState } from '../provide';
import { myElMessage } from '../tool';
import { useRoute } from 'vue-router';
import MyQuillEditor from '../components/MyQuillEditor.vue';

const formRef = ref();
const actionType = ref("添加");
const route = useRoute();

const commissionId = ref(parseInt(route.params.id as string));
if (commissionId.value != -1) {
    actionType.value = "修改";
}
watch(route, () => {
    window.location.reload();
})


const getById = async () => {
    try {
        const res = await axios.get('/api/commission/getById?id=' + commissionId.value);
        console.log(res.data.data);
        form.value = res.data.data;
    } catch (error) {
        ElMessage.error('获取委托信息失败');
    }
};

if (actionType.value == "修改") {
    getById();
}
const userState = useUserState();
const form = ref({
    account: userState.userInfo.account,
    name: '',
    description: '',
    beginTime: '',
    endTime: '',
    money: 0,
    num: 1
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
const add = async () => {
    try {
        const response = await axios.post('/api/commission/add', form.value, {
            headers: { 'Content-Type': 'application/json' }
        });
        myElMessage(response);
    } catch (error) {
        ElMessage.error('委托添加失败');
    }
}
const update = async () => {
    try {
        const response = await axios.post('/api/commission/update', form.value, {
            headers: { 'Content-Type': 'application/json' }
        });
        myElMessage(response);
    } catch (error) {
        ElMessage.error('委托修改失败');
    }
}
const handleSubmit = () => {
    formRef.value?.validate(async (valid: any) => {
        if (valid) {
            if (actionType.value == "修改") {
                await update();
            } else {
                await add();
            }
        } else {
            ElMessage.error('表单验证失败');
        }
    });
};
</script>

<style scoped>
.add-commission-container {
    display: flex;
    flex-direction: column;
    margin: 15px;

    align-items: center;
}

.buttons {
    position: relative;
    width: calc(100% - 2px);

    display: flex;
    flex-direction: row-reverse;
    background-color: white;
    border: 1px solid #D1D5DB;
}

.buttons>* {

    margin: 5px;
}

.box-card {
    margin: 10px;
    display: flex;
    flex: row;
    width: 100%;


}

.editor {
    height: calc(74vh + 42px);
    flex-grow: 1;
    background-color: white;
    box-sizing: border-box;
}

.form {
    height: 74vh;
    width: 16vw;
    margin-left: 10px;
    padding: 20px;
    background-color: white;
    border: 1px solid #D1D5DB;
}

#title {
    position: absolute;
    left: 5px;
    display: inline-flex;
    align-items: center;
    font-weight: bold;
    height: calc(100% - 10px);
}

.full-width-button {
    width: 100%;

}
</style>