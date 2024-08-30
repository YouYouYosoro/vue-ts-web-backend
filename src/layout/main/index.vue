<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout以及路由组件的子路由 -->
      <component :is="Component" v-if="flag"/>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch,nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting';
let layoutSettingStore = useLayoutSettingStore();

//控制当前组件是否销毁重建
let flag = ref(true);

//监听仓库内部数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(() => layoutSettingStore.refresh, () => {
  //点击刷新按钮：路由组件销毁
  flag.value = false;
  //刷新
  nextTick(() => {
    flag.value = true;
  })
})
</script>
<script lang="ts">
export default {
  name:"Main"
}
</script>
<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>