<template>

    <div class="problem">
        <div class="problem-body">
            <div class="head"><span>{{ data?.name }}</span>
                <div id="lock-button">
                    <el-button type="primary" size="large" circle @click="changeLockConfirm('lock')">
                        <el-icon size="large">
                            <Lock />
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
                <ReplyItem v-for="item in items" :key="item.reply.id" :item="item.reply" :user=item.user :is-owner="isOwner"
                @unlock="changeLockConfirm('unlock', $event)" />
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
    Lock,
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
const changeLockConfirm = (arg: String,replyId: number = 0) => {
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

#lock-button {
    position: absolute;
    right: 15px;
}

.problem {
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