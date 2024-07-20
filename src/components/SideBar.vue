<template>
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
        <div class="logo">
            <img :src="logo" alt="logo" width="36vw" height="36vh" />
            <span v-if="!isCollapsed">{{ title }}</span>
        </div>
        <SidebarItem v-for="(item, index) in sidebarItems" :key="index" :icon="item.icon" :title="item.title"
         :toggle="isCollapsed" :is-active="rootPath == item.url" @click="selSidebarItem(index, item.url)" />
        <div class="switch">
            <SidebarItem icon="SwitchFilled" title="Sidebar" :is-active="false" :toggle="isCollapsed"
             @click="toggleSidebar" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from 'vue'
import SidebarItem from './SidebarItem.vue'; // 使用正确的大小写
import { SideBarItemBody } from '../type';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const rootPath = ref("/")
rootPath.value = route.path;

console.log(rootPath.value);
defineProps({
    logo: {
        type: String,
        default: "/vite.svg"
    },
    title: {
        type: String,
        default: "Vue3-demo"
    },
    sidebarItems: {
        type: Array<SideBarItemBody>,
        default: () => []
    }

})
// 定义侧边栏项


// 控制侧边栏的折叠状态
const isCollapsed = ref(false)


// 切换侧边栏折叠状态
const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
}

const emit = defineEmits(["sel-menuItem"])

// 切换侧边栏项选中状态
const selSidebarItem = (index: any, url: any) => {

    router.push(url)
    rootPath.value = route.path;
    console.log(rootPath.value);
    console.log(url);


}
watch(route, () => { rootPath.value = route.path;});
</script>

<style scoped>
.logo {
    padding-left: 3px;
    padding-right: 3px;
    width: 2vw;
    height: 8vh;
    display: flex;
    align-items: center;
}

.logo span {
    font-weight: bold;
    padding-left: 10px;
    font-size:2.5vh;
    text-wrap: nowrap;
}

.switch {
    width: 95%;
    position: absolute;
    bottom: 0;
}

.sidebar {
    position: relative;
    height: 100%;

    padding-left: 3px;
    padding-right: 3px;
    border-right: 1px solid #EDEDED;
    /* 添加右边界线 */
    animation: fade-in 0.3s forwards;
}

.sidebar.collapsed {
    animation: fade-out 0.3s forwards;
}

@keyframes fade-out {
    0% {
        width: 12vw;
    }

    /* 定义动画的初始状态 */
    100% {
        width: 45px;
    }

    /* 定义动画的最终状态 */
}

@keyframes fade-in {
    0% {
        width: 100px;
    }

    /* 定义动画的初始状态 */
    100% {
        width: 12vw;
    }

    /* 定义动画的最终状态 */
}

button {
    margin-top: 10px;
}
</style>
