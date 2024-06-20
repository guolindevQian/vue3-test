import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
const loadingInstance = ElLoading.service;
let requestCount = 0;
const showLoading = () => {
    requestCount++;
    if (requestCount === 1) loadingInstance();
}
const closeLoading = () => {
    requestCount--;
    if (requestCount === 0) loadingInstance().close();
}
const _axios: AxiosInstance = axios.create({
    method: "GET",
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    timeout: 10000
})
//请求拦截


declare module "axios" {
    interface InternalAxiosRequestConfig<D = any, T = any> {
        loading?: boolean;
        isToken?: boolean;
    }
}
declare module "axios" {
    interface AxiosRequestConfig<D = any> {
        loading?: boolean;
        isToken?: boolean;
    }
}

const requestMap = new Map()
_axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        const controller = new AbortController();
        const key = config.data + config.url;
        config.signal = controller.signal;
        if (requestMap.has(key)) {
            requestMap.get(key).abort();
            requestMap.delete(key);
        } else {
            requestMap.set(key, controller);
        }
        const { loading = true, isToken = true } = config;
        if (loading) showLoading();
        if (sessionStorage.getItem("token") && !isToken) {
            config.headers["Authorization"] =
                "Bearer " + sessionStorage.getItem("token"); // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config;
    },
    (error) => {
        console.log(error)
    }
)

_axios.interceptors.response.use(
    (res: AxiosResponse<any, any>) => {
        const { data, config } = res;
        const { loading = true } = config;
        if (loading) closeLoading();
        console.log(data)
        if (data.code != 200) {
            ElMessage({
                message: data.message,
                type: 'error'
            });
            if (data.code === 401) {
                //登录状态已过期.处理路由重定向
                console.log("loginOut");
            }
            throw new Error(data.message);
        }
        return data;
    },
    (error) => {
        closeLoading()
        let { message } = error
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: "error",
        });
        return Promise.reject(error);
    }
)

export default _axios