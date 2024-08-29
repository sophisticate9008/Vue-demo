<script setup lang="ts">
import Init from './tool/Init.vue';
import SideBar from './components/SideBar.vue';
import { createUserState } from './provide';
import { useRouter } from 'vue-router';

import axios from 'axios';
import { computeUnreadInfo, intactPath } from './tool';
import { computed, ref } from 'vue';
import { MessageBody } from './type';
import { isEqual } from 'lodash';
const router = useRouter();
const userState = createUserState();


const initState = ref();
const changeSel = (url: string) => {
    router.push(url);
};
const sidebarItems = [
    { icon: 'HomeFilled', title: '主页', url: '/' },
    { icon: 'CirclePlus', title: '添加', url: '/addOrUpdateCommission/-1' },
    // { icon: 'Setting', title: 'Settings', url: '/settings' }
]
const logout = () => {
    window.localStorage.removeItem('authToken');
    console.log('Logged out');
    axios.post('/api/login/logout');
    router.push('/');
};
const totalUnreadInfo = computed(() => {
    const messages = userState.webSocketInstance?.messageLoaded
    let totalCount = 0;
    if (messages) {
        for (const theMessages of Object.values(messages)) {
            const { count } = computeUnreadInfo(theMessages as MessageBody[], userState.userInfo.account);
            if (count) {
                totalCount += count;
            }
        }
    }


    return totalCount > 0 ? totalCount : undefined;
});

</script>

<template>
    <div id="main">
        <Init ref="initState"></Init>
        <SideBar :sidebarItems="sidebarItems" title="委托系统"></SideBar>

        <div id="main-window">
            <div id="headBar">
                <div class="headBar-item">
                    <el-dropdown>
                        <el-avatar :size="25" class="el-dropdown-link" :src="intactPath(userState.userInfo.avatarPath)">

                        </el-avatar>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="changeSel('/setting')">设置</el-dropdown-item>
                                <el-dropdown-item @click="changeSel('/profile')">个人中心</el-dropdown-item>
                                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                </div>
                <div class="headBar-item">
                    <el-badge v-if="!isEqual(userState.userInfo, {})" :value="totalUnreadInfo" class="app-badge-item" :offset="[-5, 20]">
                        <el-icon size="25">
                            <ChatDotRound />
                        </el-icon>
                    </el-badge>

                </div>
            </div>
            <div class="router-container">
                <router-view v-slot="{ Component }">
                    <transition>
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>



        </div>

    </div>
</template>

<style scoped>
::v-deep .el-badge__content {
    background-color: #409eff;
    font-size: 10px;

}

:deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
}

.headBar-item {
    cursor: pointer;
    width: 2vw;
    margin-right: 1vw;
}

.router-container {
    flex-grow: 1;
    height: 94vh;
    width: 100%;
}

#main-content {
    flex-grow: 1;
    width: 100%;
}

#main-window {
    background-color: #F4F5F7;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

#headBar {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    height: 6vh;
    width: 100%;
    background-color: #ffffff;
    border-bottom: 1px solid #EDEDED;
}

#main {
    display: flex;
    flex-direction: row;
    height: 100%;
}
</style>
