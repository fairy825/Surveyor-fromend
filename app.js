App({
  serverUrl: "http://192.168.2.234:8080",
  userInfo: null,
  isSaveRecord:null,
  search:null,
  sort:null,
  setGlobalUserInfo: function (user) {
    wx.setStorageSync("userInfo", user);
  },
  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  }
})
