const app = getApp()

Page({

  data: {
    surveyId: '',
    surveyInfo:{},
    tip:{},
    logo:'/assets/logo.jpg',
  },
  onShareAppMessage() {
    return {
      title: this.data.surveyInfo.title,
      path: '/page/tabBar/show/show?surveyInfo=' + this.data.info,
      imageUrl: '/assets/banner2.jpg'
    }
  },

  handleTapShareButton() {
    if (!((typeof wx.canIUse === 'function') && wx.canIUse('button.open-type.share'))) {
      wx.showModal({
        title: '当前版本不支持转发按钮',
        content: '请升级至最新版本微信客户端',
        showCancel: false
      })
    }
  },

  bindChange() {
    wx.switchTab({
      url: '/page/tabBar/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    var that = this;
    var serverUrl = app.serverUrl;
    that.setData({
      surveyId: params.surveyId
    })
    wx.request({
      url: serverUrl + '/survey/queryOne?surveyId=' + params.surveyId,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        var status = res.data.status;
        if (status == 200) {
          var data = res.data.data;
          var info = JSON.stringify(data);
          that.setData({
            surveyInfo: data,
            info:info
          })
        }
        console.log(that.data.surveyInfo);
      }
    })
    wx.request({
      url: serverUrl + '/survey/getTip',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        var status = res.data.status;
        if (status == 200) {
          var data = res.data.data;
          that.setData({
            tip: data
          })
        }
      }
    })
  }
})