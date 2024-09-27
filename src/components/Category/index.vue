<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select v-model="c1Id" style="width: 200px">
            <!--option:label即为显示文字 value属性即为select下拉菜单收集的数据-->
            <el-option
              v-for="(c1, index) in c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select style="width: 200px">
            <el-option label="北京"></el-option>
            <el-option label="上海"></el-option>
            <el-option label="广州"></el-option>
            <el-option label="深圳"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select style="width: 200px">
            <el-option label="北京"></el-option>
            <el-option label="上海"></el-option>
            <el-option label="广州"></el-option>
            <el-option label="深圳"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//引入分类接口方法
import { reqC1 } from '@/api/product/attr'
//引入生命周期的函数钩子
import { onMounted, ref } from 'vue'
//存储一级分类的数据
let c1Arr = ref<any>([])
//获取一级分类数据
let c1Id = ref<number | string>('')
//组件挂载完毕
onMounted(() => {
  getC1()
})

const getC1 = async () => {
  let result = await reqC1()
  if (result.code == 200) {
    c1Arr.value = result.data
  }
}
</script>
<style lang="scss" scoped></style>
