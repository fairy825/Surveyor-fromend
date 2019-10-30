const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      { icon: '/assets/index/write.png', text: '发布问卷', type: 'navigate',url: '/page/create/pages/beforeCreate/beforeCreate' },
      { icon: '/assets/index/显示.png', text: '回答问卷', type: 'switchTab', url: '/page/tabBar/messages/messages' },
      { icon: '/assets/index/person.png', text: '个人中心', type: 'switchTab',url: '/page/tabBar/profile/profile' },
      { icon: '/assets/index/钱包.png', text: '我的钱包', type: 'navigate',  url: '/page/info/pages/myPacket/myPacket'},
      { icon: '/assets/index/数据图.png', text: '我的问卷', type: 'navigate',  url: '/page/info/pages/myQuest/myQuest'},
      { icon: '/assets/index/文本.png', text: '我的答卷', type: 'navigate',  url: '/page/info/pages/myAnswer/myAnswer'},  
    ],
    imgUrls: [
      '/assets/banner1.jpg',
      '/assets/banner2.jpg',
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
 
  },
  login() {
    const that = this
    wx.login({
      success() {
        app.globalData.hasLogin = true
        that.setData({
          hasLogin: true
        })
      },
      fail(){
      }
    })
  }
})
