<template>
  <div>
    <el-card class="box-card">
<!--      卡片顶部的添加品牌按钮-->
      <el-button icon="Plus" type="primary" size="default" @click="addTrademark">添加品牌</el-button>
<!--      表格组件用于展示已有品牌数据-->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
<!--        table-column：默认展示数据用div-->
        <el-table-column label="品牌名称">
<!--          自定义插槽：# 是v-slot的简写-->
          <template #="{row,$index}">
            <pre style="color: black">{{row.tmName}}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template #="{row,$index}">
            <img :src="row.logoUrl" alt="图片加载失败" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{row,$index}">
            <el-button type="primary" size="default" icon="Edit" @click="updateTrademark"></el-button>
            <el-button type="danger" size="default" icon="Delete"></el-button>
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
        :page-count="5"
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
    <el-dialog v-model="dialogFormVisible" title="添加品牌">
      <el-form style="width: 80%">
        <el-form-item label="品牌名称" label-width="80px" label-position="left">
          <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="80px" label-position="left">
<!--       el-upload:action属性：图片上传路径   -->
<!--       el-upload::show-file-list属性：是否显示上传图片列表   -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
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

import { ref, onMounted, reactive } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import type { Records, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type'
//当前页面
let pageNo = ref<number>(1);
//每一页展示多少条数据
let limit = ref<number>(3);
//存储已有品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([]);
//
let dialogFormVisible = ref<boolean>(false);

let trademarkParams = reactive<TradeMark>({
  tmName:'',
  logoUrl:''
})
//获取已有品牌的接口封装为一个函数，在任何情况下获取数据，调用此函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager;
  let result:TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code == 200) {
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
  console.log(result);
}
//组件挂载完毕钩子———发送一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
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
  pageNo.value = 1;
  getHasTrademark();
}

//添加品牌按钮回调函数
const addTrademark = () => {
  dialogFormVisible.value = true;
  //对话框显示
  console.log("add");
}
//修改品牌按钮回调函数
const updateTrademark = () => {
  dialogFormVisible.value = true;
  //对话框显示
  console.log("update");
}
//对话框底部确认按钮
const confirm = () => {
  dialogFormVisible.value = false;
}
//对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false;
}

//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //在图片上传成功之前触发，在上传文件之前可以约束文件类型与大小
  //要求：上传文件格式png|jpg|gif <4MB
  if (rawFile.type=='image/png'||rawFile.type=='image/jpg'||rawFile.type=='image/jpeg'||rawFile.type=='image/gif'){
    if (rawFile.size/1024/1024 <4) {
      return true;
    } else {
      ElMessage({
        type: 'error',
        message: "上传文件大小限制：4MB"
      })
      return false;
    }
  }else {
    ElMessage({
      type: 'error',
      message: "上传文件格式限定 png | jpg | jpeg | gif "
    })
    return false;
  }
}

//上传文件成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //response：即为当前这次上传图片post请求服务器返回的数据
  //手机上传图片的地址，添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data;
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
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>