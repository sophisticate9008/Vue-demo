import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(router)

app.mount('#app')
const originalWarn = console.warn;

// 重写 console.warn 方法
console.warn = function (message, ...args) {
    if (typeof message === 'string' && message.includes('quill')) {
        return; // 过滤掉包含 "Quill" 的警告信息
    }
    originalWarn.apply(console, [message, ...args]); // 其他警告继续显示
};