<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useUserState } from '../provide';
import { MessageBody, UserBody } from '../type';
import { intactPath } from '../tool';
import MyQuillEditor from './MyQuillEditor.vue';

import { ElMessage, ElScrollbar } from 'element-plus';
import axios from 'axios';
const isScrollToUnread = ref(false);
const userState = useUserState();
const userSelf = userState.userInfo;
const editor = ref();
const props = defineProps<{
    unreadNum?: number
    user: UserBody
    oldestUnreadMsg?: MessageBody | null
    newestUnreadMsg?: MessageBody | null
}>();

const localProps = reactive({
    unreadNum: props.unreadNum,
    user: JSON.parse(JSON.stringify(props.user)),
    oldestUnreadMsg: JSON.parse(JSON.stringify(props.oldestUnreadMsg)),
    newestUnreadMsg: JSON.parse(JSON.stringify(props.newestUnreadMsg)),
});
const loadedMsgBackup = ref<Record<string, MessageBody[]>>({});
const loadCount = 10;
const scrollerRef = ref<InstanceType<typeof ElScrollbar>>();
const innerRef = ref<HTMLDivElement>();
var messages = reactive([] as MessageBody[]);
messages = userState.webSocketInstance.messageLoaded[props.user.id];
const scrollerValue = ref<{
    scrollTop: number;
    scrollLeft: number;
}>({ scrollLeft: 0, scrollTop: 500 })
onUnmounted(() => {
    recovery();
})

const isBottom = computed(() => {
    if (innerRef.value) {
        return scrollerValue.value.scrollTop < innerRef.value!.clientHeight - 600;
    } else {
        return false;
    }

})
watch(messages, () => {

    if (scrollerValue.value.scrollTop > innerRef.value!.clientHeight - 600) {
        scrollToEnd();
    }
})
const form = ref<MessageBody>({
    id: 0, // 初始化 id，假设为 0 或其他默认值
    content: '',
    senderId: userSelf.id, // 假设 userSelf 有一个 id 属性
    receiverId: props.user.id, // 假设 props.user 有一个 id 属性
    sendTime: new Date().toISOString(),
    haveRead: false
});
const getClass = (message: MessageBody) => {
    if (message.senderId == userSelf.id) {
        return 'message-right';
    } else {
        return 'message-left';
    }
}
const getAvatar = (message: MessageBody) => {
    if (message.senderId == userSelf.id) {
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
        editor.value.clearContent();
    }
}
const load = () => {
    const end = loadedMsgBackup.value[props.user.account].length;
    const start = Math.max(end - loadCount, 0);
    const additionalMessages = loadedMsgBackup.value[props.user.account].slice(start, end);
    loadedMsgBackup.value[props.user.account].splice(start, end);
    if (additionalMessages.length > 0) {
        messages.unshift(...additionalMessages);
    }// 向上滚动，使用 unshift 插入到数组前面

}

const recordScroll = (res: { scrollLeft: number, scrollTop: number }) => {
    scrollerValue.value = res;
    if (scrollerValue.value.scrollTop < 100) {
        load()
    }
}
const changeObserve = async () => {
    await axios.get("api/message/changeObserve?theObserved=" + props.user.id)
}
const scrollToEnd = () => {
    setTimeout(() => {
        if (scrollerRef.value) {
            scrollerRef.value.setScrollTop(innerRef.value!.clientHeight)
        }
    }, 500)

}
const scrollToUnread = () => {
    isScrollToUnread.value = true;
    if (localProps.oldestUnreadMsg) {
        const targetId = `message${localProps.oldestUnreadMsg.id}`;
        const targetElement = document.getElementById(targetId);

        if (targetElement && scrollerRef.value) {
            const offsetTop = targetElement.offsetTop;
            scrollerRef.value.setScrollTop(offsetTop);
            targetElement.classList.add('highlight');
            setTimeout(() => {
                targetElement.classList.remove('highlight');
            }, 2000); // 动画持续2秒
        } else {
            // 如果找不到该元素，可能需要加载更多消息，直到找到
            load(); // 调用加载更多消息的函数
            nextTick(() => {
                scrollToUnread(); // 递归调用直到找到目标元素
            });
        }
    }
}
const init = () => {
    loadedMsgBackup.value[props.user.account] = messages.slice(0, messages.length);
    if (props.newestUnreadMsg) {
        props.newestUnreadMsg.haveRead = true;
    }
    messages.splice(0, messages.length);
}
const recovery = () => {
    messages.unshift(...loadedMsgBackup.value[props.user.account]);
    loadedMsgBackup.value[props.user.account].splice(0, loadedMsgBackup.value[props.user.account].length);
}
onMounted(() => {
    init();
    load();
    scrollToEnd();
    changeObserve();
});
</script>

<template>
    <div class="chat-window-container">
        <div class="input-container">
            <MyQuillEditor @update:content="form.content = $event" :content="form.content" theme="bubble" ref="editor">
            </MyQuillEditor>
            <div class="input-buttons">
                <el-button type="primary" @click="[sendMessage(), scrollToEnd()]">发送</el-button>
            </div>
        </div>
        <div class="messages">
            <div class="scroll-button" @click="scrollToUnread" v-if="!isScrollToUnread && localProps.unreadNum"
             style="top:1vh">
                ^{{ localProps.unreadNum }}未读消息
            </div>
            <div class="scroll-button" @click="scrollToEnd" v-if="isBottom" style="bottom:1vh">
                回到底部
            </div>
            <el-scrollbar ref="scrollerRef" height="60vh" @scroll="recordScroll">
                <div ref="innerRef" class="scroll-inner">
                    <div v-for="message in messages" :key="message.id" :class="[getClass(message), 'message']"
                     :id="'message' + message.id">
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
@keyframes highlight-animation {
    0% {
        background-color: #b3d4fc;
        /* 浅蓝色 */
    }

    100% {
        background-color: transparent;
        /* 渐变为透明 */
    }
}

.highlight {
    border-radius: 1vw;
    animation: highlight-animation 2s ease-in-out;
}

.scroll-button {
    z-index: 10;
    position: absolute;
    right: 0;
    background-color: #7caef8;
    color: white;
    border-radius: 6vh 0px 0 0;
    padding-left: 1.5vw;
    padding-right: 0.5vw;
    cursor: pointer;
    font-size: 15px;
    font-style: italic;
}

.chat-window-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column-reverse
}

.messages {
    position: relative;
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