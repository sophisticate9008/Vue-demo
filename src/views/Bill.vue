<script setup lang="ts">
import { ref } from 'vue';
import { BillBody } from '../type';
import axios from 'axios';
import { convertBeijingTime } from '../tool';
const bills = ref<BillBody[]>([]);

const getBills = async () => {
    const res = await axios.get('api/bill/getAll');
    bills.value = res.data.data;
    console.log(bills.value);
}

getBills();
</script>

<template>
    <div class="bill-container">
        <el-table :data="bills" stripe style="width: 80%;">
            <el-table-column label="Date" width="180">
                <template v-slot="scope">
                    <span>{{ convertBeijingTime(scope.row.createdAt)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userId" label="User ID" width="180" />
            <el-table-column prop="gold" label="Gold" />
            <el-table-column prop="content" label="Content" />
        </el-table>
    </div>
</template>
<style scoped>
.bill-container {
    display: flex;
    justify-content: center;
    margin: 15px;
}
</style>