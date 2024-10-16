<template>
  <!--顶部搜索栏-->
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请你输入搜索职位的关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="!keyword" @click="search">
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!--表单栏-->
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="addRole"> 添加职位 </el-button>
    <el-table border style="margin: 10px 0" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setPermission(row)">
            分配权限
          </el-button>
          <el-button type="warning" size="small" icon="Edit" @click="updateRole(row)">
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.rowName}?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper , ->, sizes, total, "
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeHandler"
    />
  </el-card>
  <!--添加职位按钮触发-->
  <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="default" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!--右方抽屉-->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!--树形控件-->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqRemoveRole,
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList
} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
//当前页码
let pageNo = ref<number>(1)
//每页战士几条数据
let pageSize = ref<number>(10)
//拿到仓库数据用于重置按钮
let settingStore = useLayOutSettingStore()
//控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: ''
})
//搜索职位关键字
let keyword = ref<string>('')
//存储全部已有职位
let allRole = ref<Records>([])
//一共有多少个职位
let total = ref<number>(0)
//获取组件实例
let form = ref<any>()
//控制分配权限抽屉
let drawer = ref<boolean>(false)
//存储所有的职位数组
let menuArr = ref<MenuList>([])
//存储选择的职位节点数组
let selectArr = ref<number[]>([])
//树结构
let tree = ref<any>()

//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole()
})

//获取全部用户职位信息请求
//paper=1 ：表示如果没有传参，则默认第一页
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let res: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
  if (res.code === 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}

//下拉菜单按钮回调
const sizeHandler = () => {
  getHasRole()
}

//搜索按钮的回调
const search = () => {
  getHasRole()
  keyword.value = ''
}

//重置按钮的回调
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

//添加职位按钮回调
const addRole = () => {
  dialogVisible.value = true
  //注意先清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  })
  //清空表单校验的数据
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
//编辑职位按钮回调
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
  //同样需要清空表单校验的数据
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

//职位名字的校验函数
const validateRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//添加校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }]
}

//保存按钮回调
const save = async () => {
  //验证成功方可发送请求
  await form.value.validate()
  let res: any = await reqAddOrUpdateRole(RoleParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功'
    })
    dialogVisible.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

//分配权限按钮回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  //收集当前要分配权限的职位数据
  Object.assign(RoleParams, row)
  //根据id获取职位数据
  let res: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (res.code === 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const defaultProps = {
  children: 'children',
  label: 'name'
}

//递归遍历职位
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

//确定分配权限按钮回调
const handler = async () => {
  //职位的ID
  const roleId = RoleParams.id as number
  //选中的节点的ID
  let arr = tree.value.getCheckedKeys()
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //发送请求下发权限
  let res: any = await reqSetPermission(roleId, permissionId)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功'
    })
    window.location.reload()
  }
}

//删除职位按钮回调
const removeRole = async (id: number) => {
  let res: any = await reqRemoveRole(id)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>
<style>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
