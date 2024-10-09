<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <!--<el-select v-model="c1Id" style="width: 200px">-->
          <!--  &lt;!&ndash;option:label即为显示文字 value属性即为select下拉菜单收集的数据&ndash;&gt;-->
          <!--  <el-option-->
          <!--    v-for="(c1, index) in c1Arr"-->
          <!--    :key="c1.id"-->
          <!--    :label="c1.name"-->
          <!--    :value="c1.id"-->
          <!--  ></el-option>-->
          <!--</el-select>-->
          <el-select
            :disabled="scene != 0"
            v-model="categoryStore.c1Id"
            style="width: 200px"
            @change="handler1"
          >
            <!--value:即为select下拉菜单收集的数据, 绑定到上面的c1Id中-->
            <el-option
              v-for="(c1, index) in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            :disabled="scene != 0"
            v-model="categoryStore.c2Id"
            style="width: 200px"
            @change="handler2"
          >
            <el-option
              v-for="(c2, index) in categoryStore.c2Arr"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            :disabled="scene == 0 ? false : true"
            v-model="categoryStore.c3Id"
            style="width: 200px"
          >
            <el-option
              v-for="(c3, index) in categoryStore.c3Arr"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// //引入分类接口方法
// import { reqC1 } from '@/api/product/attr'
// //引入生命周期的函数钩子
// import { onMounted, ref } from 'vue'
// //存储一级分类的数据
// let c1Arr = ref<any>([])
// //获取一级分类数据
// let c1Id = ref<number | string>('')
// //组件挂载完毕
// onMounted(() => {
//   getC1()
// })
//
// const getC1 = async () => {
//   let result = await reqC1()
//   if (result.code == 200) {
//     c1Arr.value = result.data
//   }
// }

//引入组件挂载完毕方法
import { onMounted } from 'vue'
//引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
//当全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

//通知仓库获取一级分类的方法
const getC1 = () => {
  //通知分类仓库发请求获取一级分类的数据
  categoryStore.getC1()
}
//此方法为一级分类下拉菜单的change事件（会在选中值的时候触发，保证一级分类ID有了）
const handler1 = () => {
  //当一级分类变化时，需要将二级三级分类清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //通知仓库获取二级分类的数据
  categoryStore.getC2()
}
//二级分类对应的下拉菜单change事件
const handler2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}

//接收父组件传递过来的scene
defineProps(['scene'])
</script>
<style lang="scss" scoped></style>
