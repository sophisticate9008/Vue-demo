<template>
    <div class="my-quill-container">
        <div ref="quillEditor"></div>

        <!-- 预览窗口 -->
        <el-image ref="hiddenPreview" style="width: 0; height: 0;" :preview-src-list="previewSrcList" :src="previewSrc"
         class="the-el-image" />
    </div>



</template>
<script setup lang="ts">
import { intactPath, uploadFile } from '../tool';
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { onMounted, ref, watch } from 'vue';
import DOMPurify from 'dompurify';
import type { Range } from 'quill/core/selection.js';
import ResizeModule from "@majintd/quill-image-resize";
import $ from 'jquery';

import TableUp from 'quill-table-up';
import 'quill-table-up/index.css';
Quill.register("modules/resize", ResizeModule);
Quill.register({ 'modules/tableUp': TableUp }, true);
const previewSrc = ref('');
const previewSrcList = ref<string[]>([]);
const sanitizedContent = ref('');
const props = defineProps<{
    content: string
    theme?: string
    readOnly?: boolean
}>();
watch(() => props.content, (newContent: string) => {
    sanitizedContent.value = DOMPurify.sanitize(newContent);
}, { immediate: true });

var Link = Quill.import('formats/link') as any;
class FileBlot extends Link {
    static blotName: string = 'link';  // 继承Link Blot
    static tagName: string = 'A';
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

Quill.register(FileBlot);

const Image = Quill.import('formats/image') as any;
class CustomImage extends Image {
    static blotName = 'image';
    static tagName = 'IMG';

    static create(value: any) {
        console.log(value);
        const node = super.create(value);

        if (value && value.src) {
            node.setAttribute('src', value.src);
            node.style.width = '200px'; // 设置初始宽度
            node.style.height = 'auto'; // 高度自适应
            node.classList.add('ql-image');
            node.style.cursor = 'pointer';
        }
        return node;
    }

    static formats(node: any) {
        return {
            src: node.getAttribute('src')
        };
    }

    format(name: string, value: any) {
        if (name === 'src') {
            this.domNode.setAttribute('src', value);
        } else {
            super.format(name, value);
        }
    }
}

Quill.register(CustomImage, true);


const Uploader = Quill.import('modules/uploader') as any;
class CustomUploader extends Uploader {
    upload(range: Range, files: FileList | File[]) {
        const file = files[0];
        if (file) {
            const mimeType = file.type;
            uploadFile(file).then(res => {
                const fileUrl = intactPath(res);

                if (mimeType.startsWith('image/')) {

                    // 如果是图片，插入为 image
                    this.quill.insertEmbed(range.index, 'image', { src: fileUrl });
                } else {
                    // 如果是其他文件，插入为 link
                    this.quill.insertText(range.index, file.name, {
                        link: fileUrl
                    });
                }

                this.quill.setSelection(range.index + (mimeType.startsWith('image/') ? 1 : file.name.length));
            }).catch(error => {
                console.error('File upload failed:', error);
            });
        }
    }
}

// 注册自定义的 Uploader 模块
Quill.register('modules/uploader', CustomUploader);



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
        if (file) {
            try {
                const fileUrl = await uploadFile(file);
                const range = quill?.getSelection(true);
                console.log(fileUrl);
                console.log(range);
                if (range) {
                    quill?.insertEmbed(range.index, 'link', {
                        href: intactPath(fileUrl) + '&fileName=' + file.name,
                        innerText: file.name
                    }, 'api');
                    quill?.setSelection(range.index + range.length + file.name.length + 1);
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
            theme: props.theme ? props.theme : (props.readOnly ? 'bubble' : 'snow'),
            readOnly: props.readOnly,
            modules: {
                tableUp: props.readOnly || props.theme == 'bubble'? null: {},
                resize: props.readOnly ? null : {

                },
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
                        [{ 'table': [] }],
                        [{ 'upload-file': 'Upload File' }]
                    ],
                    handlers: {
                        'upload-file': myUploadFile
                    }
                },
            }
        });

        // Load initial content
        quill.root.innerHTML = sanitizedContent.value;
        // Listen to changes and update content
        quill.on('text-change', () => {
            const content = quill?.root.innerHTML;
            updateContent(content ? content : '');
        });
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
    initEditor();
    initButton();

    $(document).on('dblclick', '.ql-image', function () {
        const src = $(this).attr('src');
        if (src) {
            previewSrc.value = src;
            previewSrcList.value = [src];

            // 通过 JavaScript 模拟点击 el-image
            setTimeout(() => {
                const elImagePreview = $('.el-image__preview')[0] as HTMLElement;
                console.log(elImagePreview);
                if (elImagePreview) {
                    $(elImagePreview).click();
                }
            }, 200);

        }
    });
});


</script>
<style scoped>
.image-preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.my-quill-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.my-quill-container .ql-container {
    flex-grow: 1;
}
.image-preview {

    max-width: 90vw;
    max-height: 90vh;
}
</style>