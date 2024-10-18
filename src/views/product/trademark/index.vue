<template>
  <div>
    <el-card class="box-card">
      <!--      卡片顶部的添加品牌按钮-->
      <el-button icon="Plus" type="primary" size="default" @click="addTrademark"
        >添加品牌</el-button
      >
      <!--      表格组件用于展示已有品牌数据-->
      <el-table style="margin: 10px" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <!--        table-column：默认展示数据用div-->
        <el-table-column label="品牌名称">
          <!--          自定义插槽：# 是v-slot的简写-->
          <template #="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" alt="图片加载失败" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="default"
              icon="Edit"
              @click="(event: MouseEvent) => updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除 ${row.tmName} 吗?`"
              width="200px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="default" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页器组件
      pagination
        v-model:current-page：设置当前分页器页码
        v-model:page-size：设置每页展示数据条数
        background：设置分页器按钮的背景
        layout：可以设置分页器六个子组件布局调整
      -->
      <el-pagination
        @current-change="getHasTrademark"
        @size-change="sizeChange"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </el-card>
    <!--    对话框组件：在添加品牌与修改已有品牌的业务时候使用结构-->
    <!--    v-model:属性用户控制对话框的显示与隐藏  -->
    <!--    title:设置对话框左上角标题  -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
      <el-form style="width: 80%" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="90px" label-position="left" prop="tmName">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="90px" label-position="left" prop="logoUrl">
          <!--       el-upload:action属性：图片上传路径   -->
          <!--       el-upload::show-file-list属性：是否显示上传图片列表   -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              alt="Logo"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!--      具名插槽-->
      <template #footer>
        <el-button type="primary" size="default" @click="confirm">确定</el-button>
        <el-button type="danger" size="default" @click="cancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark
} from '@/api/product/trademark'
import type { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type'

// //按钮权限的实现
// import useUserStore from '@/store/modules/user'
// //获取用户相关的仓库
// let userStore = useUserStore()

//当前页面
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌数据总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//
let dialogFormVisible = ref<boolean>(false)
//获取el-form组件实例
let formRef = ref()

let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
//获取已有品牌的接口封装为一个函数，在任何情况下获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
  console.log(result)
}
//组件挂载完毕钩子———发送一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

//分页器当前页码发生变化时会触发
//对于当前页码发生变化的自定义事件，组件pagenation父组件回传了数据(当前的页码)
// const changePageNo = () => {
//   //当前页码发生变化时再次发请求获取对应已有品牌数据进行展示
//   getHasTrademark();
// }

//当下拉菜单发生变化的时候会触发
//这个自定义事件，分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  //当前每一页数据量发生变化的时候将页码变为1
  pageNo.value = 1
  getHasTrademark()
}

//添加品牌按钮回调函数
const addTrademark = () => {
  //清空收集的数据
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  //对话框显示
  dialogFormVisible.value = true

  // //第一种写法：ts的问号语法
  // formRef.value?.clearValidate('tmName');
  // formRef.value?.clearValidate('logoUrl');
  //第二种写法：nextTick
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

//修改品牌按钮回调函数
//注入了一个参数row
//row：即为当前行对应的品牌
const updateTrademark = (row: TradeMark) => {
  //清空校验规则的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  //对话框显示
  dialogFormVisible.value = true
  //ES6语法合并对象
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id;
  // //展示已有品牌的数据
  // trademarkParams.tmName = row.tmName;
  // trademarkParams.logoUrl = row.logoUrl;
  console.log(trademarkParams)
}

//对话框底部确认按钮
const confirm = async () => {
  //在发请求之前，要对整个表单进行校验,这里回触发写好的该表单内的所有校验函数
  //调用这个方法前先进性校验，如果校验全部通过，再执行后面的语法
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  //添加品牌成功
  if (result.code == 200) {
    //关闭对话框
    dialogFormVisible.value = false
    //弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    //更新页面信息
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    //清空收集数据
  } else {
    //添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
    //关闭对话框
    dialogFormVisible.value = false
  }
}
//对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}

//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //在图片上传成功之前触发，在上传文件之前可以约束文件类型与大小
  //要求：上传文件格式png|jpg|gif <4MB
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpg' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小限制：4MB'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式限定 png | jpg | jpeg | gif '
    })
    return false
  }
}

//上传文件成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  //response：即为当前这次上传图片post请求服务器返回的数据
  //手机上传图片的地址，添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  //图片上传成功，清除图片校验的结果
  formRef.value.clearValidate('logoUrl')
}

//品牌名称校验自定义方法
const validatorTmName = (rule: any, value: any, callback: any) => {
  //当表单元素触发blur的时候，会触发此方法
  //自定义校验规则
  if (value.length >= 2) {
    //校验通过
    callback()
  } else {
    //校验未通过返回的错误信息
    callback(new Error('品牌名称大于等于两位'))
  }
}
//自定义logo图片自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callback: any) => {
  //如果图片上传
  if (value) {
    callback()
  } else {
    callback(new Error('Logo图片务必上传'))
  }
}

//表单校验规则对象
const rules = {
  tmName: [
    //required代表这个字段是必须校验的，表现为表单项前面出现一个五角星
    //trigger表示触发校验时机[blur：失去焦点时，change：表单发生变化时]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }]
}

//气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '品牌删除成功'
    })
    //删除成功之后立马再次获取已有品牌数
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
