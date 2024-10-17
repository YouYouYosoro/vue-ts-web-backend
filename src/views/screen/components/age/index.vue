<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入echarts
import * as echarts from 'echarts'

let charts = ref()
//组件挂载完毕初始化图形图标
onMounted(() => {
  let mychart = echarts.init(charts.value)
  //设置配置项
  let option = {
    tooltip: {
      trigger: 'item'
    },
    //图例放到容器右边
    legend: {
      right: 20,
      top: 40,
      orient: 'vertical', //图例组件方向的设置
      textStyle: {
        color: 'white',
        fontSize: 16
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        //
        label: {
          show: true,
          fontSize: 16,
          position: 'inside',
          color: 'white'
        },

        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '小于10' },
          { value: 735, name: '10~20' },
          { value: 580, name: '20~30' },
          { value: 484, name: '30~40' },
          { value: 300, name: '40~50' },
          { value: 600, name: '大于50' }
        ]
      }
    ],
    //调整图形图标的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  }
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;

  .title {
    margin-top: 10px;
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }

    img {
      margin-top: 10px;
    }
  }

  .charts {
    height: 250px;
  }
}
</style>
