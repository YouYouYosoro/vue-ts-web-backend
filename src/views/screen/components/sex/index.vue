<template>
  <div class="box1">
    <div class="title">
      <p>性别比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="">
      </div>
      <div class="woman">
        <img src="../../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p>男士占比</p>
      <p>女士占比</p>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
//引入echarts组件库
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

//获取图形图标的DOM节点
let charts = ref()
//页面挂载完毕初始化
onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value)
  //设置配置项
  mycharts.setOption({
    //x|y
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'//代表在y轴上均匀分布
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        //调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20
        }
      }
    ],
    grid: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0

    }
  })
})
</script>

<style scoped lang="scss">
.box1 {
  width: 100%;
  height: 100%;
  background: url("../../images/dataScreen-main-cb.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

  .title {
    margin-top: 10px;
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .sex {
    display: flex;
    justify-content: center;

    .man {
      margin: 30px;
      width: 111px;
      height: 116px;
      background: url("../../images/man-bg.png");
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .woman {
      margin: 30px;
      width: 111px;
      height: 116px;
      background: url("../../images/woman-bg.png");
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    color: white;
  }

  .charts {
    height: 40px;
  }
}
</style>