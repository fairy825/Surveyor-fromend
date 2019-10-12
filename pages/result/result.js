import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart1(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {  
        normal: {
          show: true,
          position: 'outside',
          formatter:'{b}'+":"+'{d}'+"%",
          color:'black'
        }    
      },
      type: 'pie',
      center: ['50%', '50%'],
      // 饼状到环状
      radius: ['30%', '50%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}

function initChart2(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          show: true,
          position: 'outside',
          formatter: '{b}' + ":" + '{d}' + "%",
          color: 'black'
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      // 饼状到环状
      radius: ['0', '50%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      },
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };
  chart.setOption(option);
  return chart;
}

function getBarOption() {
  return {
    grid: {
      bottom: '20%',
      top: '25%',
      height:'50%'
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋"],
      axisLabel: {
        //横轴文字倾斜
        rotate: 45
      }
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10],
      label: {
        normal: {//标识位于柱条上方，黑色
          show: true,
          position: 'top',
          color: 'black'
        }
      },
      //柱条样式
      itemStyle: {
        color: '#37A2DA',
      },
      //柱条宽度
      barWidth: '35%'
    }]
  };
}




Page({
  // onShareAppMessage: function (res) {
  //   return {
  //     title: 'ECharts 可以在微信小程序中使用啦！',
  //     path: '/pages/index/index',
  //     success: function () { },
  //     fail: function () { }
  //   }
  // },
  data: {
    ec1: {
    },
    ec2: {  
    },
    ec3:{
      onInit: function (canvas, width, height) {
        const barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        barChart.setOption(getBarOption());

        return barChart;
      }
    },
    flag: 3
  },

  onReady() {
  },
  
  echartInit1(e) {
    initChart1(e.detail.canvas, e.detail.width, e.detail.height);
  },
  echartInit2(e) {
    initChart2(e.detail.canvas, e.detail.width, e.detail.height);
  },
  
  bindChange(e){
    this.setData({
       flag:e.target.id
    })
    console.log(this.data.flag); 
    
  }
});
