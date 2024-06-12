<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import { createUserState } from './provide/store.ts';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
const selUrl = ref('/LoginRegister');
const router = useRouter();
createUserState();
const changeSel = (url: string) => {
    router.push(url);
    console.log(url);
    if (selUrl.value !== url) {
        selUrl.value = url;
    }
};
const sidebarItems = [
    { icon: 'HomeFilled', title: '主页', url: '/home' },
    { icon: 'CirclePlus', title: '添加', url: '/addCommission' },
    // { icon: 'Setting', title: 'Settings', url: '/settings' }
]
const logout = () => {
    window.localStorage.removeItem('authToken');
    console.log('Logged out');
    axios.post('/api/login/logout');
};
</script>

<template>
    <div id="main">

        <SideBar :sidebarItems="sidebarItems" @sel-menuItem="changeSel"></SideBar>

        <div id="main-window">
            <div id="headBar">
                <div class="headBar-item">

                    <el-dropdown>
                        <el-avatar :size="32" class="el-dropdown-link">

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
