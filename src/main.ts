//引用模板的全局样式
import '@/styles/index.scss'

//svg插件需要配置代码
import 'virtual:svg-icons-register'

//引入自定义插件对象，注册整个项目全局组件
import globalComponent from '@/components'

//引入仓库
import pinia from '@/store'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入路由
import router from './router'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

//获取应用实例对象
const app = createApp(App)
//安装仓库
// @ts-ignore
app.use(pinia)

//安装element-plus插件
// @ts-ignore
app.use(ElementPlus, {
  locale: zhCn
})

//安装自定义插件
app.use(globalComponent)

//注册模板路由
// @ts-ignore
app.use(router)

//引入路由鉴权文件
import './permissions'

//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)

//将应用挂载到挂载点上
app.mount('#app')
