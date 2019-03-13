//index.js
//获取应用实例
var util = require('../../utils/util.js');
var app = getApp();
var now = new Date();
Page({
  data: {
    userInfo: {},//用户信息，用getUserInfo调取
    nowTime:{//当前时间
      hm:formatNumber(formatTime(now,0)),
      ymd:formatNumber(formatTime(now,1))
    }, 
    url: getApp().globalData.url,//请求的地址
    company: {//公司信息（上下班时间，经纬度，范围）
      ontime: '',
      offtime: '',
      latitude: "",
      longitude: "",
      //latitude: "23.129163",
      //longitude: "113.264435",
      //latitude: "39.939409",
      //longitude: "116.426180",
      signRang:""
    },
    on: {//上班打卡信息
      "time": "",//时间
      "type": "",//是否迟到或者是早退
      "range": ""//是否是外勤
    },
    off: {//下班打卡信息
      "time": "",
      "type": "",
      "range": ""
    },
    itemid:'',//打过卡的标记
    range:''//是否是外勤
  },
  bindViewTap: function () {//事件处理函数---不知道干什么用的
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  refreshTimeAndLocation:function(){//不停的刷新时间3秒一次就可以了
    var that = this;
    setInterval(function(){
      that.updateDistant();
      that.setData({
        nowTime: {
          "hm": formatNumber(formatTime(new Date(),0)),
          "ymd": formatNumber(formatTime(new Date(),1))
        }
      });
    },3000);
  },
  onLoad: function(){  //应用加载进来的时候执行
    var that = this; 
    that.refreshTimeAndLocation();
    wx.login({
      success: function (res) { 
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appId:"wxb1a1e1b7a1e04299",
            secret:"fa25fe4cce76295c9a2e50867e437ff8",
            js_code:res.code,
            grant_type:"authorization_code"
          },
          success:function(res){
            wx.setStorageSync("openid", res.data.openid);
            if (!wx.getStorageSync('userName')){  //如果没有登录名
              wx.navigateTo({
                url: '/pages/login/login',
                success: function (res) {}
              });      
            } else {
              wx.request({
                url: that.data.url + 'login/login',
                data: {
                  loginname: wx.getStorageSync('userName'),
                  openid: res.data.openid,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: "POST",
                success: function (res) {
                  if (res.data.error) {
                    wx.showToast({
                      title: '登陆失败，请重试',
                      icon: 'loading',
                      duration: 1000,
                      mask: true
                    });
                    wx.navigateTo({
                      url: '/pages/login/login'
                    }); 
                  } else {
                    wx.setStorageSync('usrid', res.data.usrid);
                  }
                }
              });
            }
          }
        });
      }
    });
    that.updateDistant();//判断是否是外勤
    that.getTodyData();//获得今天的信息
    wx.getUserInfo({  //调用应用实例的方法获取全局数据
      that:this,  
      withCredentials:true,
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        });
      }
    });
  },
  getTodyData:function(){   //把今天的打卡数据放到on和off中去
    var that= this;
    //在这里获取usrd，floeid，nodeid
    wx.setStorageSync('nodeid', "kaishi");
    wx.setStorageSync('flowid', "59b733f63a8b6bd51ba07272");
    wx.request({
      url: that.data.url + "flow/listsks",
      data: {
        usrid: wx.getStorageSync('usrid'),
        flowid: wx.getStorageSync('flowid'),
        nodeid: wx.getStorageSync('nodeid'),
        isshowflowdata: true
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        var companys = res.data.data[res.data.data.length-1];//今天的打卡信息
        var tody = formatNumber(formatTime(new Date(), 1));
        if (companys.date == tody){ // 没有信息就是今天一次也没打卡呢
          that.setData({
            on: {
              'time': companys.shangwudakashijian,
              'type': companys.shangwudakazhuangtai,
              'range': companys.shangwudakafanwei
            },
            off: {
              'time': companys.xiawudakashijian,
              'type': companys.xiawudakazhuangtai,
              'range': companys.xiawudakafanwei
            },
            itemid: companys.id
          });
        }
        wx.request({
          url: that.data.url + 'flow/listsks',
          data: {
            flowid: "59b7828452cb6f4526ae5582",
            usrid: wx.getStorageSync('usrid'),
            nodeid: "settime",
            isshowflowdata: true
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: "POST",
          success: function (res) {
            var companys = res.data.data[0];
            that.setData({
              company: {
                ontime: companys.shangbanshijian,
                offtime: companys.xiabanshijian,
                latitude: companys.weidu,
                longitude: companys.jingdu
              }
            });
          }
        });
        /**/
        
      }
    });
  },
  updateDT: function () {     //刷新打卡记录signOn和signOff都能用
    this.updateDistant(); //判断是不是外勤
    this.setData({
      nowTime: {
        hm: formatNumber(formatTime(new Date(), 0)),
        ymd: formatNumber(formatTime(new Date(), 1)),
      }
    })
  },
  signOn: function () {   //上午的签到和更新打卡
    var that = this;
    that.updateDT();  //获取时间
    var range = that.data.range;
    var types = "正常";
    var time = that.data.nowTime.hm;
    var realTime = that.data.company.ontime;
    var c1 = Date.parse('2008-08-08 ' + time);
    var c2 = Date.parse('2008-08-08 ' + realTime);
    if (c1 > c2) {
      types = "迟到";
    } else {
      types = "正常";
    }
    var submitinfo = {
      xingming: that.data.userInfo.nickName, 
      dakariqi:that.data.nowTime.ymd,//日期--
      shangwudakashijian:time,//时间--
      shangwudakazhuangtai:types,//是否迟到--
      shangwudakafanwei:range,//是否是外勤--
    };
    //itemid存在的话就是更新，访问updatedata
    if(that.data.itemid){
      that.updateAjax(submitinfo);//更新
    }else{//访问updatedata
      that.submitAjax(submitinfo);//新建
    }
    that.setData({
      on: {
        "time": time,
        "type": types,
        "range": that.data.range
      }
    });
  },
  signOff: function () {      //上午的签到和更新打卡
    var that = this;
    that.updateDT(); 
    var range = that.data.range;
    var types = "";
    var time = that.data.nowTime.hm;
    var realTime = that.data.company.offtime;
    var c1 = Date.parse('2008-08-08 ' + time); 
    var c2 = Date.parse('2008-08-08 ' + realTime);
    if (c1 > c2) {
      types = "正常";
    } else {
      types = "早退";
    }
    var submitinfo = {
      xingming: that.data.userInfo.nickName, 
      dakariqi: that.data.nowTime.ymd,//日期--
      xiawudakashijian: time,//时间--
      xiawudakazhuangtai: types,//是否迟到--
      xiawudakafanwei: range,//是否是外勤--
    };
    that.updateAjax(submitinfo);
    that.setData({
      off: {
        "time": time,
        "type": types,
        "range": range
      }
    });
  },
  submitAjax:function(dataInfo){
    var that = this;
     wx.request({
      url: that.data.url + 'flow/submitdata', 
      data: {
       flowid: wx.getStorageSync('flowid'),
       usrid: wx.getStorageSync('usrid'),
       nodeid: wx.getStorageSync('nodeid'),
       submitinfo:dataInfo
      },
      header:{
       "Content-Type":"application/json"
      },
      success: function(res) {  //成功之后这是itemid
        that.getTodyData();
      }
     })
  },
  updateAjax:function(dataInfo){
    var that = this;
    wx.request({
      url: that.data.url + 'flow/updatedata', 
      data: {
       flowid: wx.getStorageSync('flowid'),
       usrid: wx.getStorageSync('usrid'),
       nodeid: wx.getStorageSync('nodeid'),
       itemid: that.data.itemid,
       submitinfo:dataInfo
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.showToast({
          title: '打卡成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        });
      },
      fail:function(){
        wx.showToast({
          title: '打卡失败',
          icon: 'fail',
          duration: 1000,
          mask: true
        });
      }
     })
  },
  updateDistant:function(){  //判断是否是外勤
    var that = this
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var distance = that.getDistance(latitude, longitude, that.data.company.latitude, that.data.company.longitude);
        if (distance > 300) {
          that.setData({
            "range": '外勤'
          });
        } else {
          that.setData({
            "range": '正常'
          });
        }
        
     },
     error:function(e){
     }
    });
  },
  // 计算距离
  getDistance: function (lat1, lng1, lat2, lng2) {
    function rad(d) {
      return d * Math.PI / 180.0
    }
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = (Math.round(s * 10000) / 10000)*1000;
    return s;
  },
  about:function(){
    wx.navigateTo({
      url: '/pages/about/about',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
function formatTime(date,timetype) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var nowymd = [year, month, day].map(formatNumber).join('-');
  var nowhms = [hour, minute].map(formatNumber).join(':');
  if(timetype){
    return nowymd;
  }else{
    return nowhms;
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}