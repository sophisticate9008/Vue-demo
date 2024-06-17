<template>
    <div class="reply-item"
     :class="getClass(item.state)">
        <div class="reply-header">
            <el-avatar :src="intactPath(user.avatarPath)" size="default" />
            <span>{{ user.account }} {{ convertBeijingTime(item.replyTime) }}</span>
            <div class="buttons">
                <el-button v-if="!isOwner" type="primary" circle size="default" @click="emit('unlock', item.id)">
                    <el-icon size="default">
                        <Unlock />
                    </el-icon>
                </el-button>
                <el-button v-if="isOwner" type="success" circle size="default" @click="confirmDialog('apply', item.id)">
                    <el-icon size="default">
                        <Select />
                    </el-icon>
                </el-button>
                <el-button v-if="isOwner" type="danger" circle size="default" @click="confirmDialog('reject', item.id)">
                    <el-icon size="default">
                        <Close />
                    </el-icon>
                </el-button>

            </div>

        </div>
        <div class="reply-body">
            {{ item.content }}
        </div>
    </div>
</template>
<script setup lang="ts">

import { convertBeijingTime } from '../tool';
import { ReplyBody, UserBody } from '../type';
import {
    Unlock,
    Select,
    Close
} from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { myElMessage } from '../tool';
import axios from 'axios';
import { intactPath } from '../tool';
defineProps<{
    item: ReplyBody
    user: UserBody
    isOwner: boolean
}>();
const getClass = (state: number) => {
  switch (state) {
    case -1:
      return 'lock';
    case -2:
      return 'unlock';
    case 0:
      return 'normal';
    case 2:
      return 'reject';
    case 1:
      return 'apply';
    default:
      return '';
  }
};
const emit = defineEmits(["unlock"])
const sendApplyOrRegect = async (arg: string, replyId: number) => {
    const res = await axios.get(`/api/reply/${arg}?replyId=` + replyId);
    myElMessage(res);
}
const confirmDialog = (arg: string, id: number) => {
    ElMessageBox.confirm("操作不可回退", '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        sendApplyOrRegect(arg, id);
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消'
        });
    });

}
</script>
<style scoped>
.reply-item.unlock {
    box-shadow: 0 0 4px 1px rgba(147, 147, 147, 0.296);
    background-color: rgba(147, 147, 147, 0.296);
}
.reply-item.normal {
    background-color: #79bcff88;
    box-shadow: 0 0 4px 1px #79bcff88;
}
.reply-item.reject {
    background-color: #f3908982;
    box-shadow: 0 0 4px 1px #f3908982;
}
.reply-item.apply {
    background-color: #a2f78382;
    box-shadow: 0 0 4px 1px #a2f78382;
}
.reply-item.lock {
    background-color: #fcfcb4ba;
    box-shadow: 0 0 4px 1px #fcfcb4ba;
}
.reply-item {
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.buttons {
    position: absolute;
    right: 0px;
}

.reply-header {
    position: relative;
    font-size: 12px;
    display: flex;
    flex-direction: row;
}

.reply-header span {
    text-align: center;
    align-items: center;
    display: inline-flex;
}

.reply-body {
    font-size: 14px;
    word-wrap: normal;
    height: 100px;
}
</style>