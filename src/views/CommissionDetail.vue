<template>
    <el-dialog v-model="formDialogVisible" title="Edit Form" width="30%">
        <!-- 在这里放置你的编辑表单内容 -->
        <!-- 例如： -->
        <el-form label-width="120px" v-if="data">
            <!-- Name 表单项 -->
            <el-form-item label="Name">
                <el-input v-model="data.name"></el-input>
            </el-form-item>

            <!-- Description 表单项 -->
            <el-form-item label="Description">
                <el-input v-model="data.description"></el-input>
            </el-form-item>

            <!-- State 表单项 -->
            <el-form-item label="State">
                <el-select v-model="data.state">
                    <el-option label="委托终止" :value="-1"></el-option>
                    <el-option label="委托进行" :value="0"></el-option>
                </el-select>
            </el-form-item>

            <!-- Begin Time 表单项 -->
            <el-form-item label="Begin Time">
                <el-date-picker v-model="data.beginTime" type="datetime"></el-date-picker>
            </el-form-item>

            <!-- End Time 表单项 -->
            <el-form-item label="End Time">
                <el-date-picker v-model="data.endTime" type="datetime"></el-date-picker>
            </el-form-item>

            <!-- Money 表单项 -->
            <el-form-item label="Money">
                <el-input v-model="data.money" type="number"></el-input>
            </el-form-item>

            <!-- Num 表单项 -->
            <el-form-item label="Num">
                <el-input v-model="data.num" type="number"></el-input>
            </el-form-item>

            <!-- 提交和取消按钮 -->
            <el-form-item>
                <el-button type="primary" @click="submitForm">Submit</el-button>
                <el-button @click="formDialogVisible = false">Cancel</el-button>
                <el-button type="danger" @click="deleteCommission">Delete</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
    <div class="problem">
        <div class="problem-body">
            <div class="head"><span>{{ data?.name }}</span>
                <div id="the-button">
                    <el-button type="primary" size="large" circle v-if="!isOwner" @click="changeLockConfirm('lock')">
                        <el-icon size="large">
                            <Lock />
                        </el-icon>
                    </el-button>
                    <el-button type="primary" size="large" circle v-else @click="formDialogVisible = true">
                        <el-icon size="large">
                            <Edit />
                        </el-icon>
                    </el-button>
                </div>
            </div>
            <el-scrollbar height="300px">
                <div class="description">{{ data?.description }}</div>
            </el-scrollbar>
        </div>
        <div class="problem-other">
            <el-countdown format="DD [days] HH:mm:ss" :value="convertToDayjs(data?.beginTime)">
                <template #title>
                    <div style="display: inline-flex; align-items: center; margin-top: 20px;">
                        <el-icon style="margin-right: 4px" :size="12">
                            <Calendar />
                        </el-icon>
                        Still to go until time begin
                    </div>
                </template>
            </el-countdown>
            <div class="countdown-footer">
                {{ convertToDayjs(data?.beginTime).format('YYYY-MM-DD-HH-mm-ss') }}
            </div>
            <el-divider />
            <el-countdown format="DD [days] HH:mm:ss" :value="dayjs(data?.endTime)">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        <el-icon style="margin-right: 4px" :size="12">
                            <Calendar />
                        </el-icon>
                        Still to go until time stop
                    </div>
                </template>
            </el-countdown>
            <div class="countdown-footer">
                {{ convertToDayjs(data?.endTime).format('YYYY-MM-DD-HH-mm-ss') }}
            </div>
            <el-divider />
            <div class="quota">
                ({{ data?.currentNum }} / {{ data?.num }})
            </div>
        </div>

    </div>
    <div class="solution">
        <el-scrollbar height="340px">
            <div class="replys">
                <ReplyItem v-for="item in items" :key="item.reply.id" :item="item.reply" :user=item.user
                 :is-owner="isOwner" @unlock="changeLockConfirm('unlock', $event)" />
            </div>
        </el-scrollbar>
    </div>


</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { CommissionBody, ReplyBody, UserBody } from '../type';
import {
    Lock, Edit
} from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, dayjs } from 'element-plus';
import { useUserState } from '../provide';
import ReplyItem from '../components/ReplyItem.vue';
import { myElMessage } from '../tool';
const userState = useUserState();
const route = useRoute();
const commissionId = route.params.id;
const data = ref<CommissionBody>();
const isOwner = ref(false);
const formDialogVisible = ref(false);
interface Item {
    user: UserBody
    reply: ReplyBody
}
const items = ref<Item[]>([]);
const getById = async () => {
    const res = await axios.get('/api/commission/getById?id=' + commissionId);
    data.value = res.data.data
    isOwner.value = userState.userInfo.account == data.value?.account
    getItemsByCommissionId()
}
const getItemsByCommissionId = async () => {
    const res1 = await axios.get(`/api/reply/getListByCommissionId?commissionId=${commissionId}&isOwner=${isOwner.value}`);
    const res2 = await axios.post("/api/user/basicInfos", {
        accounts: res1.data.data.map((item: ReplyBody) => item.account)
    })
    items.value = res1.data.data.map((item: ReplyBody, index: number) => {
        return {
            user: res2.data.data[index],
            reply: item
        }
    })
}
const submitForm = async () => {
    try {
        const res = await axios.post(`/api/commission/update`, data.value);
        myElMessage(res);
        formDialogVisible.value = false; // 关闭对话框
    } catch (error) {
        console.error('Error submitting form:', error);
        ElMessage.error('Failed to submit form.');
    }
}
const deleteCommission = async () => {
    try {
        const res = await axios.get(`/api/commission/delete?id=${data.value? data.value?.id : null}`);
        myElMessage(res);
        formDialogVisible.value = false; // 关闭对话框
    } catch (error) {
        console.error('Error submitting form:', error);
        ElMessage.error('Failed to delete commission.');
    } 
}
const convertToDayjs = (time: string | undefined) => {
    return dayjs(time)
}
const sendLock = async () => {
    const res = await axios.get('/api/reply/lock?commissionId=' + commissionId);
    myElMessage(res)
}
const sendUnlock = async (replyId: number) => {
    const res = await axios.get('/api/reply/unlock?replyId=' + replyId);
    myElMessage(res)
}
const changeLockConfirm = (arg: String, replyId: number = 0) => {
    console.log(replyId)
    ElMessageBox.confirm(
        '如果解锁,将失去锁定权,谨慎锁定或解锁',
        'Confirmation',
        {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning',
        }
    ).then(() => {
        if (arg == 'unlock') {
            sendUnlock(replyId);
            return;
        } else {
            sendLock();
        }
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: `${arg} cancelled`,
        });
    });
}

getById();

</script>

<style scoped>
.countdown-footer {
    font-size: 12px;
    color: gary;
    padding-top: 6px;
}

#the-button {
    position: absolute;
    right: 15px;
}

.problem {
    height: 330px;
    border-bottom: 1px solid #EDEDED;
    display: flex;
    flex-direction: row;
}

.problem-body {
    display: flex;
    flex-direction: column;
    width: 84%;
}

.problem-other {
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 16%;
    border-left: 1px solid #EDEDED;
}

.replys {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
    /* 自动填充，每列最小宽度30% */
    gap: 12px;
}

.quota {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.head {
    position: relative;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    height: 50px;
    border-bottom: 1px solid #EDEDED;
}
</style>