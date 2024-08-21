<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useUserState } from '../provide';
import { MessageBody, UserBody } from '../type';
import { intactPath } from '../tool';

import MyQuillEditor from './MyQuillEditor.vue';

const userState = useUserState();
const userSelf = userState.userInfo;
const props = defineProps<{
    user: UserBody
}>();
var messages = reactive([] as MessageBody[]);
messages = userState.webSocketInstance.messageLoaded[props.user.account];
watch(() => props.user, () => {
    console.log('user changed');
    messages = userState.webSocketInstance.messageLoaded[props.user.account];
    form.value.receiver = props.user.account;
});



const form = ref({
    sender: userSelf.account,
    receiver: props.user.account,
    content: '',
    sendTime: new Date().toISOString(),
    haveRead: false
});
const getClass = (message: MessageBody) => {
    if (message.sender == userSelf.account) {
        return 'message-right';
    } else {
        return 'message-left';
    }
}
const getAvatar = (message: MessageBody) => {
    if (message.sender == userSelf.account) {
        return intactPath(userSelf.avatarPath);
    } else {
        return intactPath(props.user.avatarPath);
    }
}
const sendMessage = () => {
    userState.webSocketInstance.sendMessage(form.value);
}
</script>

<template>
    <div class="chat-window-container">
        <div class="input-container">
            <MyQuillEditor @update:content="form.content = $event" :content="form.content" theme="bubble"></MyQuillEditor>
            <div class="input-buttons">
                <el-button type="primary" @click="sendMessage">发送</el-button>
            </div>
        </div>
        <div class="messages">
            <div v-for="message in messages" :class="[getClass(message), 'message']">
                <el-avatar :src="getAvatar(message)" size="small"> </el-avatar>
                <div class="message-content">
                    <MyQuillEditor  :content="message.content" theme="bubble" :readOnly="true"></MyQuillEditor>
                </div>
            </div>
        </div>
       

    </div>
</template>

<style scoped>
.chat-window-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column-reverse
}
.messages {
    width: 100%;
    flex-grow: 1;
}
.message {
    display: flex;
}

.message-left {
    flex-direction: row;
}

.message-right {
    flex-direction: row-reverse;
}

.input-container {
    position: relative;
    box-sizing: border-box;
    border: 1px solid #D1D5DB;
    height: 20vh;
    width: 100%;
}
.input-buttons {
    display: flex;
    position: absolute;
    bottom:0;
    right: 0;
    margin: 10px;
}
</style>