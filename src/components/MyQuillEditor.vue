<template>
    <QuillEditor :toolbar="toolBar" :modules="modules" style="background-color: white;"
     @update:content="updateContent" contentType="html"></QuillEditor>
</template>
<script setup lang="ts">
import axios from 'axios';
import BlotFormatter from 'quill-blot-formatter'
import ImageUploader from 'quill-image-uploader';
import { intactPath } from '../tool';

const emit = defineEmits(['update:content'])

const updateContent = (newContent: string) => {
    emit("update:content", newContent);
}


const toolBar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video']
]
const modules = [
    {
        name: 'blotFormatter',
        module: BlotFormatter,
        options: {/* options */ }
    },
    {
        name: 'imageUploader',
        module: ImageUploader,
        options: {
            upload: (file: File) => {
                return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append("mf", file);
                    axios.post('/api/file/uploadFile', formData)
                        .then(res => {
                            resolve(intactPath(res.data.path));
                        })
                        .catch(err => {
                            reject("Upload failed");
                            console.error("Error:", err)
                        })
                })
            }
        }
    }
]



</script>
<style scoped></style>