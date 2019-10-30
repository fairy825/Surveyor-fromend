var dateFormat = require('../../../utils/date.js')
var numFormat = require('../../../utils/num.js')
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
  
  getAllQuestionList: function(page) {
    var that = this;
    var serverUrl = app.serverUrl;
    var userInfo = app.getGlobalUserInfo();

    wx.request({
      url: serverUrl + '/question/queryAll?surveyId=' + that.data.surveyId + '&userId=' + userInfo.id+'&page='+page,
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
        var questionList = res.data.data.rows;

        var newQuestionList = that.data.questionList;

        that.setData({
          questionList: newQuestionList.concat(questionList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
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
    that.getAllQuestionList(1);
  },
  formsubmit(e) {
    var that = this;
    var userInfo = app.getGlobalUserInfo();
    var array = new Array();
    array = e.detail.value;
    var flag = false;
    var l = that.data.questionList.length;
    var content="";
    for (var i = 0; i < l; i++) {
      var q = that.data.questionList[i];
      var s = q.id;
      if (q.must == true && q.type!="scale"&&array[s] == "") {
        flag = true;
        content ="未回答完问卷";
        break;
      }
      if (q.type == "many"){
        if (array[s].length < q.lowlimit || array[s].length > q.uplimit){
          flag = true;
          content = "第"+(i*1+1)+"题只能选" + q.lowlimit + "-" +q.uplimit+"个选项";
          break;
        }
      }
    }
    if (flag) {
      wx.showModal({
        title: '提交失败',
        content: content,
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      var serverUrl = that.data.serverUrl;
      var surveyId = that.data.surveyId;

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
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getAllQuestionList(1) ;
  },
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '请等待',
    })
    var currentPage = that.data.page;
    var totalPage = that.data.totalPage;
    if (currentPage == totalPage) {
      wx.hideLoading();

      return;
    }
    var page = currentPage + 1;
    that.getAllQuestionList(page);
  },
})