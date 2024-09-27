<template>
  <!-- 顶部右侧静态 -->
  <el-button icon="Refresh" circle @click="Refresh"></el-button>
  <el-button icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button icon="Setting" circle></el-button>
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
import { nextTick } from 'vue'

//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
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
</script>
<script lang="ts">
export default {
  name: 'Setting'
}
</script>

<style scoped lang="scss"></style>
