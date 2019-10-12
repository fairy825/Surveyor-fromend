const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyId: '',
    title: '',
  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: '/pages/show/show?surveyId=' + this.data.surveyId,
      imageUrl: '../../assets/banner.jpg'
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
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(params) {
    console.log(params);
    var that = this;
    var serverUrl = app.serverUrl;
    that.setData({
      surveyId: params.surveyId
    })
    console.log(that.data.surveyId);
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
          that.setData({
            title: data.title
          })
        }
      }
    })
  }
})