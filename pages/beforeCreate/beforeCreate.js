var dateFormat = require('../../utils/date.js')
var numFormat = require('../../utils/num.js')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    surveyId: '',
    title: "",
    description: "",
    // needpaper: 0,
    anony:false,
    testlie:false,
    serverUrl: "",
    hidden1: true,
    hidden2: true,
    date: dateFormat.formatDate(new Date()),
    nowTime: dateFormat.formatTimeNew(new Date()),
    // price:'',
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange(e) {
    this.setData({
      nowTime: e.detail.value
    })
  },
  haveduetime(e) {
    var that = this;
    that.setData({
      hidden1: !that.data.hidden1
    })
  },
  haveredbag(e) {
    var that = this;
    that.setData({
      hidden2: !that.data.hidden2
    })
  },

  formsubmit(e) {
    var that = this;
    console.log(e);

    var title = e.detail.value.title;
    var needpaper = e.detail.value.needpaper;
    if (title.length == 0 || needpaper.length == 0) {
      wx.showModal({
        title: '创建失败',
        content: '请填写完整',
        showCancel: false,
        confirmText: '确定'
      })
    } else if (needpaper == '0') {
      wx.showModal({
        title: '创建失败',
        content: '请填写问卷份数',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      var serverUrl = app.serverUrl;
      var userInfo = app.getGlobalUserInfo();
      wx.showLoading({
        title: '请等待',
      })
    
      var description = e.detail.value.description;
      var anony = e.detail.value.anony;
      var testlie = e.detail.value.testlie;
      var mintime = e.detail.value.mintime;
      var date = e.detail.value.date;
      var nowTime = e.detail.value.nowTime;
      var price;
      var surveyId = that.data.surveyId;
      var v = date +" "+ nowTime;
      var d=null;
      if (that.data.hidden1 != true) {
        d = v;
      }
      if (that.data.hidden2 == true){
        price = 0;
      }else{
        price = e.detail.value.price;
      }
      if (surveyId == null || surveyId == '' || surveyId == undefined) {
        wx.request({
          url: serverUrl + '/survey/add?userId=' + userInfo.id,
          method: 'POST',
          data: {
            title: title,
            description: description,
            price: price,
            needpaper: needpaper,
            anony: anony,
            testlie: testlie,
            endTime: d,
            mintime:mintime,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data);
            wx.hideLoading();
            var status = res.data.status;
            if (status == 200) {
              wx.showToast({
                title: '创建成功',
                icon: 'success',
                duration: 1000
              });
              var surveyId = res.data.data;
              that.setData({
                surveyId: surveyId
              })
              wx.redirectTo({
                url: '../edit/edit?surveyId=' + surveyId,
              })
            } else if (status == 502) {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              });
              wx.redirectTo({
                url: '../login/login',
              })
            } else {
              wx.showToast({
                title: '创建失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      } else {
        wx.request({
          url: serverUrl + '/survey/update?surveyId=' + surveyId,
          method: 'POST',
          data: {
            id: surveyId,
            title: title,
            description: description,
            price: price,
            needpaper: needpaper,
            anony: anony,
            testlie: testlie,
            endTime:d,
            mintime: mintime,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log("/survey/update");
            console.log(res.data);
            wx.hideLoading();
            var status = res.data.status;
            if (status == 200) {
              wx.redirectTo({
                url: '../edit/edit?surveyId=' + res.data.data.id,
              })
            } else if (status == 502) {
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              });
              wx.redirectTo({
                url: '../login/login',
              })
            } else {
              wx.showToast({
                title: '创建失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }
    }
  },
  onLoad: function(params) {
    var that = this;
    // var date = 
    that.setData({
      surveyId: params.surveyId,
      serverUrl: app.serverUrl,
      // date:date,
      // nowTime:time,
      // price: numFormat.formatMoney(that.data.price)
    })
    var surveyId = that.data.surveyId;
    var serverUrl = that.data.serverUrl;
    console.log("surveyId:" + surveyId)
    if (surveyId != null && surveyId != '' && surveyId != undefined) {

    wx.request({
      url: serverUrl + '/survey/queryOne?surveyId=' + surveyId,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        var status = res.data.status;
        if (status == 200) {
          var data = res.data.data;
          var date,time;
          if (data.endTime!=null&&data.endTime!=undefined&&data.endTime!=""){
            date = dateFormat.formatDate(data.endTime);
            time = dateFormat.formatTimeNew(data.endTime);
          }
          that.setData({
            title: data.title,
            description: data.description,
            needpaper: data.needpaper,
            testlie: data.testlie,
            anony: data.anony,
            price: numFormat.formatMoney(data.price),
            date: date,
            nowTime: time,

          })
          var hidden1 = that.data.hidden1;
          var hidden2 = hidden2;
          if (data.price == 0) {
            hidden2 = true;
          } else {
            hidden2 = false;
          }
          if (data.endTime == "1970-01-01T00:00:00.000+0000" || data.endTime == undefined || data.endTime == "" || data.endTime == " " || data.endTime == null) {
            hidden1 = true;
          } else {
            hidden1 = false;
          }
          that.setData({
            hidden1: hidden1,
            hidden2: hidden2
          })
        } else {
          wx.showToast({
            title: '出错啦',
            icon: 'none',
            duration: 1000
          })
          wx.navigateBack({
            delta: 1
          })
        }
      },

    })
    }
  }
})