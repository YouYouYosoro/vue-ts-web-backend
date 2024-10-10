<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin-top: 10px">
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          >添加SPU</el-button
        >
        <!--展示已有SPU数据-->
        <el-table border style="margin-top: 10px" :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column
            label="SPU名称"
            align="center"
            width="200px"
            prop="spuName"
          ></el-table-column>
          <el-table-column
            label="SPU描述"
            show-overflow-tooltip
            prop="description"
          ></el-table-column>
          <el-table-column label="SPU操作" width="300px">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SPU"></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                @click="updateSpu(row)"
                title="编辑SPU"
              ></el-button>
              <el-button type="info" size="small" icon="View" title="查看SPU列表"></el-button>
              <el-button type="danger" size="small" icon="Delete" title="删除SPU"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!--添加SPU组件-->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <!--添加SPU组件-->
      <SkuForm v-show="scene == 2"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
//引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData } from '@/api/product/spu/type'

//引入子组件
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'

let categoryStore = useCategoryStore()
//场景的数据
//0：显示已有SPU；1：添加或者修改已有SPU；2：添加SKU的结构
let scene = ref<number>(0)
//分页器默认页码
let pageNo = ref<number>(1)
//每一页展示几条数据
let pageSize = ref<number>(3)
//存储已有SPU总个数
let total = ref<number>(0)
//存储已有的spu的数据
let records = ref<Records>([])
//获取子组件实例SpuForm
let spu = ref<any>()

//监听三级分类Id的变化
watch(
  () => categoryStore.c3Id,
  () => {
    //务必保证三级分类Id存在
    if (!categoryStore.c3Id) return
    getHasSpu()
  }
)

//此方法执行：可以获取一个三级分类下全部的已有的SPU
const getHasSpu = async () => {
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

//此方法执行：分页器下拉菜单每页数据个数发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}

const addSpu = () => {
  scene.value = 1
}

//子组件SpuForm绑定自定义事件：目的是让子组件通知父组件切换场景为0
const changeScene = (num: number) => {
  //子组件SpuForm点击取消变为场景0，切换场景
  scene.value = num
}
//修改已有SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //调用子组件实例方法获取完整的已有的SPU的数据
  spu.value.initHasSpuData(row)
}

const cancel = () => {
  scene.value = 0
}

const save = () => {
  scene.value = 0
}
//路由组件销毁时，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库数据
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
