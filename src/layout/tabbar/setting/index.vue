<template>
  <!-- 顶部右侧静态 -->
  <el-button icon="Refresh" circle @click="Refresh"></el-button>
  <el-button icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!--表单组件-->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          :teleported="false"
          @change="setColor"
          v-model="color"
          :predefine="predefineColors"
        ></el-color-picker>
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 36px; height: 36px; margin: 0 10px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
//获取骨架小仓库
import useLayoutSettingStore from '@/store/modules/setting'
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { nextTick, ref } from 'vue'

//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()

//预制颜色
const dark = ref(false)
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
//刷新按钮点击回调
const Refresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

//全屏按钮点击回调
const fullScreen = () => {
  //DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏模式
    document.exitFullscreen()
  }
}

//退出登录点击回调
const logout = async () => {
  //第一件事：需要向服务器发请求[退出登录接口]
  //第二件事情：清除仓库当中相关的数据[eg: token|username|avatar]
  await userStore.userLogout()
  //第三件事：跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

//主题颜色变化回调
const setColor = () => {
  //获取html根节点
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}

//switch开关的的change事件，控制暗黑模式的切换
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}
</script>

<style scoped lang="scss"></style>
