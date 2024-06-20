import { onMounted, reactive, ref } from "vue";

// 定义下拉框接收的数据格式
export interface SelectOption {
    value: string,
    label: string,
    disabled?: boolean,
    key?: string
}

// 定义入参格式
interface FetchSelectProps {
    apiFun: () => Promise<any>
}

export const useFetchSelect = (props: FetchSelectProps) => {
    const { apiFun } = props;
    const options = ref<SelectOption[]>([]);
    const loading = ref(false);
    /**调用接口请求数据 */
    const loadData = () => {
        loading.value = true;
        options.value = [];
        return apiFun().then((res) => {
            loading.value = false;
            options.value = res;
            return res;
        }, (err) => {
            loading.value = false;
            options.value = [{
                value: '-1',
                label: err.message,
                disabled: true
            }]
            return Promise.reject(err);
        })
    }
    onMounted(() => {
        loadData();
    })
    return { options, loading }
}