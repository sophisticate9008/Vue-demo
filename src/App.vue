<script setup lang="ts">
import SideBar from './components/SideBar.vue';

import { useRouter } from 'vue-router';
import { ref } from 'vue';
const selUrl = ref('/LoginRegister');
const router = useRouter();

const changeSel = (url: string) => {
    router.push(url);
    console.log(url);
    if (selUrl.value !== url) {
        selUrl.value = url;
    }
};
const sidebarItems = [
    { icon: 'HomeFilled', title: 'Home', url: '/loginRegister' },
    { icon: 'UserFilled', title: 'Profile', url: '/profile' },
    { icon: 'Setting', title: 'Settings', url: '/settings' }
]
</script>

<template>
    <div id="main">
        <router-link :to="selUrl"></router-link>
        <SideBar :sidebarItems="sidebarItems" @sel-menuItem="changeSel"></SideBar>
        <router-view v-slot="{ Component }">
            <transition>
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<style scoped>
#main {
    display: flex;
    flex-direction: row;
    height: 100%;
}
</style>
