<template>


    <div class="problem">
        <div class="headbar">
            <div class="buttons">
                <el-button type="primary" circle v-if="isOwner && activePanel == 'problem'" icon="Edit"
                 @click="jumpToChangePage" style="height: 4vh; width: 4vh;"></el-button>

                <el-button type="danger" circle v-if="isOwner && activePanel == 'problem'" icon="Delete"
                 @click="deleteCommission" style="height: 4vh; width: 4vh;"></el-button>

                <el-button type="success" circle v-if="isOwner && activePanel == 'solution'" icon="Check"
                 @click="confirmDialog('apply', replySel?.id as number)" style="height: 4vh; width: 4vh;"></el-button>

                <el-button type="danger" circle v-if="isOwner && activePanel == 'solution'" icon="close"
                 @click="confirmDialog('reject', replySel?.id as number)" style="height: 4vh; width: 4vh;"></el-button>

                <el-button type="primary" circle v-if="!isOwner && activePanel == 'problem'" icon="Lock"
                 @click="changeLockConfirm('lock')" style="height: 4vh; width: 4vh;"></el-button>

                <el-button type="primary" circle v-if="!isOwner && activePanel == 'solution'" icon="Checked"
                 @click="submitReplyForm(replySel as ReplyBody)" style="height: 4vh; width: 4vh;"></el-button>

                <el-button type="danger" circle v-if="!isOwner && activePanel == 'solution'" icon="Unlock"
                 @click="changeLockConfirm('unlock', replySel?.id)" style="height: 4vh; width: 4vh;"></el-button>
            </div>

            <SwitchHeadBar :menuItems="menuItems"
             :headStyle="`background-color: white;border: 2px solid #ededed; font-size: 2.5vh; height: 5vh; margin-bottom: 1.5vh;`"
             :itemStyle="`margin: 5px;`" @selHeadMenu="selHeadMenu($event)"></SwitchHeadBar>
        </div>
        <div class="problem-body" v-if="activePanel == 'problem'">
            <div class="problem-main problem-item">

                <el-scrollbar height="80vh">
                    <MyQuillEditor v-if="data" class="description" :content="data.description" read-only/>
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
                <div class="problem-item" style="display: inline-flex; align-items: center;  ">
                    <AvatarWithInfo v-if="ownerInfo" :item="ownerInfo"></AvatarWithInfo>
                    <span >
                        &nbsp;&nbsp;({{ data?.currentNum }} / {{ data?.num }})
                    </span>

                </div>
            </div>
        </div>

        <div class="solution" v-else>
            <div style="border:2px solid #ededed;">
                <el-scrollbar height="80vh" style="background-color: white; width: 15vw;">
                    <div class="replys">
                        <ItemSel type="reply" v-for="item in items" :key="item.reply.id" :reply="item.reply" :user=item.user
                        @sel="selItem($event)" :isSel="replySel?.id == item.reply.id" :update-time="item.reply.replyTime" />
                    </div>
                </el-scrollbar>
            </div>
            <div class="replys-view">
                <ReplyView v-if="replySel" :item="replySel" :is-owner="isOwner"></ReplyView>
            </div>
        </div>
    </div>



</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';
import { CommissionBody, ReplyBody, UserBody } from '../type';
import { ElMessageBox, ElMessage, dayjs } from 'element-plus';
import { useUserState } from '../provide';
import { getUserBasicInfo, myElMessage } from '../tool';
import SwitchHeadBar from '../components/SwitchHeadBar.vue';

import ReplyView from '../components/ReplyView.vue';

import AvatarWithInfo from '../components/AvatarWithInfo.vue';
import ItemSel from '../components/ItemSel.vue';
import MyQuillEditor from '../components/MyQuillEditor.vue';

const userState = useUserState();
const route = useRoute();
const router = useRouter();
const commissionId = route.params.id;
const data = ref<CommissionBody>();
const isOwner = ref(false);
const formDialogVisible = ref(false);
const activePanel = ref('problem');
const replySel = ref<ReplyBody>();
interface Item {
    user: UserBody
    reply: ReplyBody
}
const items = ref<Item[]>([]);
const ownerInfo = ref<UserBody>();
const selItem = (reply: ReplyBody) => {
    replySel.value = reply;
}
const menuItems = ref([
    { name: '委托详情', panel: 'problem' },
    { name: '回答详情', panel: 'solution' },
]);
const selHeadMenu = (panel: string) => {
    activePanel.value = panel;
}
const jumpToChangePage = () => {
    router.push(`/addOrUpdateCommission/${commissionId}`)
}
const getById = async () => {
    var res = await axios.get('/api/commission/getById?id=' + commissionId);
    data.value = res.data.data
    isOwner.value = userState.userInfo.account == data.value?.account
    ownerInfo.value = await getUserBasicInfo(data.value?.account as string)
    console.log(ownerInfo.value);
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
    getItemsByCommissionId()
}
const sendUnlock = async (replyId: number) => {
    const res = await axios.get('/api/reply/unlock?replyId=' + replyId);
    myElMessage(res)
    getItemsByCommissionId()
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
const sendApplyOrReject = async (arg: string, replyId: number) => {
    const res = await axios.get(`/api/reply/${arg}?replyId=` + replyId);
    myElMessage(res);
}
const confirmDialog = (arg: string, id: number) => {
    ElMessageBox.confirm("操作不可回退", '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        sendApplyOrReject(arg, id);
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消'
        });
    });

}
const submitReplyForm = async (item: ReplyBody) => {
    const res = await axios.post("/api/reply/update", item);
    myElMessage(res)
}
getById();

</script>

<style scoped>
.countdown-footer {
    font-size: 1.6vh;
    color: gary;
    padding-top: 6px;
}

.solution {
    display: flex;
    flex-direction: row;
}

.replys-view {
    flex-grow: 1;
    background-color: white;
    border: 2px solid #ededed;
}

.headbar {
    position: relative;
}

.buttons {
    z-index: 1;
    position: absolute;
    right: 0;
    display: flex;

    flex-direction: row-reverse;
}

.buttons>* {
    margin: 5px;
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
    font-size: 2.1vh;
}

::v-deep .el-scrollbar {
    flex: 1;
    /* 使 el-scrollbar 占满剩余空间 */
    overflow: hidden;
    /* 防止内容溢出 */
    height: 100%
}

.problem {
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
    padding: 0.5vw;
    background-color: white;
}

.quota {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
</style>