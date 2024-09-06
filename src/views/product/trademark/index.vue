<template>
  <div>
    <el-card class="box-card">
<!--      卡片顶部的添加品牌按钮-->
      <el-button icon="Plus" type="primary" size="default">添加品牌</el-button>
<!--      表格组件用于展示已有品牌数据-->
      <el-table style="margin: 10px 0px" border>
        <el-table-column label="序号" width="80px" align="center"></el-table-column>
        <el-table-column label="品牌名称"></el-table-column>
        <el-table-column label="品牌序号"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <!--      分页器组件
      pagination
        v-model:current-page：设置当前分页器页码
        v-model:page-size：设置每页展示数据条数
        background：设置分页器按钮的背景
        layout：可以设置分页器六个子组件布局调整
      -->

      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 10]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="400"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { reqHasTrademark } from '@/api/product/trademark'
//当前页面
let pageNo = ref<number>(1);
//每一页展示多少条数据
let limit = ref<number>(3);
//获取已有品牌的接口封装为一个函数，在任何情况下获取数据，调用此函数即可
const getHasTrademark = async () => {
  await reqHasTrademark(pageNo.value, limit.value);
}
//组件挂载完毕狗子———发送一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
})
</script>

<style scoped lang="scss">

</style>