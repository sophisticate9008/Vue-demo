<template>
    <div class="sidebar-item" :class="{ collapsed: toggle, active: isActive }" >
        <el-tooltip v-if="toggle" class="box-item" effect="dark" :content="title" placement="right-end">
            <el-icon>
                <component :is="icon" class="el-icons" />
            </el-icon>
        </el-tooltip>
        <template v-else>
            <el-icon>
                <component :is="icon" class="el-icons" />
            </el-icon>
            <span class="title">{{ title }}</span>
        </template>
    </div>
    
</template>

<script setup lang="ts">
import { defineProps} from 'vue'

defineProps({
    icon: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    toggle: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false
    },

});

</script>

<style scoped>

.sidebar-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    transition: width 0.3s;
    cursor: pointer;
}

.sidebar-item.collapsed {
    animation: fade-out 0.3s forwards;
}

@keyframes fade-out {
    0% {
        width: 12vw;
    }

    /* 定义动画的初始状态 */
    100% {
        width: auto;
    }

    /* 定义动画的最终状态 */
}

.sidebar-item.active .el-icon,
.sidebar-item.active .title {
    color: #1890ff;
    /* Light blue color when active */
}

.sidebar-item.active {
    background-color: #EAF5FF;
}

.sidebar-item .el-icon {
    font-size: 2.5vh;
    color: #333;
    /* Default color */
    /* Adjust the icon size and color as needed */
}

.title {
    font-size: 1.8vh;
    font-weight: bold;
}

.sidebar-item span {
    margin-left: 10px;
    transition: opacity 0.3s;
    overflow: hidden;
    white-space: nowrap;
}

.sidebar-item.collapsed span {

    overflow: hidden;
    white-space: nowrap;
    animation: fade-out 0.3s forwards;
}

.sidebar-item:hover .title {
    color: #606c76;
    /* Light blue color on hover */
}

.sidebar-item:hover {
    background-color: #F4F4F5;
}
</style>
