const fetch = require('../../utils/fetch')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ques:[],
    messages: [{
      id: 1001,
      title: '用户满意度调查',
      date: '2 September',
      summary: '本调查不会泄露您的个人信息，请放心填写',
      money: '￥0.5'
    }],
  list: [
    {
      id: '1',
      type:"one",
      question: '您的性别是',
      choices: ['男', '女']
    },
    {
      id: '2',
      type: "one",
      question: '您的年龄是',
      choices: ['18岁以下', '18-24岁', '24-30岁', '30岁以上']
    },
    {
      id: '3',
      type: "scale",
      question: '您对小程序的满意程度是',
      former: "不满意",
      latter: "满意",
      formerNum: "1",
      latterNum: "4"
    }, 
    {
      id: '4',
      type: "fill",
      question: '您对小程序的改进意见是'
    },
    {
      id: '5',
      type: "many",
      question: '您认为小程序有哪些优点',
      choices: ['简单上手', '方便快捷',"页面美观","其他"]
    }]
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  sliderChange(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  fillChange(e) {
    console.log('input发生change事件，携带value值为：', e.detail.value)
  },
  formsubmit(e){
    console.log('提交：', e);
    console.log('提交携带value值为：', e.detail.value);
    console.log( e.detail.value.name);
    var array = new Array();
    array = e.detail.value;
    console.log('array：', array);
    var i,flag=false;
    var l = this.data.list.length;
    console.log('length：', l);
    for(i=1;i<=l;i++)
    {
      var k = "array.ques["+i+"]";
      console.log(k);
      if(array[i]=="") flag=true;
    } 
    if (flag) {
      wx.showModal({
        title: '提交失败',
        content: '未回答完问卷',
        showCancel: false,
        confirmText: '确定'
      })
    }
    else {
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000
      });
      wx.redirectTo({
        url: '../messages/messages',
      })
  }
  }
})
