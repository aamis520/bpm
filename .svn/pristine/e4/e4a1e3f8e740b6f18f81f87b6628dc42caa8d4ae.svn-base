Page({
    data:{
        userName:"",
        passWord:"",
        openid:"",
        url: getApp().globalData.url
    },            
    onLoad:function(){//加载后做判断的
      var that = this;   
    },
    login:function(time){
      var that = this;
      wx.login({ 
        success: function (res) {
          that.data.openid = wx.getStorageSync("openid");
          wx.request({
            url: that.data.url + 'login/login',
            data: {
              loginname: that.data.userName,
              password: that.data.passWord,
              openid:that.data.openid
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            success: function (res) {       
              if(res.data.error){
                wx.showToast({
                  title: '登陆失败，请重试',
                  icon: 'loading',
                  duration: 1000,
                  mask: true
                });
              } else {
                wx.setStorageSync('userName', that.data.userName);
                wx.setStorageSync('usrid', res.data.usrid);
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            }
          });
        }
      });
    },
    listenUser: function(e) {//监控用户名
        this.data.userName = e.detail.value;
    },
    listenPwd: function(e) {//监控密码
        this.data.passWord = e.detail.value;
    },
 
})