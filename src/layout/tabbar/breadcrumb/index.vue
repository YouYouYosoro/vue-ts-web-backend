<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!--  动态展示图标  -->
      <el-icon style="margin: 0px 2px; vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!--  面包屑动态展示路由名字与标题  -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'
//获取layout配置相关的仓库
import useLayoutSettingStore from '@/store/modules/setting'
//定义一个响应式数据去控制折叠与图标切换
// let fold = ref(false);
let LayoutSettingStore = useLayoutSettingStore()
//获取路由对象
let $route = useRoute()

const changeIcon = () => {
  //图标进行切换
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
//测试获取路由功能
// const handler = () => {
//   console.log($route.matched);
// }
</script>
<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>

<style scoped lang="scss"></style>
