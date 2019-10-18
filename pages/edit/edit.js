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
    questionList: [],
  },
  deleteQuestion: function (e) {
    var that = this;
    var serverUrl = app.serverUrl;
    console.log(e);
    wx.showModal({
      title: '是否删除',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        if (res.confirm) {
          var nowidx = e.currentTarget.dataset.idx; //当前索引

          wx.request({
            url: serverUrl + '/question/delete?id=' + nowidx,
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data);
              var status = res.data.status;
              if (status == 200) {
                wx.redirectTo({
                  url: '../edit/edit?surveyId=' + that.data.surveyId
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  checkPublish: function(e) {
    var that = this;
    var serverUrl = app.serverUrl;
    if (that.data.questionList.length) {
      wx.showModal({
        title: '保存成功',
        content: '是否立即发布',
        confirmText: "是",
        cancelText: "否",
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: serverUrl + '/survey/publish',
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
                    url: '../release/release?surveyId=' + that.data.surveyId,
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
        icon: 'none',
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
    that.getAllQuestionList(1);
    
  },
  getAllQuestionList: function (page) {
    var that = this;
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/question/queryAllEasy?surveyId=' + that.data.surveyId+'&page='+page,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
      },

      success(res) {
        console.log(res.data);
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        var status = res.data.status;
        if (page === 1) {
          that.setData({
            questionList: []
          });
        }
        console.log(res.data.data.rows);
        var questionList = res.data.data.rows;
        console.log("questionList " + questionList);

        var newQuestionList = that.data.questionList;

        that.setData({
          questionList: newQuestionList.concat(questionList),
          page: page,
          totalPage: res.data.data.total,
          serverUrl: serverUrl
        });
        console.log(that.data.questionList);
      }

    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getAllQuestionList(1);
  },
  onReachBottom: function () {
    var that = this;
    wx.showLoading({
      title: '请等待',
    })
    var currentPage = that.data.page;
    var totalPage = that.data.totalPage;
    if (currentPage == totalPage) {
      console.log("reach bottom");
      wx.hideLoading();
      return;
    }
    var page = currentPage + 1;
    that.getAllQuestionList(page);
  },
})