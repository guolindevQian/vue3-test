import { reactive, computed, toRefs, onBeforeMount } from "vue";
/**
 * @description table 页面表格操作方法封装
 * @param {Function} request 请求方法 这里我使用的自己基于axios封装的类似await-to-js库
 * @param {Object} initParam 获取数据初始化参数(非必传，默认为{})
 * @param {Boolean} isPageAble 是否有分页(非必传，默认为true)
 * @param {Boolean} immediate 是否立即触发 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法(非必传)
 * @param {Number} minPageShowCount 最小显示页码选择器条数
 * */
export function useTable({ request, initParam, isPageAble = true, immediate = true, dataCallBack, minPageShowCount = 10 }) {
    //初始页面
    const INITIAL_PAGE_PARAMS = {
        // 当前页数
        current: 1,
        // 每页显示数量
        size: 10,
        // 总条数
        total: 0
    }
    type currentType = {
        [k: string]: any
    }
    const state = reactive({
        tableData: [],
        // 分页数据
        pagination: {
            ...INITIAL_PAGE_PARAMS
        },
        // 查询参数（只包括查询）
        searchParam: {} as currentType,
        // 初始化默认的查询参数
        searchInitParam: {},
        // 总参数（包含分页和查询参数）
        totalParam: {},
        //是否加载中
        loading: false,
        //接口返回的所有内容
        responseData: null
    })
    //这里传入后台需要的页码数据 字段名自行定义即可
    const pageParam = computed(() => (
        {
            page: state.pagination.current,
            pageSize: state.pagination.size
        }
    ))
    //是否展示分页器
    const isPaginationVisible = computed(() => {
        return isPageAble && state.pagination.total > minPageShowCount
    })

    // 获取数据
    const getTableData = async () => {
        Object.assign(state.totalParam, isPageAble ? pageParam.value : {}, initParam)
        initParam && (state.searchInitParam = initParam)
        state.loading = true;
        const [error, res] = await request(state.totalParam)
        if (error) {
            //这里根据业务需求做判断
            // xxx.error(error.msg)
            return
        }
        state.tableData = res.data.list
        state.responseData = res
        try {
            dataCallBack && (state.tableData = dataCallBack(res));

        } catch (error) {
            console.log(error, 'Format error');
            // Message.error('数据格式错误')使用ui库
        }
        state.loading = false;
        isPageAble && updatePagination({ total: 100 })
    }
    if (immediate) {
        onBeforeMount(async () => {
            await getTableData()
        })
    }
    const updatePagination = (pagination: { total: number }) => {
        Object.assign(state.pagination, pagination)
    }
    const updatedTotalParam = () => {
        state.totalParam = {};
        // 处理查询参数，可以给查询参数加自定义前缀操作
        let currentSearchParam: currentType = {};
        // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
        for (let key in state.searchParam) {
            // * 某些情况下参数为 false/0 也应该携带参数
            if (Reflect.has(state.searchParam, key)) {
                currentSearchParam[key] = state.searchParam[key];
            }
        }
        Object.assign(state.totalParam, currentSearchParam, isPageAble ? pageParam.value : {})
    }
    const resetParams = () => {
        state.searchParam = state.searchInitParam;
        state.pagination = INITIAL_PAGE_PARAMS;
        Object.assign(state.totalParam, state.searchParam, isPageAble ? pageParam.value : {})
    }

    const refreshTable = () => {
        resetParams();
        getTableData();
    }
    const search = () => {
        state.pagination.current = 1;
        updatedTotalParam();
        getTableData();
    }
    // 改变每页显示数量
    const onSizeChange = (val: number) => {
        state.pagination.current = 1;
        state.pagination.size = val;
        getTableData();
    }
    // 选择页码
    const onPageChange = (val: number) => {
        state.pagination.current = val;
        getTableData();
    }
    return {
        ...toRefs(state),
        isPaginationVisible,
        refreshTable,
        search,
        onSizeChange,
        onPageChange,
        getTableData
    }

}