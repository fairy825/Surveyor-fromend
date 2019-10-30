const app = getApp()

Page({
  data: {
  },
  onLoad: function (params) {
    var that = this;
    var redirectUrl = params.redirectUrl;

    if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
      redirectUrl = redirectUrl.replace(/#/g, "?");
      redirectUrl = redirectUrl.replace(/@/g, "=");

      that.redirectUrl = redirectUrl;
    }
  },

  doLogin: function (e) {
    var that = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;

    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none'
      })
    }
    else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待',
      })
      wx.request({
        url: serverUrl + '/login',
        method: 'POST',
        data: { 
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
          wx.hideLoading();
          var status = res.data.status;
          if (status == 200) {
            wx.showToast({
              title: '登录成功！',
              icon: 'success',
              duration: 3000
            })
            //app.userInfo = res.data.data;
            app.setGlobalUserInfo(res.data.data);
            var redirectUrl = that.redirectUrl;
            if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
              wx.navigateTo({
                url: redirectUrl,
              })
            } else {
              wx.switchTab({
                url: '../index/index',
              })

            }
          } else if (status == 500) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  goRegistPage: function () {
    wx.redirectTo({
      url: '../regist/regist',
    })
  }
})