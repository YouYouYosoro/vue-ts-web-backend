<template>
  <el-table :data="PermissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="code" label="权限值"></el-table-column>
    <el-table-column prop="updateTime" label="修改时间"></el-table-column>
    <el-table-column label="操作" width="280px">
      <!--row:即为已有的菜单对象-->
      <template #="{ row, $index }">
        <el-button
          @click="addPermission(row)"
          type="primary"
          size="small"
          icon="Plus"
          :disabled="row.level == 4"
          >{{ row.level == 3 ? '添加功能' : '添加菜单' }}</el-button
        >
        <el-button
          @click="updatePermission(row)"
          type="warning"
          size="small"
          icon="Edit"
          :disabled="row.level == 1"
          >编辑</el-button
        >
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button type="danger" size="small" icon="Delete" :disabled="row.level === 1">
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单的名称" v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限数值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
//引入获取菜单API
import { reqAllPermission, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
//引入ts类型
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

//存储菜单的数据
let PermissionArr = ref<PermissionList>([])
//控制对话框显示隐藏
let dialogVisible = ref<boolean>(false)
//收集的添加菜单数据
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
})
//组件封装完毕
onMounted(() => {
  getHasPermission()
})

//获取菜单数据的方法
const getHasPermission = async () => {
  let res: PermissionResponseData = await reqAllPermission()
  if (res.code == 200) {
    //存储数据
    PermissionArr.value = res.data
  }
}

//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //初始化数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id as number
}

//编辑菜单按钮回调
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}

//确定保存按钮的回调
const save = async () => {
  dialogVisible.value = false
  let res: any = await reqAddOrUpdateMenu(menuData)
  if (res.code === 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功'
    })
    getHasPermission()
  }
}
//删除按钮的回调
const removeMenu = async (id: number) => {
  let res = await reqRemoveMenu(id)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasPermission()
  }
}
</script>

<style lang="scss" scoped></style>
