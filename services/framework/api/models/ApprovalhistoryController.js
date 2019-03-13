/**
 * Created by demo on 2017/7/20.
 */
module.exports = {
    listcurnodehistories:function (req,res) {
        var flowid = req.param("flowid");
        var nodeid = req.param("nodeid");
        gethistories(flowid,nodeid)
            .then(getuserlogininfo)
            .then(buildinfos)
            .then(function (ret) {
                res.send(200,{histories:ret})
            })
    }
};

// 取历史信息
function gethistories(flowid,nodeid){
    return new Promise(function (resolve,reject) {
        Approvalhistory.find({
            where:{
              flowid:flowid,
              nodeid:nodeid
            },
            sort:'updatedAt DESC'
        }).exec(function (err,histories) {
            if(!histories){
                reject("未找到histories");
            }else{
                var data = {};
                data.histories = histories;
                resolve(data)
            }
        })
    })
}

function getuserlogininfo(data) {
    return new Promise(function (resolve,reject) {
        Users.find({

        }).exec(function (err,users) {
            if(!users){
                reject("未找到users");
            }else{
                data.users = users;
                resolve(data);
            }
        })
    })
}

function buildinfos(data) {
    return new Promise(function (resolve,reject) {
        var _histories = data.histories;
        var _users = data.users;
        var _retarr = [];
        for(var i = 0 ; i < _histories.length;i++){
            var tempObj=  {};
            tempObj.username = getusernamebyid(_histories[i].shenpiuserid,data);
            tempObj.shenpistatus = formatshenpistatus(_histories[i].shenpistatus);
            tempObj.shenpicomments = _histories[i].shenpicomments;
            tempObj.time = formatTime(_histories[i].updatedAt,'yyyy-MM-dd hh:mm');
            _retarr.push(tempObj);
        }
        resolve(_retarr);
    })
}

function getusernamebyid(usrid,data){
    if(usrid == "0"){
        return "智能审批";
    }
    // 只有新提交的数据，审批人员为"";
    if(usrid == ""){
        return "我自己";
    }
    var _users = data.users;
    for(var i = 0 ; i < _users.length;i++){
        if(_users[i].id == usrid){
            if(_users[i].realname){
                return _users[i].realname
            }else{
                return _users[i].loginname;
            }
        }
    }
}

function formatshenpistatus(value){
    if(value == "deny"){
        return "审批被拒绝";
    }else if(value == "approve"){
        return "审批已通过";
    }else if(value == "submit"){
        return "已提交";
    }else{
        return "";
    }

}

function formatTime(time,fmt) {
    var date = new Date(time);
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
