//路由鉴权：鉴权，项目单中路由能不能被访问的权限的设置（某一个路由什么条件下可以访问，什么条件下不可以访问的设置）
import router from '@/router';
import nprogress from 'nprogress';
//引入进度条的样式
import "nprogress/nprogress.css"

//获取用户相关的小仓库内部token数据，去判断用户是否登陆成功
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
import pinia from '@/store'
let userStore = useUserStore(pinia);
console.log(userStore);
//全局守卫：项目中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach((to:any, from:any, next:any) => {
  //to：你将要访问那个路由
  //from：你从哪个路由来
  //next：路由的放行函数
  console.log('全局前置守卫已激活');
  nprogress.start();
  next();
  console.log('予以放行');

  //获取token，去判断用户登陆还是未登录
  let token = userStore.token;
  //用户登录判断
  if (token) {
    alert("用户已登录");
  } else {
    //用户未登录判断
    if (to.path == '/login'){
      next();
    } else {
      next({path:'/login'});
    }
  }
})

//全局后置守卫
router.afterEach((to:any, from:any, next:any) => {
  console.log('全局后置守卫已激活');
  nprogress.done();
})

//第一个问题：任意路由切换实现进度条业务 ---nprogress
//第二个问题：路由鉴权（路由组件访问权限的设置）
//  全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)
//  用户未登录：可以访问login，其余路由不能访问(指向login)
//  用户登陆成功：不可以访问login[指向首页]，其余路由可以访问