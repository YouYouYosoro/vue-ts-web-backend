<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="用户头像" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ userStore.username }} {{ getTime() }}好呀</h3>
        <p class="subtitle">{{ setting.title }}</p>
      </div>
    </div>
  </el-card>
  <img class="background" src="@/assets/images/hutao.jpg" alt="默认展示" />
</template>

<script setup lang="ts">
//引入组合式API函数之生命周期函数
import { onMounted } from 'vue'
//获取仓库
import useUserStore from '@/store/modules/user'
//获取配置类里面的字段
import setting from '@/setting'
//引入工具里面的方法
import { getTime } from '@/utils/time'

let userStore = useUserStore()
//目前首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo()
})
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .subtitle {
      font-style: italic;
    }
  }
}
.background {
  display: block;
  margin: 0 auto; /* 水平居中 */
  width: 500px;
}
</style>
