<template>
  <div class="login_container">
    <el-row type="flex" justify="center" align="middle" class="full-height">
      <el-col>
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到项目</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"  class="login_input" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :prefix-icon="Lock" v-model="loginForm.password" class="login_input" type="password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore();
//获取el-form组件
let loginForms = ref();
// 获取路由器
let $router = useRouter();
// 获取路由对象
let $route = useRoute();
//定义变量控制俺就加载效果
let loading = ref(false)
//收集账号与密码的数据
let loginForm = reactive({username:'admin', password:'111111'})
//登录按钮回调
const login = async() => {
  //保证全部表单项校验通过再发请求
  await loginForms.value.validate();
  //加载效果：开始加载
  loading.value = true;
  //点击登录按钮之后干什么？
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出登陆失败的信息
  try {
    //保证登陆成功
    await userStore.userLogin(loginForm);
    //判断登录的时候,路由路径中是否由query参数,如果有就往query参数跳转,没有则跳转到首页
    //编程导航跳转到展示数据首页
    let redirect:any = $route.query.redirect;
    $router.push({path:redirect||'/'});
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`
    });
    //登陆成功加载效果也消失
    loading.value = false;
  }catch(error) {
    console.log(error)
    //登录失败加载消息效果消失
    loading.value = false;
    //登陆失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message
    })
  }
}
//自定义校验规则函数
const validatorUserName = (rule:any, value:any, callback:any) => {
  //rule:即为数组的校验规则对象
  //value:即为表单元素文本内容
  //函数:如果符合条件callBack方法，注入错误提示信息
  //如果不符合条件callBack方法，注入错误提示信息
  if(value.length >= 3 && value.length <= 10){
    callback();
  }else {
    callback(new Error('账号长度介于3位与10位之间'))
  }
}
const validatorPassword = (rule:any, value:any, callback:any) => {
  if(value.length >= 6 && value.length <= 20){
    callback();
  }else {
    callback(new Error('密码长度介于6位与20位之间'))
  }
}
//定义表单校验需要配置对象
const rules = {
  //规则对象属性：required，代表这个字段时务必要校验的，trigger表示触发时机
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // { required: true, min: 3, max: 10, message: '用户名在3位到10位之间', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName }
  ],
  password: [
    // { required: true, min: 6, max: 20, message: '密码长度介于6位与20位之间', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword }
  ]
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.png') no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.full-height {
  height: 100%;
}

.login_form {
  width: 300px;
  padding: 20px;
  background-color: transparent; /* 白色半透明背景 */
  border: 2px solid rgba(0, 0, 0, 0.5); /* 半透明边框 */
  border-radius: 10px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8); /* 阴影效果 */
  text-align: center;
  opacity: 0.8;
  h1 {
    color: white;
    font-size: 40px;
    font-weight: bolder;
    opacity: 0.8;
  }
  h2 {
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0px;
    opacity: 0.8;
  }
}
.login_input {
  background-color: transparent; /* 设置输入框背景透明 */
  border: 2px solid rgba(0, 0, 0, 0.5); /* 设置输入框边框 */
  border-radius: 5px; /* 设置输入框圆角 */
}
.login_btn {
  color: white;
  width: 100%;
  background-color: transparent; /* 设置按钮背景透明 */
  border: 2px solid rgba(0, 0, 0, 0.5); /* 设置按钮边框 */
  border-radius: 5px; /* 设置按钮圆角 */
}
.login_btn:active {
  color: gray;
  background-color: white;
}
</style>