<template>
  <div class="box4" ref="map">
    地图组件
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
//组件挂载
onMounted(() => {
  let mycharts = echarts.init(map.value)
  //设置配置项
  mycharts.setOption({
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的效果
      //位置调整
      left: 50,
      top: 100,
      right: 50,
      bottom: -150,
      //地图上的文字的设置
      label: {
        show: true, //设置文字显示
        color: 'white',
        fontsize: 20
      },
      //每一个多边形的样式
      itemStyle: {
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
        },
        //透明度
        opacity: 0.8
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: '#29fcff'
        },
        label: {
          show: true,
          fontSize: 30
        }
      }
    },
    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    //路线图
    series: [
      {
        type: 'lines',//航线系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], //起点坐标
              [101.778916, 36.623178]// 终点坐标
            ],
            //统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 2
            }
          },
          {
            coords: [
              [116.405285, 39.904989], //起点坐标
              [91.132212, 29.660361]// 终点坐标
            ],
            //统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 2
            }
          },
          {
            coords: [
              [114.298572, 30.584355],// 起点坐标
              [113.665412, 34.757975] // 终点坐标
            ],
            //统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 2
            }
          },
          {
            coords: [
              [117.283042, 31.86119], //起点坐标
              [119.306239, 26.075302]// 终点坐标
            ],
            //统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 2
            }
          },
          {
            coords: [
              [113.665412, 34.757975], //起点坐标
              [104.065735, 30.659462]// 终点坐标
            ],
            //统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 2
            }
          }
        ],
        //是否显示特效
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'red',
          symbolSize: 10
        }
      }
    ]
  })
})
</script>

<style scoped>

</style>