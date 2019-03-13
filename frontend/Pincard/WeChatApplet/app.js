//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.setStorageSync('flowid', '595da1175f0facac1c227cfc');
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (r) {
          var appid = 'wxb1a1e1b7a1e04299'; 
          var secret = 'fa25fe4cce76295c9a2e50867e437ff8';
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
          // 获取用户openid
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&grant_type=authorization_code',
            data: {
              'js_code': r.code
            },
            method: 'GET',
            success: function (res) {
              console.log(res);
              wx.setStorageSync('openId', res.data.openid);
      //         wx.navigateTo({
      // url: '/pages/login/login',
      // success: function (res) {
      // },
      // fail: function () {
      // },
      // complete: function () {       
      // }
    // })
            }
          });
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    url:"http://192.168.6.22:1337/"
  }
})