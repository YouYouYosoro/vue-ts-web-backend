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
              <el-button
                @click="addSku(row)"
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                @click="updateSpu(row)"
                title="编辑SPU"
              ></el-button>
              <el-button
                type="info"
                size="small"
                icon="View"
                @click="findSku(row)"
                title="查看SKU列表"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button type="danger" icon="Delete" title="删除SPU" size="small"></el-button>
                </template>
              </el-popconfirm>
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
      <!--添加SKU组件-->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
//引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuInfoData,
  SkuData
} from '@/api/product/spu/type'

//引入子组件
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'
import { ElMessage } from 'element-plus'

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
//获取子组件实例SkuForm
let sku = ref<any>()
//存储全部的SKU数据
let skuArr = ref<SkuData[]>([])
//控制SKU列表dialog的显示
let show = ref(false)

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
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

//此方法执行：分页器下拉菜单每页数据个数发生变化的时候触发
const changeSize = () => {
  getHasSpu()
}

const addSpu = () => {
  scene.value = 1
  //调用子组件暴露出来的方法初始化数组
  spu.value.initAddSpu(categoryStore.c3Id)
}

//子组件SpuForm绑定自定义事件：目的是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  //子组件SpuForm点击取消变为场景0，切换场景
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    //再次获取全部已有的SPU
    getHasSpu()
  }
}

//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //切换为场景2
  scene.value = 2
  //调用子组件的方法初始化添加SKU模块的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//修改已有SPU
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //调用子组件实例方法获取完整的已有的SPU的数据
  spu.value.initHasSpuData(row)
}

//查看SKU列表
const findSku = async (row: SpuData) => {
  let res: SkuInfoData = await reqSkuList(row.id as number)
  if (res.code == 200) {
    skuArr.value = res.data
    //显示对话框
    show.value = true
  }
}

//删除SPU回调
const deleteSpu = async (row: SpuData) => {
  let res: any = await reqRemoveSpu(row.id as number)

  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //获取剩余的SPU数据
    await getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

//路由组件销毁时，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库数据
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
