<script setup lang="ts">
import { intactPath } from '../tool';
import { UserBody } from '../type';

defineProps<{
    item: UserBody;
    avatarStyle?: Record<string, any>;
}>()

const jumpToProfile = () => {

}
</script>
<template>
    
    <el-tooltip trigger="hover" effect="light" placement="top-start" popper-class="custom-tooltip">
        <el-avatar :src="intactPath(item?.avatarPath)" :style="avatarStyle" style="cursor: pointer;"></el-avatar>
        <template #content>
            <div class="avatar-hover-content">
                <div class="card-avatar" @click="jumpToProfile">
                    <el-avatar :src="intactPath(item?.avatarPath)" ></el-avatar>                    
                </div>
                <div class="card-info"> 
                    <div class="nickname">
                        <span style="font-weight: bold;">{{item?.name}}</span>
                    </div>
                    <div class="records">
                        <span>1回答</span> <span>0采纳</span> <span>0接收</span> <span>0拒绝</span>
                    </div>
                    <div class="signature">
                        <span >这是一个签名这是一个签名这是一个签名这是一个签名这是一个签名</span>
                    </div>
                    <div class="card-buttons">
                        <el-button icon = "Message" type="primary" size="small">
                            私信
                        </el-button>
                        <el-button icon = "Message" type="primary" size="small">
                            私信
                        </el-button> 
                    </div>
                   
                </div>

            </div>
        </template>
    </el-tooltip>
</template>
<style scoped>
.avatar-hover-content {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
    background-color: white;
    width: 20vw;
    min-height: 10vh;
    position: relative;
}
.card-avatar {
    left: 0;
    top:0;
    position: absolute;
    cursor: pointer;
}
.card-info{
    width: 14vw;
    display: flex;
    flex-direction: column;
}
.nickname *, .records *{
    margin: 5px;
}
.card-buttons {
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.card-buttons * {
    width: 50%;
}

.records {
    font-size: 1.5vh;
}
.signature{
    margin: 5px;
    color: gray;
}
</style>