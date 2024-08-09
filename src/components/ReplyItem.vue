<template>
    <div class="reply-item" :class="[getClass(item.state), { active: isSel }]" @click="emit('sel', item)">
        <div class="reply-header">
            <AvatarWithInfo :item="user" :avatar-style="{width: '2vw', height: '2vw'}" />
            <div class="title">
                <span>{{ user.account }}</span>
                <span style="color: #79bcff; font-size: 10px;">{{ convertBeijingTime(item.replyTime) }}</span>
            </div>

        </div>

    </div>
</template>
<script setup lang="ts">

import { convertBeijingTime } from '../tool';
import { ReplyBody, UserBody } from '../type';
import AvatarWithInfo from './AvatarWithInfo.vue';



defineProps<{
    item: ReplyBody
    user: UserBody
    isOwner: boolean
    isSel: boolean
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
    }
};
const emit = defineEmits(["sel"]);
// const sendApplyOrRegect = async (arg: string, replyId: number) => {
//     const res = await axios.get(`/api/reply/${arg}?replyId=` + replyId);
//     myElMessage(res);
// }
// const confirmDialog = (arg: string, id: number) => {
//     ElMessageBox.confirm("操作不可回退", '警告', {
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         type: 'warning'
//     }).then(() => {
//         sendApplyOrRegect(arg, id);
//     }).catch(() => {
//         ElMessage({
//             type: 'info',
//             message: '已取消'
//         });
//     });

// }
// const submitForm = async (item: ReplyBody) => {
//     const res = await axios.post("/api/reply/update", item);
//     myElMessage(res)
// }
</script>
<style scoped>
.reply-item.unlock {
    box-shadow: 0 0 4px 1px rgba(147, 147, 147, 0.296);
    background-color: rgba(147, 147, 147, 0.296);
}

.reply-item.normal {
    background-color: #79bcff48;

}

.reply-item.reject {
    background-color: #f3908969;

}

.reply-item.apply {
    background-color: #a2f7836e;

}

.reply-item.lock {
    background-color: #fcfcb46f;

}

.reply-item {

    cursor: pointer;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-left: 4px solid #79bcff00;
}

.reply-item:hover {
    border-left: 4px solid #79bcffae;
    background-color: #79bcff2f;
}

.reply-item.active {
    position: relative;
    border-left: 4px solid #79bcff;
}

.reply-item.active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: #79bcff2f;
    pointer-events: none;
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
    align-items: center;
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

.title {
    margin-left: 0.5vw;
    display: flex;
    flex-direction: column;
}
</style>