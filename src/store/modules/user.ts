//创建用户相关的小仓库
import { defineStore, type Store } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
//引入数据类型
// import type { loginForm,loginResponseData } from '@/api/user/type'
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
import type { UserState } from '@/store/modules/types/type'
//引入操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute,asyncRoute,anyRoute } from '@/router/routes'
import router from '@/router'
//引入深拷贝方法
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

//路由对比过滤
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

//创建用户小仓库
let useUserStore = defineStore('user', {
  //小仓库存储数据的地方
  state: (): UserState => {
    //用户的唯一标识token
    return {
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组(路由)
      username: '',
      avatar: '',
      //存储当前用户是否包含按钮
      buttons:[]
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //登录请求
      let result: loginResponseData = await reqLogin(data)
      console.log(result)
      //登录成功：200->token
      //登录失败：201->登录失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia|vues存储数据其实利用js对象
        this.token = result.data as string //保证token在一定是字符串的情况下赋值
        //本地存储持久化数据一份
        SET_TOKEN(result.data as string)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息的方法
    async userInfo() {
      //获取用户信息存储到仓库当中[用户头像、名字]
      let result: userInfoResponseData = await reqUserInfo()
      console.log(result)
      //如果成功获取用户信息，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute),result.data.routes)
        console.log(userAsyncRoute)
        //菜单的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute,...anyRoute];
        //目前路由器管理的只有常量路由：用户计算完毕异步路由，任意路由动态添加
        [...userAsyncRoute,...anyRoute].forEach((route: any) => {
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout()
      console.log(result)
      //判断
      if (result.code == 200) {
        //目前没有mock接口：退出登录接口(通知服务器本地用户唯一标识失效)
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        //留给组件作为判断退出登录是否成功的依据
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters: {}
})
//对外暴露获取小仓库方法
export default useUserStore
