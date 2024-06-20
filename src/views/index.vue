<template>
    <div class="index btn">
        <img src="../assets/vue.svg" id="img" alt="">
        {{ Test.current }}
        <button class="m-l-10" @click="onAdd">+1</button>
        <router-link :to="{ path: '/login' }">{{ title }}</router-link>
        <input type="text" v-focus>
        <el-button type="primary">11</el-button>
        <div class="box" v-move>
            <div class="header"></div>
        </div>
        <SvgIcon name="test" color="red" size="80px" />
        <el-icon size="40" color="red">
            <Edit />
        </el-icon>
    </div>
    <div>
        <upload ref="uploadRef" action="http://localhost:3000/upload/album" show-file-list drag auto-upload
            upload-folder :headers="headers" :data="data" :limit="3" :before-upload="beforeUpload"
            :before-remove="beforeRemove" @on-change="handleChange" @on-success="handleSuccess" @on-error="handleError"
            @on-preview="handlePreview" @on-remove="handleRemove" @on-exceed="handleExceed" @on-progress="handleProgress">
        </upload>
    </div>
    <!-- <div>
        <div ref="div" @click="changeMyname">我的ref</div>
        <hr>
        <div>{{ myname }}</div>
    </div> -->
    <!-- <div>
        <Map />
        
    </div> -->
</template>
<script setup lang="ts">

import { ref, getCurrentInstance,customRef } from 'vue';
import { useTestStore } from '../store'
import useBase64 from '../hooks/base64'
import { toolDirective } from '../hooks/index'
import Map from "@/components/Map.vue";
import { useFetchSelect } from '../hooks/select'
import upload from '@/components/upload/index.vue'
import { tr } from 'element-plus/es/locale';
// import { login } from '@/http/api';

const { vFocus, vMove } = toolDirective()
useBase64({ el: '#img' }).then(res => {
    console.log(res.Baseurl)
})
const getData = () => {
    return new Promise<any[]>((resolve, reject) => {
        setTimeout(() => {
            // 模拟接口调用有概率出错
            if (Math.random() > 0.5) {
                resolve([
                    {
                        key: 1,
                        name: '苹果',
                        value: 1,
                    },
                    {
                        key: 2,
                        name: '香蕉',
                        value: 2,
                    },
                    {
                        key: 3,
                        name: '橘子',
                        value: 3,
                    },
                ]);
            } else {
                reject(new Error('不小心出错了！'));
            }
        }, 3000)
    })
}
const { options, loading } = useFetchSelect({
    apiFun: getData
})
const app = getCurrentInstance()
// console.log(app?.proxy?.$filters.format('js'))
// const loginManage = async () => {
//     const data = await login({
//         username: '鸡哥哥',
//         password: '1234',
//     });
//     console.log(data);
// };
// loginManage();
const title = ref<string>('123')
const Test = useTestStore()
console.log(Test.current)
console.log(Test.name)

const onAdd = () => {
    Test.setCurrent()
    Test.setName('张三')
}
const uploadRef = ref(null)
const data = {
    name: '张三',
    age: 20
}
const headers = {
    a: 111
}
const handleChange = (file: any, fileList: any[]) => {
    console.log('onChange', file, fileList)
}
const handleSuccess = (res: any, file: any, fileList: any[]) => {
    console.log(res, file, fileList)
}
const handleError = (err: any, file: any, fileList: any[]) => {
    console.log(err, file, fileList)
}
const handlePreview = (file: any) => {
    console.log('handlePreview', file)
}
const handleRemove = (file: any, fileList: any[]) => {
    console.log('handleRemove', file, fileList)
}
const handleExceed = (files: any, fileList: any[]) => {
    console.log('文件个数超限', files, fileList)
}
const handleProgress = (e: any, file: any, fileList: any[]) => {
    console.log('上传进度', file, fileList);
    if (e.lengthComputable) {
        const percentComplete = Math.ceil((e.loaded / e.total) * 100)
        console.log('[ percentComplete ] >', percentComplete)
    }
}
const beforeUpload = (file: any) => {
    console.log(file)
    return true
}
const beforeRemove = (file: any, fileList: any[]) => {
    console.log(file, fileList)
    return true
}
// customRef的使用，类似工厂函数,可以进行防抖等操作
// function myRef<T=any>(value:T){
//     let timer:any;
//     return customRef((track,trigger)=>{
//         return{
//             get(){
//                 track();
//                 return value;
//             },
//             set(newValue){
//                 clearTimeout(timer);
//                 timer = setTimeout(()=>{
//                     console.log('触发了set')
//                     value = `${newValue}23` as T;
//                     trigger();
//                 },500)
//             }
//         }
//     })
// }
// const myname = myRef<string>('张三');

// const changeMyname = ()=>{
//     myname.value = '李四'
// }
</script>
<style lang="less" scoped>
.box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border: 1px solid @thume_color;
    background-color: pink;

    .header {
        background-color: @thume_color;
        height: 20px;
    }
}
</style>
