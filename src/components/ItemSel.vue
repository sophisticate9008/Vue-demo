<template>
    <div class="the-item" :class="[getClass(reply?.state), { active: isSel }]" @click="emit('sel', type == 'reply'? reply: user)">
        <div class="reply-header">
            <AvatarWithInfo :item="user" :avatar-style="{ width: '2vw', height: '2vw' }" />
            <div class="title">
                <span>{{ user.account }}</span>
                <span v-if="updateTime" style="color: #79bcff; font-size: 10px;">{{ convertBeijingTime(updateTime) }}</span>
            </div>
            <el-badge v-if="type != 'reply'" :value="1" class="badge" :badge-style="{'font-size':'10px','background-color': '#79bcffae'} " type="primary">
            </el-badge>

        </div>

    </div>
</template>
<script setup lang="ts">

import { convertBeijingTime } from '../tool';
import {  ReplyBody, UserBody } from '../type';
import AvatarWithInfo from './AvatarWithInfo.vue';



const props = defineProps<{
    updateTime?: string
    reply?: ReplyBody
    user: UserBody
    isSel: boolean
    type: string
}>();
const getClass = (state: number | undefined) => {
    if (!(props.type == 'reply')) {
        return 'normal';
    }
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
</script>
<style scoped>
.the-item.unlock {
    box-shadow: 0 0 4px 1px rgba(147, 147, 147, 0.296);
    background-color: rgba(147, 147, 147, 0.296);
}

.the-item.normal {
    background-color: #79bcff48;

}

.the-item.reject {
    background-color: #f3908969;

}

.the-item.apply {
    background-color: #a2f7836e;

}

.the-item.lock {
    background-color: #fcfcb46f;

}

.the-item {

    cursor: pointer;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-left: 4px solid #79bcff00;
}

.the-item:hover {
    border-left: 4px solid #79bcffae;
    background-color: #79bcff2f;
}

.the-item.active {
    position: relative;
    border-left: 4px solid #79bcff;
}

.the-item.active::before {
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
.badge {
    position: absolute;
    right: 0;
    
}
</style>