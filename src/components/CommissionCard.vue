<template>
    <el-card style="max-width: 480px">
        <template #header>
            <div class="card-header">
                <span>{{ item.name }}</span>
            </div>
        </template>
        <p>{{ item.description }}</p>
        <template #footer>
            {{ convertBeijingTime(item.beginTime) }} - {{ convertBeijingTime(item.endTime) }}
        </template>

    </el-card>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue'
import { convertBeijingTime } from "../tool"
import { CommissionBody } from "../type"
defineProps({
    item: {
        type: Object as PropType<CommissionBody>,
        required: true
    }
})
</script>

<style scoped></style>