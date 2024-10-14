<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default"> 搜索 </el-button>
        <el-button size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px">
    <el-button type="primary" size="default" icon="Plus" @click="addUser">添加用户</el-button>
    <el-button type="danger" size="default">批量删除</el-button>
    <!-- table展示用户信息 -->
    <el-table style="margin-top: 10px" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)"
            >分配角色</el-button
          >
          <el-button type="warning" size="small" icon="Edit" @click="updateUser(row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper, ->,sizes, total"
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!--  抽屉结构:完成添加修改业务  -->
  <el-drawer v-model="drawer">
    <template #header>
      <!-- 头部标题，将来内容应该根据点击按钮的不同而不同 -->
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 抽屉身体部分 -->
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请填写用户名字" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请填写用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请填写用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!--抽屉结构：完成分配职位业务-->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <!--显示职位的复选框-->
          <el-checkbox-group v-model="userRole" @change="handleCheckedUsersChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRole } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
//获取form组件实例
let formRef = ref<any>()

//组件挂载完毕
onMounted(() => {
  console.log('组件已挂载')
  getHasUser()
})

//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  //获取当前页码
  pageNo.value = pager
  let res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
  if (res.code == 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}
//分页器下拉菜单自定义事件的回调
const handler = () => {
  getHasUser()
}

//添加用户按钮的回调
const addUser = () => {
  //抽屉显示出来
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  //清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
    //或者直接用resetFields
    // formRef.value.resetFields
  })
}

//更新已有用户按钮的回校
const updateUser = (row: User) => {
  //抽屉显示出来
  drawer.value = true
  //存储收集已有的账号信息
  Object.assign(userParams, row)
  //清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    //或者直接用resetFields
    // formRef.value.resetFields
  })
}

//保存按钮的回调
const save = async () => {
  //点击保存，请务必保证表单全部校验通过再发请求
  await formRef.value.validate()
  //添加新的用户|更新已有的用户账户信息
  let res: any = await reqAddOrUpdateUser(userParams)
  if (res.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    //更新列表|如果有id则是修改模式，返回原先页面
    getHasUser(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新一次
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
    })
  }
}

//取消按钮的回调
const cancel = () => {
  drawer.value = false
}

//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callback: any) => {
  //用户名称|昵称
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名字长度至少五位'))
  }
}

//校验用户昵称回调函数
const validatorname = (rule: any, value: any, callback: any) => {
  //用户名称|昵称
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称长度至少五位'))
  }
}

//校验用户密码回调函数
const validatorpassword = (rule: any, value: any, callback: any) => {
  //用户名称|昵称
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码长度至少六位'))
  }
}

//表单规则的校验对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorpassword }]
}

//分配角色按钮的回调
const setRole = (row: User) => {
  //抽屉组件出来
  drawer1.value = true
  //存储已有的用户信息
  Object.assign(userParams, row)
}

//测试复选框代码
//全选复选框是否全选
let checkAll = ref<boolean>(false)
//职位表
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])

//设置不确定状态,仅负责样式控制
const isIndeterminate = ref<boolean>(false)

//全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedUsersChange = (value: string[]) => {
  //已经勾选的项目长度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

//分配职位确定按钮的回调
const confirmClick = () => {}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
