const app = getApp()

Page({
  data: {
    surveyId: '',
    questionId: '',
    hide: false,
    hidden1: false,
    hidden2: false,
    choiceNum: 2,
    type: "",
    array: [1, 1], //默认显示一个
    inputVal: [], //所有input的内容
    choices: ["0", "1", "2"],
    uplimit: 0,
    lowlimit: 0,
    scores: ["5", "6", "7", "8", "9", "10"],
    scoreIndex: 0,
    upscale: 0,
    content: '',
    must: true,
  },
  onLoad: function(params) {
    var that = this;
    var surveyId = params.surveyId;
    var serverUrl = app.serverUrl;
    var questionId = params.questionId;
    if (surveyId != null && surveyId != undefined && surveyId != '') {
      that.setData({
        surveyId: surveyId,
        questionId: questionId
      })
    } else {
      that.setData({
        surveyId: surveyId,
        questionId: questionId
      })
      wx.request({
        url: serverUrl + '/question/queryOne?questionId=' + questionId,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
        },
        success(res) {
          console.log(res.data);
          var data = res.data.data;
          var val = [];
          var choicea = data.choicea;
          if (choicea != "" && choicea != undefined && choicea != null) val.push(choicea);
          var choiceb = data.choiceb;
          if (choiceb != "" && choiceb != undefined && choiceb != null) val.push(choiceb);
          var choicec = data.choicec;
          if (choicec != "" && choicec != undefined && choicec != null) val.push(choicec);
          var choiced = data.choiced;
          if (choiced != "" && choiced != undefined && choiced != null) val.push(choiced);
          var choicee = data.choicee;
          if (choicee != "" && choicee != undefined && choicee != null) val.push(choicee);

          that.setData({
            inputVal: val,
            surveyId: data.surveyid,
            content: data.content,
            type: data.type,
            must: data.must,
            upscale: data.upscale,
            lowlimit: data.lowlimit,
            uplimit: data.uplimit,
            scoreIndex: data.upscale * 1 - 5,
          })
          var hide = false;
          var inputVal = that.data.inputVal;
          var choices = ['0'];
          var choiceNum = inputVal.length;
          var array = [];
          for (var i = 0; i < choiceNum; i++) {
            if (inputVal[i] == '其他') {
              hide = true;
              array.push(2);
            } else {
              array.push(1);
            }
            choices.push(i + 1);
          }
          that.setData({
            hide: hide,
            choiceNum: choiceNum,
            array: array,
            choices: choices
          })
        }

      })
    }
  },
  bindSwitchChange: function(e) {
    var that = this;
    that.setData({
      must: e.detail.value
    })
    if (that.data.must == true && that.data.type == "many") {
      var lowlimit = that.data.lowlimit;
      if (lowlimit == 0) {
        lowlimit = 1;
        wx.showToast({
          title: '多选题作为必答题时最少要选择一个选项',
          icon: 'none',
          duration: 1000
        });
        that.setData({
          lowlimit: lowlimit
        })
      }
    }
  },
  //获取input的值
  getInputVal: function(e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    var val = e.detail.value; //获取输入的值
    var oldVal = this.data.inputVal;
    oldVal[nowIdx] = val; //修改对应索引值的内容
    this.setData({
      inputVal: oldVal
    })
  },
  //添加input
  addInput: function() {
    var old = this.data.array;
    old.push(1); //这里不管push什么，只要数组长度增加1就行
    this.setData({
      array: old,
      choiceNum: this.data.choiceNum + 1,
    })
    this.data.choices.push(this.data.choiceNum.toString());
  },
  addblank: function(e) {
    var old = this.data.array;
    old.push(2);
    this.setData({
      array: old,
      choiceNum: this.data.choiceNum + 1,
      hide: true
    })
    var nowIdx = this.data.choiceNum - 1;
    var oldVal = this.data.inputVal;
    oldVal[nowIdx] = "其他"; //修改对应索引值的内容
    this.setData({
      inputVal: oldVal
    })
  },

  //删除input
  delInput: function(e) {
    var nowidx = e.currentTarget.dataset.idx; //当前索引
    var oldInputVal = this.data.inputVal; //所有的input值
    var oldarr = this.data.array; //循环内容
    oldarr.splice(nowidx, 1); //删除当前索引的内容，这样就能删除view了
    oldInputVal.splice(nowidx, 1); //view删除了对应的input值也要删掉
    this.data.choices.pop();
    this.setData({
      choiceNum: this.data.choiceNum - 1,
      array: oldarr,
      inputVal: oldInputVal
    })
  },
  bindChoiceMinChange: function(e) {
    var that = this;
    that.setData({
      lowlimit: e.detail.value
    })
    if(that.data.must==true&&that.data.type=="many"&&that.data.lowlimit==0){
      var lowlimit = 1;
      wx.showToast({
        title: '多选题作为必答题时最少要选择一个选项',
        icon: 'none',
        duration: 1000
      });
      that.setData({
        lowlimit: lowlimit
      })
    }
  },
  bindChoiceMaxChange: function(e) {
    this.setData({
      uplimit: e.detail.value
    })
  },

  bindScoreChange: function(e) {
    this.setData({
      scoreIndex: e.detail.value
    });
  },
  showans: function(e) {
    var type = e.detail.value;
    this.setData({
      type: type
    })
  },
  formsubmit(e) {
    var option = e.detail.value.option;
    var that = this;
    var surveyId = that.data.surveyId;
    var flag = false;
    var content = e.detail.value.content;
    var must = e.detail.value.must;
    var qtype = e.detail.value.type;
    var scoreIndex = e.detail.value.scoreIndex;
    var msg = "";

    if (!content.length) {
      msg = '未填写问题';
    } else if (!qtype.length) {
      msg = '未选择题目类型';
    } else if ((qtype == "one" || qtype == "many") && that.data.choiceNum >= 2) {
      var i;
      var choiceNum2 = that.data.choiceNum;
      var oldVal = that.data.inputVal;
      for (i = 0; i < choiceNum2; i++)
        if (oldVal[i] == null || !oldVal[i].length) {
          msg = '选项未填写完整';
          break;
        }
    } else if ((qtype == "one" || qtype == "many") && that.data.choiceNum < 2) {
      msg = '缺少选项';
    }


    var questionId = that.data.questionId;
    if (msg == "") {
      var serverUrl = app.serverUrl;
      var upscale = that.data.scoreIndex * 1 + 5;
      var lowlimit = that.data.lowlimit;
      var uplimit = that.data.uplimit;
      var choicea = that.data.inputVal[0];
      var choiceb = that.data.inputVal[1];
      var choicec = that.data.inputVal[2];
      var choiced = that.data.inputVal[3];
      var choicee = that.data.inputVal[4];

      if (questionId == null || questionId == '' || questionId == undefined) {
        wx.request({
          url: serverUrl + '/question/add?surveyId=' + surveyId,
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
          },
          data: {
            content: content,
            type: qtype,
            must: must,
            choicea: choicea,
            choiceb: choiceb,
            choicec: choicec,
            choiced: choiced,
            choicee: choicee,
            upscale: upscale,
            lowlimit: lowlimit,
            uplimit: uplimit,
          },
          success(res) {
            console.log(res.data);
            var status = res.data.status;
            if (status == 200) {
              var data = res.data.data;
              wx.showToast({
                title: '已完成',
                icon: 'success',
                duration: 1000
              });
              wx.redirectTo({
                url: '../edit/edit?surveyId=' + surveyId,
              })
            } else {
              wx.showModal({
                title: '创建失败',
                showCancel: false,
                confirmText: '确定'
              })
            }
          }
        })
      } else {
        wx.request({
          url: serverUrl + '/question/update',
          method: 'POST',
          header: {
            'content-type': 'application/json', // 默认值
          },
          data: {
            id: questionId,
            content: content,
            type: qtype,
            must: must,
            choicea: choicea,
            choiceb: choiceb,
            choicec: choicec,
            choiced: choiced,
            choicee: choicee,
            upscale: upscale,
            lowlimit: lowlimit,
            uplimit: uplimit,
          },
          success(res) {
            console.log(res.data);
            var status = res.data.status;
            if (status == 200) {
              var data = res.data.data;
              wx.showToast({
                title: '已完成',
                icon: 'success',
                duration: 1000
              });
              wx.redirectTo({
                url: '../edit/edit?surveyId=' + surveyId,
              })

            } else {
              wx.showModal({
                title: '创建失败',
                content: msg,
                showCancel: false,
                confirmText: '确定'
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '创建失败',
        content: msg,
        showCancel: false,
        confirmText: '确定'
      })
    }
  }
})