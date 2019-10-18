App({
  serverUrl: "http://172.31.141.20:8080",
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
