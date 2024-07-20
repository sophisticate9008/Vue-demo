<template>
    <div class="head" :style="headStyle">
        <span v-for="menuItem in menuItems" :key="menuItem.panel" @click="setActivePanel(menuItem.panel), emit('selHeadMenu', menuItem.panel)"
         @mouseover="handleMouseOver" @mouseout="handleMouseout" :id="menuItem.panel"
         :class="{ 'active-panel': (activePanel.panel === menuItem.panel && activePanel.panel ) }"
         :style="itemStyle">
            {{ menuItem.name }} 
        </span>
        <div class="moving-border" :style="{ width: activePanel.width, left: activePanel.left }"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import $ from 'jquery';

const activePanel = ref({
    panel: '',
    left: '0px',
    width: '0px'
});

const activePanelBackup = ref({
    panel: '',
    left: '0px',
    width: '0px'
});

const emit = defineEmits(["selHeadMenu"]);

const props = withDefaults(defineProps<{
    menuItems: {
        name: string;
        panel: string;
    }[],
    headStyle: string;
    itemStyle: string;
}>(), {
    headStyle: '',
    itemStyle: ''
});

const handleMouseOver = (event: MouseEvent) => {
    const $element = $(event.currentTarget as HTMLElement);
    const pos = $element.position();
    const totalWidth = $element.outerWidth(true);
    const width = $element.width();
    const leftPos = pos.left + ((totalWidth as number) - (width as number)) / 2 + 'px';
    activePanel.value.panel = $element.attr('id') as string;
    console.log($element.attr('id'))
    activePanel.value.left = leftPos;
    activePanel.value.width = width + 'px';
};

const handleMouseout = (event: MouseEvent) => {
    const $element = $(event.currentTarget as HTMLElement);

    if (activePanelBackup.value.panel !== $element.attr('id')) {
        activePanel.value = { ...activePanelBackup.value };
    }
};

const setActivePanel = (panel: string) => {

    
    activePanel.value.panel = panel;
    const $element = $('#' + panel);
    const pos = $element.position();
    const totalWidth = $element.outerWidth(true);
    const width = $element.width();
    const leftPos = pos.left + ((totalWidth as number) - (width as number)) / 2 + 'px';
    activePanel.value.left = leftPos;
    activePanel.value.width = width + 'px';
    activePanelBackup.value = { ...activePanel.value };
};

onMounted(() => {
    // 默认选中第一个菜单项
    setActivePanel(props.menuItems[0].panel);
});
</script>

<style scoped>
.moving-border {
    position: absolute;
    bottom: 0;
    height: 3px;
    background-color: #00A1D6;
    transition: left 0.3s, width 0.3s;
}

.head {
    position: relative;
    font-weight: bold;
    display: flex;
    align-items: center;
    border-radius: 3px;
}

.head span {
    cursor: pointer;
}

.active-panel {
    color: #00A1D6;
}
</style>