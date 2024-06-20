<template>
    <div class="login">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" style="max-width: 460px">
            <el-form-item label="账号">
                <el-input v-model="formLabelAlign.name" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="formLabelAlign.password" />
            </el-form-item>
            <el-form-item label="验证码">
                <div style="display:flex">
                    <el-input v-model="formLabelAlign.code" />
                    <img @click="resetCode" :src="codeUrl" alt="">
                </div>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit">登录</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="toDown">下载</el-button>
    </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { onMounted, reactive, ref, Ref } from 'vue';
import { getImage } from '@/http/api'

const codeUrl = ref<string>('/api/v1/user/code')

const resetCode = () => codeUrl.value = codeUrl.value + '?' + Math.random()

const labelPosition: Ref<'left' | 'right' | 'top'> = ref('right')

const formLabelAlign = reactive({
    name: "",
    password: "",
    code: ""
})

const submit = async () => {
    await fetch('/api/v1/user/create', {
        method: "POST",
        body: JSON.stringify(formLabelAlign),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => {
        res.json()
    })
}
// const loginManage = async () => {
//     const data = await login({
//         username: '鸡哥哥',
//         password: '1234',
//     });
//     console.log(data);
// };
const toDown = async () => {
    const res = await fetch('/api/upload/stream').then(res => res.arrayBuffer())
    console.log(res)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([res], {
        type: 'image/png'
    }))
    a.download = 'qian.zip'
    a.click()
}

</script>
<style lang="less" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
}
</style>