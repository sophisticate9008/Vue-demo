<script setup lang="ts">

import { ReplyBody } from '../type';
import MyQuillEditor from './MyQuillEditor.vue';
import QuillView from './QuillView.vue';

defineProps<{
    item: ReplyBody
    isOwner: boolean
}>();

</script>

<template>
    <div class="view-container">
        <QuillView v-if="isOwner" :content-saved="item.content"></QuillView>
        <MyQuillEditor @update:content="item.content = $event" :content="item.content" v-else></MyQuillEditor>
    </div>
</template>
<style scoped></style>