<script setup lang="ts">
import Tool from './tool/Tool.vue';
import SideBar from './components/SideBar.vue';
import { createUserState } from './provide';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import { intactPath } from './tool';
const selUrl = ref('/LoginRegister');
const router = useRouter();
const userState = createUserState();

const changeSel = (url: string) => {
    router.push(url);
    console.log(url);
    if (selUrl.value !== url) {
        selUrl.value = url;
    }
};
const sidebarItems = [
    { icon: 'HomeFilled', title: '主页', url: '/' },
    { icon: 'CirclePlus', title: '添加', url: '/addCommission' },
    // { icon: 'Setting', title: 'Settings', url: '/settings' }
]
const logout = () => {
    window.localStorage.removeItem('authToken');
    console.log('Logged out');
    axios.post('/api/login/logout');
    router.push('/home');
};
</script>

<template>
    <div id="main">
        <Tool></Tool>
        <SideBar :sidebarItems="sidebarItems" @sel-menuItem="changeSel"></SideBar>
        <div id="main-window">
            <div id="headBar">
                <div class="headBar-item">
                    <el-dropdown>
                        <el-avatar :size="32" class="el-dropdown-link" :src="intactPath(userState.userInfo.avatarPath)"> 

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

            </div>
            <router-view v-slot="{ Component }">
                <transition>
                    <component :is="Component" />
                </transition>
            </router-view>


        </div>

    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

:deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
}

.headBar-item {
    cursor: pointer;
    width: 32px;
    height: 32px;
    margin-right: 20px;
}



#main-content {
    flex-grow: 1;

    width: 100%;
}

#main-window {
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
    height: 50px;
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
