<template>
    <div class="reply-item" :class="getClass(item.state)">
        <el-dialog v-model="formDialogVisible" title="Edit Form" width="30%">
            <!-- 在这里放置你的编辑表单内容 -->
            <!-- 例如： -->
            <el-form label-width="120px" v-if="item">
                <!-- Name 表单项 -->
                <el-form-item label="content">
                    <el-input v-model="item.content"></el-input>
                </el-form-item>
                <!-- 提交和取消按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitForm(item)">Submit</el-button>
                    <el-button @click="formDialogVisible = false">Cancel</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
        <div class="reply-header">
            <el-avatar :src="intactPath(user.avatarPath)" size="small" style="border: 1px solid #79bcff;"/>
            <span>
                <span v-if="isOwner">{{ user.account }}</span> 
                {{ convertBeijingTime(item.replyTime) }}
            </span>
            <div class="buttons">
                <el-button v-if="!isOwner && item.state == -1" type="primary" circle size="small"
                 @click="emit('unlock', item.id)">
                    <el-icon size="small">
                        <Unlock />
                    </el-icon>
                </el-button>
                <el-button type="primary" circle size="small" v-if="!isOwner && (item.state == 0 || item.state == -1)"
                 @click="formDialogVisible = true">
                    <el-icon size="small">
                        <Edit />
                    </el-icon>
                </el-button>
                <el-button v-if="isOwner" type="success" circle size="small" @click="confirmDialog('apply', item.id)">
                    <el-icon size="small">
                        <Select />
                    </el-icon>
                </el-button>
                <el-button v-if="isOwner" type="danger" circle size="small" @click="confirmDialog('reject', item.id)">
                    <el-icon size="small">
                        <Close />
                    </el-icon>
                </el-button>

            </div>

        </div>
        <!-- <div class="reply-body">
            {{ item.content }}
        </div> -->
    </div>
</template>
<script setup lang="ts">

import { convertBeijingTime } from '../tool';
import { ReplyBody, UserBody } from '../type';
import {
    Unlock,
    Select,
    Close,
    Edit
} from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { myElMessage } from '../tool';
import axios from 'axios';
import { intactPath } from '../tool';
import { ref } from 'vue';
const formDialogVisible = ref(false);
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
            small:
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
const submitForm = async (item: ReplyBody) => {
    const res = await axios.post("/api/reply/update", item);
    myElMessage(res)
}
</script>
<style scoped>
.reply-item.unlock {
    box-shadow: 0 0 4px 1px rgba(147, 147, 147, 0.296);
    background-color: rgba(147, 147, 147, 0.296);
}

.reply-item.normal {
    background-color: #79bcff88;

}

.reply-item.reject {
    background-color: #f3908982;

}

.reply-item.apply {
    background-color: #a2f78382;

}

.reply-item.lock {
    background-color: #fcfcb4ba;

}

.reply-item {
    border-radius: 5px;
    border: 2px solid #d0d0d0;
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