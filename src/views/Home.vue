<template>
    <div class="home">
        <el-scrollbar height="580px">
            <div class="card-container">
                <div class="card" v-for="item in data.list" @click="jumpDetail(item)">
                    <CommissionCard :item="item">
                    </CommissionCard>
                </div>
            </div>
        </el-scrollbar>
        <div class="pagintion">
            <el-pagination :page-sizes="[12, 24, 36, 48]" v-model:page-size="args.limit"
             layout="total, sizes, prev, pager, next, jumper" :total="data.total" @current-change="handleCurrentChange"
             @size-change="handleSizeChange" />
        </div>

    </div>

</template>
<script setup lang="ts">
import CommissionCard from '../components/CommissionCard.vue';
import axios from 'axios';
import { reactive } from 'vue';
import { CommissionBody } from '../type';
import { useRouter } from 'vue-router';

const router = useRouter();
const args = reactive({
    page: 1,
    limit: 12,
});
const handleSizeChange = (val: number) => {
    console.log(`每页 ${val} 条`);
    getCommissionList();
}
const handleCurrentChange = (val: number) => {
    args.page = val;
    getCommissionList();
}



const data = reactive({
    total: 0,
    list: [] as CommissionBody[],
});
const getCommissionList = async () => {
    axios.post("/api/commission/list", args)
        .then(res => {
            data.list = res.data.data;
            data.total = res.data.count;
        })
}
const jumpDetail = (item: CommissionBody) => {
    router.push("/commissionDetail/" + item.id)
}
getCommissionList();
</script>
<style scoped>
.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
    /* 自动填充，每列最小宽度30% */
    gap: 12px;
    /* 卡片间距 */
}



.home {
    padding: 15px;
}

.card {
    cursor: pointer;
}
</style>