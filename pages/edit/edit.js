const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    surveyId: '',
    title: "",
    description: "",
    // question: [],
    // topic:"用户满意度调查",
    // detail:"感谢您的填写！",
    questions: [],
  },
  checkPublish: function(e) {
    var that = this;
    var serverUrl = app.serverUrl;
    if (that.data.questions.length) {
      wx.showModal({
        title: '保存成功',
        content: '是否立即发布',
        confirmText: "是",
        cancelText: "否",
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: serverUrl + '/survey/update',
              method: 'POST',
              header: {
                'content-type': 'application/json', // 默认值
              },
              data: {
                id: that.data.surveyId,
                status: 1
              },
              success(res) {
                console.log("update:");
                console.log(res.data.data);
                var status = res.data.status;
                if (status == 200) {

                  wx.reLaunch({
                    url: '../release/release?surveyId=' + res.data.data.id,
                  })
                }
              }
            })
          } 
        }
      })
    } else {
      wx.showToast({
        title: '缺少题目',
        icon: 'alert',
        duration: 1000
      });
    }
  },
  onLoad: function(params) {
    var that = this;
    that.setData({
      surveyId: params.surveyId,
    })
    var surveyId = that.data.surveyId;
    var serverUrl = app.serverUrl;
    console.log("surveyId in edit:" + surveyId);

    wx.request({
      url: serverUrl + '/survey/queryOne?surveyId=' + surveyId,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        var status = res.data.status;
        if (status == 200) {
          var data = res.data.data;
          that.setData({
            title: data.title,
            description: data.description,
          })
        }
      }
    })
    wx.request({
      url: serverUrl + '/question/queryAll?surveyId=' + surveyId,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },
      success(res) {
        var status = res.data.status;
        if (status == 200) {
          var data = res.data.data;
          that.setData({
            questions: data,
          })
          console.log(that.data.questions);

        }
      }
    })
  },
})