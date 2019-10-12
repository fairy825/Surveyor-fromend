App({
  serverUrl: "http://172.30.212.17:8080",
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
