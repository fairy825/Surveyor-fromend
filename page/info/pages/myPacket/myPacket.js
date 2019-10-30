var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: { 
        flag:1,
        remain:"12345.67",
        withdraw:"",
        hidden:true
    },
    checksubmit:function(e){
    if(!this.data.hidden)
      wx.showModal({
        title: '提现失败',
        content: '账户余额不足',
        showCancel: false,
        confirmText: '确定'
      })
    },
  allsubmit:function(e){
    console.log(e);
    this.setData({
      withdraw:this.data.remain,
      hidden:true
    })
    if (this.data.remain!="0.00"){
      this.setData({
        flag:0
      })
    }
  },
  checksum:function(e){
    console.log(e);
    console.log(e.detail.value.length);
    var input = e.detail.value;
    var hide;
      this.setData({
        flag: !parseFloat(input)
      })
    if(input.length){
     if(parseInt(input)>this.data.remain){
        hide = false
     }
     else{
       hide = true
     }
      this.setData({
        hidden:hide
      })
    }
    else{
      this.setData({
        hidden:true
      })
    }
    },
  

    onLoad: function (e) {

    }
});