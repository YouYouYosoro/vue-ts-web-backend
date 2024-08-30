<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="">
    <p v-if="!layoutSettingStore.fold" :class="{ 'fade-in': !layoutSettingStore.fold }">{{setting.title}}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
import useLayoutSettingStore from '@/store/modules/setting'
import { nextTick } from 'vue'

let layoutSettingStore = useLayoutSettingStore();

// 在组件挂载后设置延时
setTimeout(() => {
  nextTick(() => {
    layoutSettingStore.fold = false; // 假设 fold 的初始值为 true
  });
}, 300); // 300 毫秒（0.3 秒）后渲染段落
</script>
<script lang="ts">
export default {
  name:"Logo"
}
</script>
<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  img{
    width: 40px;
    height: 40px;
  }
  p{
    font-size: $base-menu-title-fontSize;
    margin-left: 10px;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in 0.3s forwards;
  opacity: 0;
}
</style>