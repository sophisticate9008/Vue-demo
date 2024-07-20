<template>
    <el-card style="max-width: 40vw">
        <template #header>
            <div class="card-header">
                <span>id:{{ item.id }}</span>
                <span> 名称:{{ item.name }} 金额:{{ item.money }}</span>
                
                <span class="rate">({{ item.currentNum }}/{{ item.num }})</span>
            </div>
        </template>
        <div class="card-body">
            <p>{{ item.description }}</p>
        </div>

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

<style scoped>
::v-deep .el-card__footer {
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 10px;
}

::v-deep .el-card__header {
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 10px;
}

.card-header {
    position: relative;
}

.rate {
    position: absolute;
    right: 10px;
}

.card-body {
    height: 8vh;
    font-size: 13px;
}
</style>