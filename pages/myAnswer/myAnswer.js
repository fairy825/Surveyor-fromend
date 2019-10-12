const app = getApp()

Page({
  data: {
    totalPage: 1,
    page: 1,
    serverUrl: "",
    answerList: [],
    // messages: [{
    //   id: 1001,
    //   title: '用户满意度调查',
    //   state: "已到账",
    //   money: '0.5元'
    // },
    
    // {
    //   id: 1004,
    //   title: '关于物流行业无人化技术应用的调查',
    //   state: "被拒绝",
    //   money: '2元'
    // }
    // ]
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
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        var status = res.data.status;
        if (page === 1) {
          that.setData({
            answerList: []
          });
        }
        console.log(res.data.data.rows);
        var answerList = res.data.data.rows;
        console.log("answerList " + answerList);

        var newAnswerList = that.data.answerList;

        that.setData({
          answerList: newAnswerList.concat(answerList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
        console.log(that.data.answerList);
      }
    })

  },
  click:function(e){
    console.log(e);
  }
  
});