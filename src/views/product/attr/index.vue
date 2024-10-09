<template>
  <div>
    <!--    三级分类全局组件-->
    <Category :scene="scene" />
    <el-card style="margin-top: 10px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
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
              <!-- 修改已有属性的按钮 -->
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除 ${row.attrName} 吗?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="!attrParams.attrName"
          type="primary"
          size="default"
          icon="Plus"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <!--<template #="{ row, $index }">-->
            <!--  <el-input-->
            <!--    v-if="flag"-->
            <!--    @blur="toLook"-->
            <!--    size="small"-->
            <!--    placeholder="请输入属性值名称"-->
            <!--    v-model="row.valueName"-->
            <!--  ></el-input>-->
            <!--  <div v-else @click="toEdit">{{ row.valueName }}</div>-->
            <!--</template>-->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="deleteArrValue($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length <= 0"
          >保存</el-button
        >
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
//引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import type { AttrResponseData, AttrList, Attr, AttrValue } from '@/api/product/attr/types'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
//存储已有的属性与属性值
let attrArr = ref<AttrList>([])
//定义card组件内容的切换的变量
//scene=0显示table，scene=1，展示添加与修改属性结构
let scene = ref<number>(0)
//定义一个响应式数据控制编辑模式与查看模式的切换
let flag = ref<boolean>(true)
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增的属性的名字
  attrValueList: [
    //新增的属性值数组
  ],
  categoryId: '', //三级分类ID
  categoryLevel: 3 //代表是几级分类
})

//准备一个数组：将来存储对应的组件实例el-input
let inputArr = ref<any>([])

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

// 添加属性请求体字段说明
// {
//   "attrName": "string",  //新增的属性的名字
//   "attrValueList": [
//   {
//     "valueName": "string"//新增的属性值的名字
//   }
// ],
//   "categoryId": 0,       //归属于哪个三级分类
//   "categoryLevel": 0,    //代表是几级分类
// }
//添加属性按钮的回调
const addAttr = async () => {
  //每一次点击的时候，先清空数据再收集数据
  //使用Object.assign(合并对象，值)合并对象
  Object.assign(attrParams, {
    attrName: '', //新增的属性的名字
    attrValueList: [
      //新增的属性值数组
    ],
    categoryId: categoryStore.c3Id, //三级分类ID
    categoryLevel: 3 //代表是几级分类
  })
  //切换为添加与修改属性的结构
  scene.value = 1
  //点击添加属性按钮的时候收集新增属性的三级分类ID
  // attrParams.categoryId = categoryStore.c3Id
}

// 编辑属性请求体字段说明
// {
//   "attrName": "string",  //已有属性的名字
//   "attrValueList": [
//   {
//     "attrId": 0,         //已有的属性值归属于哪个属性的ID
//     "id": 0,             //已有的属性值的Id
//     "valueName": "string"//属性值的名字
//   }
// ],
//   "categoryId": 0,       //已有属性归属于哪个三级分类
//   "categoryLevel": 0,    //代表是几级分类
//   "id": 0                //已有属性的Id
// }
//编辑属性按钮的回调
const updateAttr = (row: Attr) => {
  //切换为添加与修改属性的结构
  scene.value = 1
  //将已有的属性对象赋值给attrParams对象
  //ES6->Object.assign进行对象合并
  //深拷贝，如果只是Object.assign(attrParams,row)属于浅拷贝
  //***浅拷贝***
  // 是指在复制对象时，只复制对象的第一层属性，而不会递归复制嵌套对象的属性。
  // 也就是说，如果对象的属性是基本类型（如字符串、数字、布尔值等），那么这些属性的值会被复制；
  // 但如果属性是对象或数组，那么复制的只是这些对象或数组的引用，而不是它们的内容。
  //***深拷贝***
  // 深拷贝是指在复制对象时，不仅复制对象的第一层属性，还会递归复制嵌套对象的所有属性。
  // 也就是说，深拷贝会创建一个完全独立的对象，即使嵌套对象的属性被修改，也不会影响原始对象。
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//取消按钮的回调
const cancel = () => {
  scene.value = 0
}

//添加属性值按钮的回调
const addAttrValue = () => {
  //点击添加属性按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true //控制每一个属性值编辑模式与查看模式的切换
  })
  //获取最后一个el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存按钮的回调
const save = async () => {
  //收集参数
  //发送请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  console.log(result)
  //添加请求|修改已有属性已经成功
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    //获取全部已有属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}

// //属性值表单元素失去焦点的方法
// const toLook = () => {
//   flag.value = false
// }
// //再次点击属性值表单元素变为编辑模式的方法s
// const toEdit = () => {
//   flag.value = true
// }

//属性值表单元素失去焦点事件回调
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断
  //1.表单内容为空
  if (row.valueName.trim() == '') {
    //删除对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  //2.表单内容重复
  let repeat = attrParams.attrValueList.find((item) => {
    //切记把当前失去焦点属性值对象从当前数组中扣除判断
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //删除对应属性值重复的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }

  //相应的属性值对象flag：变为false，切换为查看模式
  row.flag = false
}
//属性值表单元素点击事件回调
const toEdit = (row: AttrValue, $index: number) => {
  //相应的属性值对象flag：变为true，切换为编辑模式
  row.flag = true
  //nexttick:响应式数据发生变化，获取更新的DOM（组件实例）
  nextTick(() => {
    inputArr.value[$index].focus()
  })
  console.log(inputArr.value[$index])
}

//删除表单对应属性值
const deleteArrValue = ($index: number) => {
  attrParams.attrValueList.splice($index, 1)
}

//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发送请求
  let result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //获取一次已有的属性与属性值
    await getAttr()
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
