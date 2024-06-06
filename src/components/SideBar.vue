<template>
    <div class="sidebar" :class= "{collapsed: isCollapsed}">
        <SidebarItem v-for="(item, index) in sidebarItems" :key="index" :icon="item.icon" :title="item.title"
         :toggle="isCollapsed" :is-active="activeIndex == index" @item-clicked="selSidebarItem(index)" />
        <button @click="toggleSidebar">T</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SidebarItem from './SidebarItem.vue'; // 使用正确的大小写

// 定义侧边栏项
const sidebarItems = [
    { icon: 'Plus', title: 'Home' },
    { icon: 'UserFilled', title: 'Profile' },
    { icon: 'Setting', title: 'Settings' }
]

// 控制侧边栏的折叠状态
const isCollapsed = ref(false)

// 当前选中项的索引
const activeIndex = ref(-1)

// 切换侧边栏折叠状态
const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
}

// 切换侧边栏项选中状态
const selSidebarItem = (index) => {
    if (activeIndex.value !== index) {
        activeIndex.value = index
    } else {
        activeIndex.value = -1
    }
}
</script>

<style scoped>
.sidebar {
    
    height: 100%;
    width: 200px;
    padding-left: 3px;
    padding-right: 3px;
    border-right: 1px solid #EDEDED; /* 添加右边界线 */
    animation: fade-in 0.3s forwards;
}

.sidebar.collapsed {
    animation: fade-out 0.3s forwards;
}
@keyframes fade-out {
    0% { width: 200px; } /* 定义动画的初始状态 */
    100% { width: 45px; } /* 定义动画的最终状态 */
}
@keyframes fade-in {
    0% { width: 45px; } /* 定义动画的初始状态 */
    100% { width: 200px; } /* 定义动画的最终状态 */
}
button {
    margin-top: 10px;
}
</style>
