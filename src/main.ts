import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import 'uno.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
app.config.globalProperties.$filters = {
    format<T extends any>(str: T): string {
        return `$${str}`
    }
}
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const store = createPinia()
// 持久化
store.use(piniaPluginPersistedstate)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
