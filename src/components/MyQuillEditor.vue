<template>
    <div ref="quillEditor" style="background-color: white;"
     @update:content="updateContent" contentType="html" :content="sanitizedContent" :readOnly="view"
     :theme="view ? 'bubble' : 'snow'"></div>
</template>
<script setup lang="ts">
import axios from 'axios';
import { intactPath, uploadFile } from '../tool';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { onMounted, ref, watch } from 'vue';
import DOMPurify from 'dompurify';
const sanitizedContent = ref('');
const props = defineProps<{
    content: string
    view?: boolean
}>();
watch(() => props.content, (newContent: string) => {
    sanitizedContent.value = DOMPurify.sanitize(newContent);
}, { immediate: true });


// var Link = Quill.import('formats/link');
// class FileBlot extends Link {
//     static blotName: string = 'link';  // 继承Link Blot
//     static tagName: string = 'A';
//     static create(value: any) {
//         let node = undefined
//         if (value && !value.href) {  // 适应原本的Link Blot
//             node = super.create(value);
//         }
//         else {  // 自定义Link Blot
//             node = super.create(value.href);
//             node.setAttribute('download', true);  // 左键点击即下载
//             node.innerText = value.innerText;
//         }
//         return node;
//     }
// }

// Quill.register(FileBlot);

// 注册自定义 Blot


const quillEditor = ref<any>(null);
let quill: Quill | null = null;

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
const initEditor = () => {
    if (quillEditor.value) {
        quill = new Quill(quillEditor.value, {
            theme: props.view ? 'bubble' : 'snow',
            modules: {
                toolbar: {
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
                },
                imageUploader: {
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
                                    console.error("Error:", err);
                                });
                        });
                    }
                }
            }
        });

        // Load initial content
        quill.root.innerHTML = sanitizedContent.value;
        // Listen to changes and update content
        quill.on('text-change', () => {
            const content = quill?.root.innerHTML;
            updateContent(content?content:'');
        });
    }
}
onMounted(() => {
    initEditor();
});

</script>
<style scoped></style>