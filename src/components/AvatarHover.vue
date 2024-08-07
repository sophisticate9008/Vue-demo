<script setup lang="ts">
    defineProps<{
        src: string
    }>()
</script>
<template>
    <div>
        <el-avatar :src="src"></el-avatar>
    </div>
</template>
<style scoped>

</style>