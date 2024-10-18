<template>
  <div class="box5">
    <div class="title">
      <p>未来7天游客量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="line">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入echarts
import * as echarts from 'echarts'
//获取图形图表的节点
let line = ref()
onMounted(() => {
  let mycharts = echarts.init(line.value)
  mycharts.setOption({
    // title: {
    //   text: '游客访问量趋势图'
    // },
    //x|y轴
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      //不要分割线
      splitLine: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //轴线的设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      }
    },
    yAxis: {
      //不要分割线
      splitLine: {
        show: false
      },
      //轴线的设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40,
      right: 40,
      top: 30,
      bottom: 40
    },
    //系列
    series: {
      type: 'line',
      data: [120, 999, 554, 666, 123, 1111, 567],
      //平滑曲线的设置
      smooth: true,
      //区域填充样式
      areaStyle: {
        color: {
          //线性渐变效果
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#118899' //0%处的颜色
          }, {
            offset: 1, color: '#111166' //100%处的颜色
          }],
          global: false //缺省为false
        }
      }
    }
  })
})
</script>

<style scoped>
.box5 {
  width: 100%;
  height: 100%;
  background: url("../../images/dataScreen-main-cb.png") no-repeat;
  background-size: 95% 100%;
  margin-left: 20px;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    margin-top: 20px;
    height: calc(100% - 50px);
  }
}
</style>