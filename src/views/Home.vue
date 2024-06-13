<template>
    <div class="card-container">
        <CommissionCard v-for="item in data.list" :item="item">
        </CommissionCard>
    </div>

</template>
<script setup lang="ts">
import CommissionCard from '../components/CommissionCard.vue';
import axios from 'axios';
import { reactive } from 'vue';
import { CommissionBody } from '../type';
const args = reactive({
    page: 0,
    limit: 10,

});

const data = reactive({
    total: 0,
    list: [] as CommissionBody[],
});
const getCommissionList = async () => {
    axios.post("/api/commission/list", args)
        .then(res => {
            data.list = res.data.data;
            data.total = res.data.data.count;
        })
}
getCommissionList();
</script>
<style scoped>
.card-container {
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
    /* 自动填充，每列最小宽度30% */
    gap: 20px;
    /* 卡片间距 */
}
</style>