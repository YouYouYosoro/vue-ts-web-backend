//创建用户相关的小仓库
import { defineStore, type Store } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo } from '@/api/user'
//引入数据类型
import type { loginForm,loginResponseData } from '@/api/user/type'
import type { UserState } from '@/store/modules/types/type'
//引入操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoute } from '@/router/routes';
//创建用户小仓库
let useUserStore = defineStore('user', {
  //小仓库存储数据的地方
  state: (): UserState => {
    //用户的唯一标识token
    return {
      token: GET_TOKEN(),//用户唯一标识token
      menuRoutes: constantRoute,//仓库存储生成菜单需要的数组(路由)
      username:'',
      avatar:'',
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginForm) {
      //登录请求
      let result:loginResponseData = await reqLogin(data);
      //登录成功：200->token
      //登录失败：201->登录失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia|vues存储数据其实利用js对象
        this.token = (result.data.token as string);//保证token在一定是字符串的情况下赋值
        //本地存储持久化数据一份
        SET_TOKEN((result.data.token as string));
        //能保证当前async函数返回一个成功的promise
        return 'ok';
      }else {
        return Promise.reject(new Error(result.data.message));
      }
    },
    //获取用户信息的方法
    async userInfo() {
      //获取用户信息存储到仓库当中[用户头像、名字]
      let result = await reqUserInfo();
      //如果成功获取用户信息，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.checkUser.username;
        this.avatar = result.data.checkUser.avatar;
      }else {
        alert("获取用户信息失败")
      }
    },
    //退出登录
    userLogout(){
      //目前没有mock接口：退出登录接口(通知服务器本地用户唯一标识失效)
      this.token = '';
      this.username = '';
      this.avatar = '';
      REMOVE_TOKEN();
    }
  },
  getters: {

  }
})
//对外暴露获取小仓库方法
export default useUserStore;