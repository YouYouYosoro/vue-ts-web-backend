<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index"> {{ item }}</span>
    </div>
    <!--  盒子将来echarts展示图形图标的节点  -->
    <div class="charts" ref='charts'>123</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

let people = ref('114514人')
//引入echarts
import * as echarts from 'echarts'
//引入水球图拓展插件
import 'echarts-liquidfill'

//获取节点
let charts = ref()

onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  //设置实例的配置项
  mycharts.setOption({
    //标题组件
    title: {
      textStyle: {
        color: '#fff' //主标题颜色
      },
      left: '2%',  //位置
      text: '水球图'
    },
    // //x|y轴组件
    // xAxis:{},
    // yAxis:{},
    //系列：决定你展示什么样的图形图表
    series: {
      type: 'liquidFill', //系列
      data: [0.6, 0.4, 0.2], //展示的数据
      waveAnimation: true, //是否播放动画
      radius: '90%'  //半径大小
    },
    //布局组件
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
.box {
  background: url('../../images/dataScreen-main-lb.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      margin-top: 10px;
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url("../../images/dataScreen-title.png") no-repeat;
      background-size: 100% 100%;
    }

    .right {
      float: right;
      color: white;
      font-size: 20px;
      margin-right: 20px;

      span {
        color: orange;
        font-size: 20px;
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 50px;
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #29fcff;
      line-height: 50px;
      background: url("../../images/total.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .charts {
    width: 100%;
    height: 240px;
  }
}
</style>