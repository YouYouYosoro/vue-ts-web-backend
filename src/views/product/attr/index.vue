<template>
  <div>
    <!--    三级分类全局组件-->
    <Category />
    <el-card style="margin-top: 10px">
      <div>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >添加属性</el-button
        >
        <el-table border style="margin-top: 10px" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column
            label="属性名称"
            align="center"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Edit"></el-button>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
//引入获取已有属性与属性值接口
import { reqAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import type { AttrResponseData, AttrList } from '@/api/product/attr/types'

let categoryStore = useCategoryStore()
//存储已有的属性与属性值
let attrArr = ref<AttrList>([])

//监听仓库三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的属性与属性值
    attrArr.value = []
    //保证三级分类存在才能发请求
    if (!categoryStore.c3Id) return
    //获取分类的Id
    getAttr()
  }
)

//获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  //获取分类下已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
</script>

<style scoped lang="scss"></style>
