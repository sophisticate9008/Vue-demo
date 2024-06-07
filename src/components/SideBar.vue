<template>
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
        <div class="logo">
            <img :src="logo" alt="logo" width="36px" height="36px" />
            <span v-if="!isCollapsed">{{ title }}</span>
        </div>
        <SidebarItem v-for="(item, index) in sidebarItems" :key="index" :icon="item.icon" :title="item.title"
         :toggle="isCollapsed" :is-active="activeIndex == index" :selUrl="item.url"
         @click="selSidebarItem(index, item.url)" />
         <div class="switch">
            <SidebarItem icon="SwitchFilled" title="Sidebar":is-active="false" :toggle="isCollapsed" @click="toggleSidebar"/>            
         </div>
    </div>
</template>

<script setup>
import { ref, defineEmits,defineProps } from 'vue'
import SidebarItem from './SidebarItem.vue'; // 使用正确的大小写
const props = defineProps({
    logo : {
        type: String,
        default: "/vite.svg"
    },
    title : {
        type: String,
        default: "Vue3-demo"
    },

})
// 定义侧边栏项
const sidebarItems = [
    { icon: 'HomeFilled', title: 'Home', url: '/' },
    { icon: 'UserFilled', title: 'Profile', url: '/profile' },
    { icon: 'Setting', title: 'Settings', url: '/settings' }
]

// 控制侧边栏的折叠状态
const isCollapsed = ref(false)

// 当前选中项的索引
const activeIndex = ref(-1)
//当前选中的菜单项的url
const selUrl = ref('')
// 切换侧边栏折叠状态
const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
}

const emit = defineEmits(["sel-menuItem"])

// 切换侧边栏项选中状态
const selSidebarItem = (index, url) => {
    selUrl.value = url
    emit("sel-menuItem", url)
    if (activeIndex.value !== index) {
        activeIndex.value = index
    } else {
        activeIndex.value = -1
    }
}
</script>

<style scoped>
.logo {
    padding-left: 3px;
    padding-right: 3px;
    width: 40px;
    height: 80px;
    display: flex;
    align-items: center;
}
.logo span {
    font-weight: bold;
    padding-left: 10px;
    font-size: 18px;
    text-wrap: nowrap;
}
.switch{
    width: 200px;
    position: absolute;
    bottom: 0;
}
.sidebar {
    position: relative;
    height: 100%;
    width: 200px;
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
        width: 200px;
    }

    /* 定义动画的初始状态 */
    100% {
        width: 45px;
    }

    /* 定义动画的最终状态 */
}

@keyframes fade-in {
    0% {
        width: 45px;
    }

    /* 定义动画的初始状态 */
    100% {
        width: 200px;
    }

    /* 定义动画的最终状态 */
}

button {
    margin-top: 10px;
}
</style>
