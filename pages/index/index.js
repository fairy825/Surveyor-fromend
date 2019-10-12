const fetch = require('../../utils/fetch')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // slides: [],
    categories: [
      { icon: '/assets/index/write.png', text: '发布问卷', type:'navigate', name: 'beforeCreate' },
      { icon: '/assets/index/显示.png', text: '回答问卷', type: 'switchTab', name: 'messages' },
      { icon: '/assets/index/person.png', text: '个人中心', type: 'switchTab',name: 'profile' },
      { icon: '/assets/index/钱包.png', text: '我的钱包', type: 'navigate',name: 'myPacket' },
      { icon: '/assets/index/数据图.png', text: '我的问卷', type: 'navigate', name: 'myQuest' },
      { icon: '/assets/index/文本.png', text: '我的答卷', type: 'navigate',name: 'myAnswer' },  
    ],
    imgUrls: [
      '../../assets/banner.jpg',
      '../../assets/banner.jpg',
      '../../assets/banner.jpg'
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
  },
  login() {
    const that = this
    console.log(app.globalData.hasLogin)
    wx.login({
      success() {
        app.globalData.hasLogin = true
        that.setData({
          hasLogin: true
        })
      },
      fail(){
        console.log("登录失败")
      }
    })
  }
})
