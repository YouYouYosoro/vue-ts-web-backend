<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入SPU名称"
          style="width: 200px"
          v-model="SpuParams.spuName"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU品牌">
        <el-select style="width: 200px" v-model="SpuParams.tmId">
          <el-option
            v-for="(item, index) in AllTrademark"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请输入描述"
          v-model="SpuParams.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="handlerUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img
            w-full
            :src="dialogImageUrl"
            alt="Preview Image"
            style="width: 100%; height: 100%"
          />/>
        </el-dialog>
      </el-form-item>

      <el-form-item label="SPU销售属性">
        <!--展示销售属性的下拉菜单-->
        <el-select
          v-model="saleAttrIdAndValueName"
          :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : `无`"
          style="width: 200px"
        >
          <el-option
            :value="`${item.id}:${item.name}`"
            v-for="(item, index) in unSelectSaleAttr"
            :key="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-button
          :disabled="!saleAttrIdAndValueName"
          @click="addSaleAttr"
          type="primary"
          style="margin-left: 10px"
          icon="Plus"
          >添加属性</el-button
        >
        <!--table展示销售属性与属性值的地方-->
        <el-table border style="margin-top: 10px" :data="saleAttr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column
            label="销售属性名字"
            width="150px"
            prop="saleAttrName"
            align="center"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <el-tag
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                style="margin: 0px 5px"
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                closable
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                @blur="toLook(row)"
                v-model="row.saleAttrValue"
                v-if="row.flag == true"
                placeholder="请输入属性值"
                size="small"
                style="width: 100px; margin-right: 5px"
              ></el-input>
              <el-button
                @click="toEdit(row)"
                v-else
                type="primary"
                size="small"
                icon="Plus"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" align="center">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="saleAttr.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saleAttr.length <= 0" type="primary" size="default" @click="save"
          >保存</el-button
        >
        <el-button size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import type {
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue
} from '@/api/product/spu/type'

import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSalAttr,
  reqAddOrUpdateSpu
} from '@/api/product/spu'

import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])

//存储已有的SPU这些数据
let AllTrademark = ref<Trademark[]>([])
//商品图片
let imgList = ref<SpuImg[]>([])
//已有的SPI销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部已销售的SPU属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '',
  description: '',
  tmId: '', //品牌ID
  spuImageList: [],
  spuSaleAttrList: []
})
//控制图片预览对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储预览图片的地址
let dialogImageUrl = ref<string>('')
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')
//控制输入属性值和按钮的切换

//子组件方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象，将来在模板红展示
  SpuParams.value = spu
  //spu：即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部的品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有的SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部的SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSalAttr()

  //存储全部品牌的数据
  AllTrademark.value = result.data
  //SPU对应的商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  //存储已有的SPU的销售属性
  saleAttr.value = result2.data
  //全部已销售的SPU属性
  allSaleAttr.value = result3.data
}

//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部的销售属性：颜色、版本、尺码
  //已有的销售属性：颜色、版本
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name !== item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加属性的方法
const addSaleAttr = () => {
  //以 : 分割字符串
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  //准备一个新的销售属性对象:将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  //追加到数组中
  saleAttr.value.push(newSaleAttr)
  //添加完毕清空收集的数组
  saleAttrIdAndValueName.value = ''
}

//添加一个新的SPU的初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //先清空数据
  Object.assign(SpuParams.value, {
    id: '',
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
  })
  //清空照片墙
  imgList.value = []
  //清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  //存储由父组件传递过来的c3Id
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let res: AllTradeMark = await reqAllTradeMark()
  //获取所有的销售属性的数据
  let res1: HasSaleAttrResponseData = await reqAllSalAttr()
  AllTrademark.value = res.data
  allSaleAttr.value = res1.data
}

//对外暴露
defineExpose({ initHasSpuData, initAddSpu })

//输入框失去聚焦的回调函数
const toLook = (row: SaleAttr) => {
  //整理收集的属性的ID与属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  //整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string
  }
  //非法判断
  //空判断
  if (saleAttrValue?.trim() === '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的'
    })
    row.flag = false
    return
  }
  //重复判断
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    row.flag = false
    return
  }
  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}

//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  //点击按钮，切换为input组件
  row.flag = true
  row.saleAttrValue = ''
  //获取最后一个el-input组件聚焦
  // nextTick(() => {
  //   saleAttr.value[spuSaleAttrValueList.length - 1].focus()
  // })
}

//保存按钮的回调
const save = async () => {
  //整理参数
  //照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url
    }
  })
  SpuParams.value.spuSaleAttrList = saleAttr.value
  //发送请求
  let res = await reqAddOrUpdateSpu(SpuParams.value)
  //成功响应
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功'
    })
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add'
    })
  } else {
    ElMessage({
      type: 'error',
      message: res.data
    })
  }
}

//点击取消按钮，通知父组件切换场景为1，展示有的SPU的数据
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
//照片墙点击预览的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  //弹出对话框
  dialogVisible.value = true
}

//照片墙删除文件钩子
const handleRemove = () => {}

//照片上传成功之前的钩子约束文件大小和类型
const handlerUpload = (file: any) => {
  if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF'
    })
    return false
  }
}
</script>

<style lang="scss" scoped></style>
