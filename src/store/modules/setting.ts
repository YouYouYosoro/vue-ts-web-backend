//小仓库：layout组件配置相关的仓库
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用户控制菜单折叠还是收起控制
      refresh: false //仓库这个属性用于控制刷新效果
    }
  }
})

export default useLayoutSettingStore
