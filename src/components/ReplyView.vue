<script setup lang="ts">

import { ReplyBody } from '../type';
import MyQuillEditor from './MyQuillEditor.vue';


defineProps<{
    item: ReplyBody
    isOwner: boolean
}>();

</script>

<template>
    <div class="view-container">
        <MyQuillEditor v-if="isOwner" :content="item.content" theme="bubble" :readOnly="true"></MyQuillEditor>
        <MyQuillEditor @update:content="item.content = $event" :content="item.content" v-else></MyQuillEditor>
    </div>
</template>
<style scoped></style>