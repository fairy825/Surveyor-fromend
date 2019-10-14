App({
  serverUrl: "http://172.30.208.129:8080",
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
