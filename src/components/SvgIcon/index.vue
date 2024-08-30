<template>
  <!-- 测试SVG图标使用 -->
  <!-- svg:图标外层容器节点，内部需要与use标签结合使用 -->
  <svg :style="{ width, height }">
    <!-- xlink:href执行使用哪一个图标-->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
//接受父组件传递过来的参数
defineProps({
  //xlink:href属性值前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //提供使用的图标名字
  name: String,
  //接受父组件传递颜色
  color:{
    type:String,
    default:''
  },
  width: {
    type: String,
    default: '30px'
  },
  height: {
    type: String,
    default: '30px'
  }
})
</script>

<style scoped>

</style>