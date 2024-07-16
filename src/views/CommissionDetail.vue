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
        <!-- <div class="head problem-item">
            <span :class="{ 'active-panel': activePanel == 'problem' }" @click="setActivePanel($event.target, 'problem')">
                委托详情
            </span>
            &nbsp;
            <span :class="{ 'active-panel': activePanel == 'solution' }"
             @click="setActivePanel($event.target, 'solution')">
                回答详情
            </span>
            <div class="moving-border"></div>
            <div id="change-button">

            </div>
        </div> -->
        <SwitchHeadBar :menuItems="menuItems" :headStyle="`background-color: white;border: 2px solid #ededed; font-size: 16px; height: 40px; margin-bottom: 10px;`"
         :itemStyle="`margin: 5px;`" @selHeadMenu="selHeadMenu($event)"></SwitchHeadBar>
        <div class="problem-body" v-if="activePanel == 'problem'">
            <div class="problem-main problem-item">
                <el-scrollbar height="580px">
                    <div class="description">{{ data?.description }}</div>
                </el-scrollbar>
            </div>

            <div class="problem-other">
                <div style="color: green;" class="problem-item">
                    <el-countdown format="DD [days] HH:mm:ss" :value="convertToDayjs(data?.beginTime)">
                    </el-countdown>
                    <div class="countdown-footer">
                        {{ convertToDayjs(data?.beginTime).format('YYYY-MM-DD-HH-mm-ss') }}
                    </div>
                </div>
                <div style="color: red;" class="problem-item">
                    <el-countdown format="DD [days] HH:mm:ss" :value="dayjs(data?.endTime)">
                    </el-countdown>
                    <div class="countdown-footer">
                        {{ convertToDayjs(data?.endTime).format('YYYY-MM-DD-HH-mm-ss') }}
                    </div>
                </div>
                <div class="problem-item">
                    ({{ data?.currentNum }} / {{ data?.num }})
                </div>

            </div>
        </div>

        <div class="solution" v-else>
            <el-scrollbar height="340px">
                <div class="replys">
                    <ReplyItem v-for="item in items" :key="item.reply.id" :item="item.reply" :user=item.user
                     :is-owner="isOwner" @unlock="changeLockConfirm('unlock', $event)" />
                </div>
            </el-scrollbar>
        </div>
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
import $ from 'jquery';
import SwitchHeadBar from '../components/SwitchHeadBar.vue';
const userState = useUserState();
const route = useRoute();
const commissionId = route.params.id;
const data = ref<CommissionBody>();
const isOwner = ref(false);
const formDialogVisible = ref(false);
const activePanel = ref('problem');
interface Item {
    user: UserBody
    reply: ReplyBody
}
const items = ref<Item[]>([]);

const menuItems = ref([
    { name: '委托详情', panel: 'problem' },
    { name: '回答详情', panel: 'solution' }
]);
const selHeadMenu = (panel: string) => {
    activePanel.value = panel;
}
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
        const res = await axios.get(`/api/commission/delete?id=${data.value ? data.value?.id : null}`);
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



.moving-border {
    position: absolute;
    bottom: 0;
    height: 3px;
    width: var(--active-panel-width);
    background-color: #00A1D6;
    transition: left 0.3s, width 0.3s;
    left: var(--active-panel-left);
}

.active-panel {
    color: #00A1D6;
}


::v-deep .el-statistic__number {
    font-size: 15px;
}

::v-deep .el-scrollbar {
    flex: 1;
    /* 使 el-scrollbar 占满剩余空间 */
    overflow: hidden;
    /* 防止内容溢出 */
    height: 100%
}

#the-button {
    position: absolute;
    right: 15px;
}

.problem {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    margin: 15px
}

.problem-item {
    background-color: white;
    border: 2px solid #ededed;
    border-radius: 3px;
}

.problem-body {
    display: flex;
    flex-direction: row;
    background: none;
}


.problem-main {

    width: 88%;
    margin-right: 8px;
    height: 100%;
}

.problem-other {
    background: none;
    flex-grow: 1;
    display: grid;
    grid-auto-columns: max-content;
    /* 根据元素自身的最大内容确定列宽 */
    grid-auto-rows: max-content;
    /* 自动调整行高 */
    gap: 5px;
    /* 设置5px的间距 */
    align-items: center;
    box-sizing: border-box;
    /* 确保 padding 和 border 包含在 width 内 */
}

.problem-other>div {
    background-color: white;
    border-radius: 2px;
    padding: 10px;
    box-sizing: border-box;
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


</style>