import * as echarts from '../../resources/ec-canvas/echarts';

const app = getApp();

function initChartPie(canvas, width, height,list) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(getPieOption(list));
  return chart;
}

function initChartBar(canvas, width, height,list) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(getBarOption(list));
  return chart;
}

function getPieOption(list) {
  return {
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
      data: list,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  }
}

function getBarOption(list) {
  var xList=new Array(),yList=new Array();
  for(var i=0;i<list.length;i++){
    xList[i]=list[i].name;
    yList[i]=list[i].value;
  }
  return {
    grid: {
      bottom: '20%',
      top: '25%',
      height: '50%'
    },
    xAxis: {
      data: xList,
      axisLabel: {
        //横轴文字倾斜
        // rotate: 45
      }
    },
    yAxis: {
      minInterval: 1,
      name:'人数'
    },
    series: [{
      type: 'bar',
      data:  yList,
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
  data: {
    ec2: {
    },
    ec3: {
    },
   
  },


  onLoad: function (options) {
    var surveyId=options.surveyId
    this.getData(surveyId); //获取数据
  },

  getData: function (surveyId) {
    var that = this
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();

    var url = serverUrl + '/statistics';

    wx.request({
      url: url, 
      header: {
        'content-type': 'application/json', // 默认值
        headerUserId: user.id,
        headerUserToken: user.userToken
      },
      data: {
        surveyId: surveyId
      },
      success(res) {
  
        if (res.data.status==200) {
          var result = res.data.data
          var showPie=new Array();
          var showBar=new Array();
          var showHint = new Array();

          for (var i = 0; i < result.statisticsList.length;i++){
            showPie[i]=false;
            showBar[i]=false;
            showHint[i]=false;
          }
      
            that.setData({
              choiceList: result,
              showPie:showPie,
              showBar:showBar,
              showHint:showHint
            })
        

        } else {

          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
            success: function () {
              setTimeout(function () {
                wx.reLaunch({
                  url: '/page/tabBar/login/login',
                })
              }, 2000);
            }
          })
        }
      }
    })

  },

  onReady() {
  },

  echartInit2(e) {
    var list=e.target.dataset.list
    initChartPie(e.detail.canvas, e.detail.width, e.detail.height,list);
  },
  echartInit3(e) {
    var list = e.target.dataset.list
    initChartBar(e.detail.canvas, e.detail.width, e.detail.height,list);
  },

  bindBar(e) {
    var index=e.target.dataset.index
    // 更改数组的某一项的值
    var showp = 'showPie[' + index + ']';
    var showb = 'showBar[' + index + ']';

    if (this.data.showBar[index]) {
      this.setData({
        [showb]: false
      })
    } else {
      this.setData({
        [showp]: false,
        [showb]: true
      })
    }
  },

  bindPie(e) {
    var index = e.target.dataset.index
    // 更改数组的某一项的值
    var showp = 'showPie[' + index + ']';
    var showb = 'showBar[' + index + ']';
    if (this.data.showPie[index]) {
      this.setData({
        [showp]: false
      })
    } else {
      this.setData({
        [showb]: false,
        [showp]: true
      })
    }
  },

  bindHint(e) {
    var index = e.target.dataset.index
    // 更改数组的某一项的值
    var showHint = 'showHint[' + index + ']';
    var result = this.data.showHint[index];
      this.setData({
        [showHint]: !result
      })
  },

  bindContent(e) {
    // var that=this
    var index = e.target.dataset.index
    var choiceList = this.data.choiceList;
    choiceList.statisticsList[index].status = !choiceList.statisticsList[index].status
    this.setData({
      choiceList:choiceList
    })
  },
  cal(num){
    return num.toFixed(2)
  }

});
