<template>
    <div class="cropper-container">
        <label for="fileInput" class="file-label">
            <span class="plus-sign" v-if="!croppedImageUrl">+</span>
            <img :src="croppedImageUrl" v-else>
            
            <el-button v-if="croppedImageUrl" type="primary" @click="cropImage" class="full-width-button">完成</el-button>
        </label>
        <input id="fileInput" type="file" ref="fileInput" @change="onFileChange" style="display: none;">
        <div v-if="imageUrl" class="image-container">
            <vue-cropper ref="cropper" :src="imageUrl" aspect-ratio="1" :view-mode="1" class="cropper" @crop="updatePreview" />
            
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';
import 'cropperjs/dist/cropper.css';
import VueCropper from 'vue-cropperjs';

const imageUrl = ref<string | null>(null);
const cropper = ref<any>(null);
const file = ref<File | null>(null);
const croppedImageUrl = ref<string | null>(null);
const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files ? target.files[0] : null;
    if (selectedFile) {
        file.value = selectedFile;
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl.value = e.target?.result as string;
            nextTick(() => {
                cropper.value.replace(imageUrl.value);
            });
        };
        reader.readAsDataURL(selectedFile);
    }
};
const emit = defineEmits(["crop-complete"]);
const cropImage = async () => {
    if (!cropper.value) return;
    const canvas = cropper.value.getCroppedCanvas();
    canvas.toBlob(async (blob: any) => {
        const croppedFile = new File([blob], file.value?.name ?? 'cropped-image', { type: file.value?.type });
        emit('crop-complete', croppedFile);
    });
};
const updatePreview = () => {
  if (!cropper.value) return;
  croppedImageUrl.value = cropper.value.getCroppedCanvas()?.toDataURL();
};
</script>

<style scoped>
.cropper-container {
    display: flex;
    flex-direction: row;
    align-items: center;


}
.full-width-button {
    margin-top: 20px; 
    width: 100%;
}
.file-label {
    cursor: pointer;
    padding: 10px;
    background-color: #c9c9c976;
    color: white;
    border-radius: 4px;
    display: inline-block;
    position: relative;
    height: 200px;
    width: 200px;
}

.plus-sign {
    
    font-size: 100px;
    line-height: 200px;
    display: block;
    text-align: center;
}

.image-container {
    margin-top: 20px;
}

.cropper {
    max-width: 100%;
    height: 400px;
}
</style>
