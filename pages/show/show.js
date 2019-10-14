var dateFormat = require('../../utils/date.js')
var numFormat = require('../../utils/num.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ques: [],
    surveyInfo: {},
    surveyId: '',
    title: '',
    date: '',
    description: '',
    money: '',
    questionList: [],
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  sliderChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  fillChange(e) {
    console.log('input发生change事件，携带value值为：', e.detail.value)
  },
  getAllQuestionList: function(page) {
    var that = this;
    var serverUrl = app.serverUrl;
    var userInfo = app.getGlobalUserInfo();

    wx.request({
      url: serverUrl + '/question/queryAll?surveyId=' + that.data.surveyId + '&userId=' + userInfo.id,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },

      success(res) {
        console.log(res.data);
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        var status = res.data.status;
        if (page === 1) {
          that.setData({
            questionList: []
          });
        }
        console.log(res.data.data.rows);
        var questionList = res.data.data.rows;
        console.log("questionList " + questionList);

        var newQuestionList = that.data.questionList;

        that.setData({
          questionList: newQuestionList.concat(questionList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
        console.log(that.data.questionList);
      }

    })
  },
  onLoad: function(params) {
    var that = this;
    var surveyInfo = JSON.parse(params.surveyInfo);
    that.setData({
      surveyId: surveyInfo.id,
      serverUrl: app.serverUrl,
      surveyInfo: surveyInfo,
    })

    var surveyId = that.data.surveyId;
    var serverUrl = that.data.serverUrl;
    console.log("surveyId:" + surveyId)
    that.getAllQuestionList(1);
  },
  formsubmit(e) {
    var that = this;
    console.log('提交：', e);
    console.log('提交携带value值为：', e.detail.value);
    var userInfo = app.getGlobalUserInfo();
    var array = new Array();
    array = e.detail.value;
    var flag = false;
    var l = that.data.questionList.length;
    // debugger;
    // console.log(array."190928BNFBH68940");
    // console.log(array.190928BNFBH68940);

    for (var i = 0; i < l; i++) {
      var q = that.data.questionList[i];
      var s = q.id;
      if (q.must == true && array[s] == "") {
        flag = true;
        break;
      }
    }
    if (flag) {
      wx.showModal({
        title: '提交失败',
        content: '未回答完问卷',
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      var serverUrl = that.data.serverUrl;
      var surveyId = that.data.surveyId;
      // var answ = JSON.stringify(array);
      console.log("array");
      console.log(array);

      wx.request({
        url: serverUrl + '/answer/upload?userId=' + userInfo.id + '&surveyId=' + surveyId,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        data: {
          answ: array
        },
        success(res) {
          console.log(res.data);
          var status = res.data.status;
          if (status == 200) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000,
                success: function() {
                  setTimeout(function() {
                    //要延时执行的代码
                    wx.switchTab({
                      url: '../messages/messages',
                    })
                  }, 2000) //延迟时间
                }
              })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              success: function () {
                console.log('haha');
                setTimeout(function () {
                  //要延时执行的代码
                  wx.switchTab({
                    url: '../messages/messages',
                  })
                }, 2000) 
              }
            });
           
          }
        }
      })
    }
  }
})