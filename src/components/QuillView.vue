<script lang="ts" setup>
defineProps({
    contentSaved: String
})
</script>
<template>
    <QuillEditor theme="bubble" :readOnly="true" :content="contentSaved" contentType="html"></QuillEditor>
</template>
<style  scoped>

</style>