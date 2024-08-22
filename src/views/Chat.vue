<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useUserState } from '../provide';
import { UserBody } from '../type';
import { getUserBasicInfo } from '../tool';
import ItemSel from '../components/ItemSel.vue';
import ChatWindow from '../components/ChatWindow.vue';
const userState = useUserState();

var message = userState.webSocketInstance.messageLoaded;
var messageKeys = userState.webSocketInstance.keys;
const requestedKeys = new Set<string>();
const userBasicInfo = ref<UserBody[]>([]);
const userSel = ref<UserBody>();

const updateAccountsAndFetch = async () => {
    const accounts: string[] = [];
    for (const key of messageKeys) {
        if (!requestedKeys.has(key)) {
            // 如果 key 是新的，则添加到 accounts，并标记为已请求
            accounts.push(key);
            requestedKeys.add(key);
        }

    } 
    if (accounts.length > 0) {
        const newInfo = await getUserBasicInfo(accounts);
        userBasicInfo.value.push(...newInfo)
    }
    console.log(requestedKeys.values())
    console.log(accounts)
}


const selItem = (user: UserBody) => {
    userSel.value = user;
}
const getLastestTime = (key: string) => {
    const theMessage = message[key];
    if (theMessage && theMessage.length > 0) {
        return theMessage[theMessage.length - 1].sendTime;
    }

}
setTimeout(() => {
    message = userState.webSocketInstance.messageLoaded;
    messageKeys = userState.webSocketInstance.keys;
    updateAccountsAndFetch()
}, 200);

watch(messageKeys, () => {
    updateAccountsAndFetch();
});

</script>
<template>
    <div class="chat-container">
        <div style="border:2px solid #ededed;">
            <el-scrollbar height="87vh" style="background-color: white; width: 15vw;">
                <div class="chats">
                    <ItemSel type="chat" v-for="(item, index) in userBasicInfo" :key="index" :user="item"
                     @sel="selItem($event)" :updateTime="getLastestTime(item.account)"
                     :is-sel="item.account == userSel?.account" />
                </div>
            </el-scrollbar>
        </div>
        <div class="chat-window">
            <ChatWindow v-if="userSel" :user="userSel"></ChatWindow>
        </div>
    </div>



</template>
<style scoped>
.chat-container {
    display: flex;
    flex-direction: row;
    margin: 15px;
    align-items: center;
}

.chat-window {
    height: 87vh;
    flex-grow: 1;
    background-color: white;
    border: 2px solid #ededed;
}
</style>