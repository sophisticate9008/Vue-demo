<script setup lang="ts">
import SideBar from './components/SideBar.vue';
import { ref } from 'vue';
const selUrl = ref('');
const changeSel = (url: string) => {
    console.log(url);
    if(selUrl.value !== url) {
        selUrl.value = url;
    }
    
};
</script>

<template>
    <div id="main">
        <SideBar @sel-menuItem = "changeSel"></SideBar>
    </div>
</template>

<style scoped>


#main {
    height: 100%;
}
</style>
