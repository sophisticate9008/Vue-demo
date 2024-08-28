<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useUserState } from '../provide';
import { MessageBody, UserBody } from '../type';
import { intactPath } from '../tool';
import MyQuillEditor from './MyQuillEditor.vue';

import { ElMessage, ElScrollbar } from 'element-plus';
const userState = useUserState();
const userSelf = userState.userInfo;
const props = defineProps<{
    user: UserBody
}>();
const loadedMsgBackup = ref<MessageBody[]>([]);
const loadCount = 10;
const scrollerRef = ref<InstanceType<typeof ElScrollbar>>();
const innerRef = ref<HTMLDivElement>();
var messages = reactive([] as MessageBody[]);
messages = userState.webSocketInstance.messageLoaded[props.user.account];
const isFinished = ref(false);
const scrollerValue = ref<{
    scrollTop: number;
    scrollLeft: number;
}>({ scrollLeft: 0, scrollTop: 500 })
watch(() => props.user, () => {
    console.log('user changed');
    messages = userState.webSocketInstance.messageLoaded[props.user.account];
    form.value.receiver = props.user.account;
    isFinished.value = false;
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
    if (form.value.content == '' || form.value.content == '<p><br></p>') {
        ElMessage.warning('不能发送空消息');
    } else {
        userState.webSocketInstance.sendMessage(form.value);
        form.value.content = '';
    }

}
const load = () => {
    const end = loadedMsgBackup.value.length;
    const start = Math.max(end - loadCount, 0);
    const additionalMessages = loadedMsgBackup.value.slice(start, end);
    loadedMsgBackup.value.splice(start, end);
    if (additionalMessages.length > 0) {
        messages.unshift(...additionalMessages);
    }// 向上滚动，使用 unshift 插入到数组前面

}

const recordScroll = (res: { scrollLeft: number, scrollTop: number }) => {
    scrollerValue.value = res;
    console.log(scrollerValue.value.scrollTop)
    if (scrollerValue.value.scrollTop < 100) {
        load()
    }
}

const scrollToEnd = () => {
    setTimeout(() => {
        if (scrollerRef.value) {
            scrollerRef.value.setScrollTop(innerRef.value!.clientHeight)
        }
    }, 200)

}
const init = () => {
    loadedMsgBackup.value = messages.slice(0, messages.length);
    messages.splice(0, messages.length);
}
onMounted(() => {
    init();
    load();
    scrollToEnd();
});
</script>

<template>
    <div class="chat-window-container">
        <div class="input-container">
            <MyQuillEditor @update:content="form.content = $event" :content="form.content" theme="bubble">
            </MyQuillEditor>
            <div class="input-buttons">
                <el-button type="primary" @click="[sendMessage(), scrollToEnd()]">发送</el-button>
            </div>
        </div>
        <div class="messages">
            <el-scrollbar ref="scrollerRef" height="60vh" @scroll="recordScroll">
                <div ref="innerRef" class="scroll-inner">
                    <div v-for="message in messages" :key="message.id" :class="[getClass(message), 'message']">
                        <el-avatar :src="getAvatar(message)" size="small"> </el-avatar>
                        <div class="message-content">
                            <MyQuillEditor :content="message.content" read-only></MyQuillEditor>
                        </div>
                    </div>
                </div>

            </el-scrollbar>
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
    margin: 20px;
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
    height: 25vh;
    width: 100%;
}

.input-buttons {
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 10px;
}

.message-content {
    height: auto;
    margin: 15px;
}

::v-deep .message-content .ql-container {
    background-color: #b8d4fe !important;
    border-radius: 10px;
    max-width: 50vw;
}

::v-deep .message-content img {
    max-width: 15vw;
    height: auto !important;
}
</style>