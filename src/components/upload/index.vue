<template>
    <div class="upload">
        <input type="file" id="file" :multiple="multiple" :accept="accept" @change="handleChange">
        <button class="upload-btn" v-if="!drag" @click="choose">点击上传</button>
        <div v-else class="drag-box" @dragover="handleDragOver" @dragleave="handleDragLeave" @drag="handleDrop"
            @click="choose" :class="{ 'dragging': isDragging }">将文件拖到此处，或<span>点击上传</span></div>
        <template v-if="showFileList">
            <template v-if="listType === 'text'">
                <div class="file-item" v-for="(file, index) in fileList" :key="index" @click="preview(file)">
                    <img :src="file.url" alt="">
                    <span>{{ file.name }}</span>
                    <span class="remove" @click.stop="remove(file, index)">×</span>
                </div>
            </template>
        </template>
    </div>
</template>
<script setup lang="ts">
import { ref, toRaw, onMounted } from 'vue'
import property from './props'
const props = defineProps(property)
const emit = defineEmits()
const fileList = ref<any[]>([])
const isDragging = ref<Boolean>(false)
// 触发选择文件
const choose = () => {
    let file: HTMLInputElement | null = document.querySelector('#file')
    file!.click()
}
//拖放到目标区域
const handleDragOver = (event: any) => {
    event.preventDefault()
    isDragging.value = true
}

const handleDragLeave = () => {
    isDragging.value = false
}
let files: any[] = [];
// 拖拽放置
const handleDrop = (event: any) => {
    files = Array.from(event.target.files)
    console.log(files)
    handleBeforeUpload(files)
}
// input选择文件回调
const handleChange = (event: any) => {
    files = Array.from(event.target.files)
    console.log(files)
    handleBeforeUpload(files)
}
const handleBeforeUpload = (files: any) => {
    if (files.length > props.limit - fileList.value.length) {
        console.error(`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.value.length} 个文件`)
        emit('on-exceed', files, toRaw(fileList.value))
        return
    }
    files.forEach(async (file: any) => {
        emit('on-change', file, files)
        if (!props.beforeUpload()) {
            return
        }
        if (props.autoUpload) {
            uploadRequest(file, files)
        }
    })
}
// 手动上传已选择的文件
const submit = () => {
    files.forEach(async file => {
        uploadRequest(file, files)
    })
}
let xhrs = []
type fileObjType = {
    name: string,
    percentage: number,
    raw: any,
    response: any,
    status: string,
    size: number,
    uid: string,
    url:string
}
const uploadRequest = async (file: any, files: any) => {
    let xhr = new XMLHttpRequest();
    // 调用open函数，指定请求类型与url地址。请求类型必须为POST
    xhr.open('POST', props.action);
    // 设置自定义请求头
    Object.keys(props.headers).forEach(k => {
        xhr.setRequestHeader(k, props.headers[k])
    })
    // 额外参数
    const formData = new FormData()
    formData.append('file', file);
    Object.keys(props.data).forEach(k => {
        formData.append(k, props.data[k]);
    })
    // 携带cookie
    xhr.withCredentials = props.withCredentials
    xhr.upload.onprogress = (e) => {
        emit('on-progress', e, file, files)
    }
    // 监听状态
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const res = JSON.parse(xhr.response)
            const fileObj: fileObjType = {
                name: file.name,
                percentage: 100,
                raw: file,
                response: res,
                status: 'success',
                size: file.size,
                uid: file.uid,
                url:res.data.imageUrl
            }
            console.log(fileObj)
            fileList.value.push(fileObj)
            if (xhr.status === 200 || xhr.status === 201) {
                emit('on-success', res, fileObj, toRaw(fileList.value))
            } else {
                emit('on-error', res, fileObj, toRaw(fileList.value))
            }
        }
    }
    // 发起请求
    xhr.send(formData);
    xhrs.push({
        xhr,
        file
    })
}
const preview = (file: any) => {
    emit('on-preview', file)
}

const remove = (file: any, index: any) => {
    if (!props.beforeRemove()) {
        return
    }
    fileList.value.splice(index, 1)
    emit('on-remove', file, fileList.value)
}

// 取消上传
const abort = (file: any) => {
    console.log(file)
    // 通过file对象找到对应的xhr对象，然后调用abort
    // xhr.abort()
}

defineExpose({
    abort,
    submit
})



</script>
<style lang="less" scoped>
#file {
    display: none;
}

.upload-btn {
    border: none;
    background-color: #07c160;
    color: #fff;
    padding: 6px 10px;
    cursor: pointer;
}

.drag-box {
    width: 240px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    border: 1px dashed #ddd;
    cursor: pointer;
    border-radius: 8px;
}

.drag-box:hover {
    border-color: cornflowerblue;
}

.drag-box.dragging {
    background-color: rgb(131, 161, 216, .2);
    border-color: cornflowerblue;
}

.drag-box span {
    color: cornflowerblue;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding: 0 8px;
    border-radius: 4px;
    cursor: pointer;
}

.file-item:hover {
    background-color: #f5f5f5;
    color: cornflowerblue;
}

.file-item .remove {
    font-size: 20px;
}
</style>