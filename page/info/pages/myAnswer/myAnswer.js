const app = getApp()

Page({
  data: {
    totalPage: 1,
    page: 1,
    serverUrl: "",
    answerList: [],
  },
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '请等待',
    })
    var page = that.data.page;
    that.getMyAnswerList(page);
  },
  getMyAnswerList: function (page) {
    var that = this;
    var serverUrl = app.serverUrl;
    var userInfo = app.getGlobalUserInfo();
    wx.request({
      url: serverUrl + '/answer/queryMySurvey?userId=' + userInfo.id+'&page=' + page,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        headerUserId: userInfo.id,
        headerUserToken: userInfo.userToken
      },
      success(res) {
        console.log(res.data);
        if (res.data.status != 200) {
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
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        var status = res.data.status;
        if (page == 1) {
          that.setData({
            answerList: []
          });
        }
        var answerList = res.data.data.rows;
        var newAnswerList = that.data.answerList;

        that.setData({
          answerList: newAnswerList.concat(answerList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
      }
    })

  },
  click:function(e){
  }
  
});