// 引入路由对象
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载
import { getUrlParams, dingCodeLoginFunc, getLogin } from '@/utils'
import { useTestStore } from '@/store'


declare module 'vue-router' {
    interface RouteMeta {
        title: string,
        transition: string,
    }
}
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/homepage/index'
    },
    {
        path: '/homepage',
        name: 'homepage',
        component: () => import('@/layout/homepage.vue'),
        meta: {
            title: '',
            transition: 'animate__bounceIn'
        },
        children: [
            {
                path: 'index',
                name: 'index',
                meta: {
                    title: '首页',
                    transition: ''
                },
                component: () => import('@/views/index.vue')
            }
        ],
    },
    {
        path: '/overall',
        name: 'overall',
        component: () => import('@/layout/overall.vue'),
        meta: {
            title: '',
            transition: 'animate__bounceIn'
        },
        children: [
            {
                path: 'login',
                name: 'login',
                meta: {
                    title: '登陆',
                    transition: 'fade'
                },
                component: () => import('@/views/login.vue')
            },
            {
                path: 'imgHome',
                name: 'imgHome',
                meta: {
                    title: '图片库',
                    transition: 'fade'
                },
                component: () => import('@/views/imgHome.vue')
            },
            {
                path: 'plane',
                name: 'plane',
                meta: {
                    title: '飞机',
                    transition: 'fade'
                },
                component: () => import('@/views/plane.vue')
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/layout/404.vue')

    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach((to, from, next) => {
    let routerList = router.getRoutes();
    if (routerList.findIndex(item => (item.path == to.fullPath)) == -1) {
        next({ path: '/404' })
        return
    }
    const storeTest = useTestStore()
    // if (to.fullPath == '/404') {
    //     ElMessage({
    //         type: 'error',
    //         message: '请在pc端进入'
    //     })
    //     next()
    //     return
    // }
    let tokenObj = getUrlParams() || {}
    if (!storeTest.token) {

    }
    next()
})

//导出路由
export default router
