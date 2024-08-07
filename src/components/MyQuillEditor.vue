<template>
    <QuillEditor ref="quillEditor" :toolbar="toolBar" :modules="modules" style="background-color: white;"
     @update:content="updateContent" contentType="html"></QuillEditor>
</template>
<script setup lang="ts">
import axios from 'axios';
import BlotFormatter from 'quill-blot-formatter'
import ImageUploader from 'quill-image-uploader';
import { intactPath, uploadFile } from '../tool';
import { Quill } from '@vueup/vue-quill';
import { onMounted, ref } from 'vue';

var Link = Quill.import('formats/link');
class FileBlot extends Link {
    static blotName: string;  // 继承Link Blot
    static tagName: string;

    static create(value: any) {
        let node = undefined
        if (value && !value.href) {  // 适应原本的Link Blot
            node = super.create(value);
        }
        else {  // 自定义Link Blot
            node = super.create(value.href);
            node.setAttribute('download', true);  // 左键点击即下载
            node.innerText = value.innerText;
        }
        return node;
    }
}
FileBlot.blotName  = 'link';
FileBlot.tagName = 'A';
Quill.register(FileBlot);
const quillEditor = ref<any>(null);
const emit = defineEmits(['update:content'])
const updateContent = (newContent: string) => {
    
    emit("update:content", newContent);
}
const myUploadFile = function () {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = async () => {
        const file = input.files ? input.files[0] : null;
        const editor = quillEditor.value.getQuill();
        console.log(editor);
        if (file) {
            try {
                const fileUrl = await uploadFile(file);
                const range = editor.getSelection(true);
                console.log(fileUrl);
                console.log(range);
                if (range) {
                    editor.insertEmbed(range.index, 'link', {
                        href: intactPath(fileUrl) + '&fileName=' + file.name,
                        innerText: file.name
                    }, 'api');
                    editor.setSelection(range.index + range.length + file.name.length + 1);
                }
            } catch (error) {
                console.error('File upload failed:', error);
            }
        }
    }
}
const initButton = () => {
    const uploadFileButton = document.querySelector('.ql-upload-file');
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
        <path fill="currentColor" d="M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m320 512V448h64v128h128v64H544v128h-64V640H352v-64z"></path>
        </svg>`;
    if (uploadFileButton) {
        uploadFileButton.innerHTML = svgIcon
    }
    
}
onMounted(() => {
    initButton();
})
initButton();

const toolBar = {
    container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        [{ 'upload-file': 'Upload File' }]
    ],
    handlers: {
        'upload-file': myUploadFile
    }

}
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