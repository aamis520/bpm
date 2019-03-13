const conf = {
  data: {
    today:'',
    hasEmptyGrid: false,
    checkedDay: new Date().getDate(),
    showdetail:false,
    url: getApp().globalData.url,//请求的地址
    signRecode:{
      "on": {
        "time": "",
        "type": "",
        "range": ""
      },
      "off": {
        "time": "",
        "type": "",
        "range": ""
      }
    }
  },
  onLoad(options) {
    var that = this;
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
    var day = date.getDate();
    var month = cur_month.toString();
    day = day.toString();
    month.length<2?month='0'+month:month=month;
    day.length<2?day='0'+day:day=day;
    var dates = cur_year + '-' + month + '-'+ day;
    wx.request({
      url: that.data.url + 'flow/listsks', 
      data: {
        flowid: wx.getStorageSync('flowid'),
        usrid: wx.getStorageSync('userid'),
        nodeid: wx.getStorageSync('nodeid'),
        isshowflowdata: true
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var dakaData = res.data.data;
        for (var i = 0; i < dakaData.length;i++){
          if (dakaData[i].date == dates){ //有今天的数据
            that.setData({
              showdetail: true,
              signRecode: {
                "on": {
                  "time": dakaData[i].shangwudakashijian,
                  "type": dakaData[i].shangwudakazhuangtai,
                  "range": dakaData[i].shangwudakafanwei
                },
                "off": {
                  "time": dakaData[i].xiawudakashijian,
                  "type": dakaData[i].xiawudakazhuangtai,
                  "range": dakaData[i].xiawudakafanwei
                }
              }
            });  
            break;
          }
          that.setData({
            showdetail: false
          });
        }
      }
  })
  },
  getThisMonthDays(year, month) {   //获得这个月的天数
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {  //获得第一天是星期几
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {  //计算空的列表
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {  //计算天数
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    this.setData({
      days
    });
  },
  handleCalendar(e) {   //处理日历
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }
      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  onShareAppMessage() {   
    return {
      title: '打卡日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/logs/logs'
    }
  },
  checkDay(day){    
     var that = this;
     this.setData({
       checkedDay:day.target.id
     });
     var month = this.data.cur_month.toString();
     var day = day.target.id.toString();
     month.length<2?month='0'+month:month=month;
     day.length<2?day='0'+day:day=day;
     var date = this.data.cur_year + '-' + month + '-'+ day;
     wx.request({
       url: that.data.url + 'flow/listsks',
       data: {
         flowid: wx.getStorageSync('flowid'),
         usrid: wx.getStorageSync('userid'),
         nodeid: wx.getStorageSync('nodeid'),
         isshowflowdata: true
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
        success: function(res) {
          var dakaData = res.data.data;
          for (var i = 0; i < dakaData.length; i++) {
            if (dakaData[i].date == date) { //有今天的数据
              that.setData({
                showdetail: true,
                signRecode: {
                  "on": {
                    "time": dakaData[i].shangwudakashijian,
                    "type": dakaData[i].shangwudakazhuangtai,
                    "range": dakaData[i].shangwudakafanwei
                  },
                  "off": {
                    "time": dakaData[i].xiawudakashijian,
                    "type": dakaData[i].xiawudakazhuangtai,
                    "range": dakaData[i].xiawudakafanwei
                  }
                }
              });
              break;
            }
            that.setData({
              showdetail: false
            });
          }
        }
      });
    }
  };
Page(
  conf
);
