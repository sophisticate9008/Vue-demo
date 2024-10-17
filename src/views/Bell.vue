<script setup lang="ts">
import { ref } from 'vue';
import { BellBody } from '../type';
import axios from 'axios';
import { convertBeijingTime } from '../tool';
const bells = ref<BellBody[]>([]);

const getBells = async () => {
    const res = await axios.get('api/bell/getAll');
    bells.value = res.data.data;
    console.log(bells.value);
}

getBells();
</script>

<template>
    <div class="bell-container">
        <el-table :data="bells" stripe style="width: 80%;">
            <el-table-column label="Date" width="180">
                <template v-slot="scope">
                    <span>{{ convertBeijingTime(scope.row.createdAt) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userId" label="User ID" width="180" />
            <el-table-column prop="content" label="Content" />
        </el-table>
    </div>
</template>
<style scoped>
.bell-container {
    display: flex;
    justify-content: center;
    margin: 15px;
}
</style>