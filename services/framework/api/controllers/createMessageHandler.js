/**
 * Created by demo on 2017/8/8.
 */
module.exports = {
  start:function (messagetype,messageformatid,usrid,itemid,nodeid,identifyid,messageinfo,curnodeid,flowid) {
      return new Promise(function (resolve,reject) {
          QueryGroup(messagetype,messageformatid,usrid,itemid,nodeid,identifyid,messageinfo,curnodeid,flowid)//获得消息需要发送的组。
              .then(ComposeMssage)//组织消息内容。
              .then(SaveMessage)//存
              //.then(SendNotification(data))//极光。
              .then(function (data) {
                  resolve(data)
              })
      })
  }
};

// 获得消息需要发送的组
function QueryGroup(messagetype,messageformatid,usrid,itemid,nodeid,identifyid,messageinfo,curnodeid,flowid){
  return new Promise(function (resolve,reject) {
        Messagegroup.find({
            identify:identifyid
        }).exec(function (err,messagegroup) {
            if(!messagegroup){
                reject("messagegroup未找到")
            }else{
                var _tempArr = [];
                for(var i = 0 ; i < messagegroup.length;i++){
                    _tempArr.push(messagegroup[i].id)
                }
                var data = {};
                data.messagetype = messagetype;
                data.nodeid = nodeid;
                data.itemid = itemid;
                data.usrid = usrid;
                data.messagegroupinfo = messagegroup;
                data.messagegroupid = _tempArr;
                data.messageformatid = messageformatid;
                data.messageinfo = messageinfo;
                data.curnodeid = curnodeid;
                data.flowid = flowid;
                resolve(data);
            }
        })
    })
}

// 组织消息的内容
function ComposeMssage(data) {
    return new Promise(function (resolve,reject) {
        ComposeBase(data)
            .then(ComposeIfNotification)
            .then(ComposeIfSharing)
            .then(ComposeIfChat)
            .then(ComposeIfAnnounce)
            .then(function (data) {
                resolve(data)
            })
    })
}

function ComposeBase(data) {
    return new Promise(function (resolve,reject) {
        resolve(data);
    })
}

function ComposeIfNotification(data) {
  return new Promise(function (resolve,reject) {
      var messagetype = data.messagetype;
      if(messagetype == "Notification"){
          Readrelatedmessageformat(data)
              .then(ReadSKInfo)
              //.Readrelatedflowdata(data)
              .then(getApprovalhistory) // 获取记录的信息，是为了获取审批状态状态等信息
              .then(getflowdata)  // 获取提交数据的信息
              .then(getflowinfo) // 获取流程的信息
              .then(getpersoninfo)
              .then(bulidinformperson) // 整理接收人员，下个节点人员、组分开添加到对应的数组
              .then(composenotifcation)
              .then(function(data){
                  resolve(data)
              })
      }else{
        resolve(data)
      }
  })
}

// ComposeIfNotification中用的函数 --Start

function Readrelatedmessageformat(data) {
    return new Promise(function (resolve,reject) {
        var messageformatid = data.messageformatid;
        Messageconditions.findOne({
            id:messageformatid
        }).exec(function (err,condition) {
            if(!condition){
                reject("未找到Messageconditions")
            }else{
                data.messageformatinfo = condition;
                data.flowid = condition.flowid;
                resolve(data)
            }
        })
    })
}

function ReadSKInfo(data) {
    return new Promise(function (resolve,reject) {
        var skidarr = [];
        var keyword1 = data.messageformatinfo.keyword1;
        var keyword2 = data.messageformatinfo.keyword2;
        var keyword3 = data.messageformatinfo.keyword3;
        var keyword4 = data.messageformatinfo.keyword4;
        var flowid = data.flowid;
        var itemid = data.itemid;
        var usrid = data.usrid;
        if(keyword1) {
            skidarr.push({
                itemid:itemid,
                flowid:flowid,
                skid:keyword1,
                usrid:usrid
            })
        }
        if(keyword2) {
            skidarr.push({
                itemid:itemid,
                flowid:flowid,
                skid:keyword2,
                usrid:usrid
            })
        }
        if(keyword3) {
            skidarr.push({
                itemid:itemid,
                flowid:flowid,
                skid:keyword3,
                usrid:usrid
            })
        }
        if(keyword4) {
            skidarr.push({
                itemid:itemid,
                flowid:flowid,
                skid:keyword4,
                usrid:usrid
            })
        }

        var _skidarr = uniqueArrByKey(skidarr,"skid");
        if(skidarr.length > 0){
            var querybysks = require("./querybysks");
            querybysks.querybysks(_skidarr)
                .then(function (result) {
                    data.skvalue = result;
                    resolve(data)
                })
        }else{
          resolve(data)
        }
    })
}

function getApprovalhistory(data) {
    return new Promise(function (resolve,reject) {
        var itemid = data.itemid;
        // 取审批记录的最后的一条
        // 也就是倒叙，取第一条
        Approvalhistory.find({
          where: {
              itemid: itemid
          },
          sort:'createdAt DESC'
        }).exec(function (err,history) {
            if(!history){
                reject("未取到getApprovalhistory")
            }else{
                data.approvalhistoryinfo = history[0];
                resolve(data)
            }
        })
    })
}

function getflowdata(data) {
    return new Promise(function (resolve,reject) {
        var flowid = data.flowid;
        var flowdb = eval("n" + flowid);
        var itemid = data.itemid;
        flowdb.findOne({
            id:itemid
        }).exec(function (err,flowdata) {
            if(!flowdata){
                reject("未找到flowdata")
            }else{
                data.flowdata = flowdata;
                resolve(data)
            }
        })
    })
}

function getflowinfo(data) {
  return new Promise(function (resolve,reject) {
      var flowid = data.flowdata.nextflowid;
      Flow.findOne({
          id:flowid
      }).exec(function (err,flow) {
          if(!flow){
              reject("未找到flow")
          }else{
              data.flowinfo = flow;
              resolve(data)
          }
      })
  })
}

function getpersoninfo(data) {
  return new Promise(function (resolve,reject) {
      var usrid = data.usrid;
      if(usrid == 0 || usrid == '0' ){
          resolve(data)
      }else{
          Users.findOne({
              id:usrid
          }).exec(function (err,user) {
              if(!user){
                  reject("未找到user")
              }else{
                  data.usrinfo = user;
                  resolve(data)
              }
          })
      }
  })
}

function bulidinformperson(data) {
    return new Promise(function (resolve,reject) {
        // 这是下个节点可见的人员信息 --Start
        var nextnodeid = data.flowdata.nextnodeid;
        var curnodeid = data.curnodeid;
        var flowinfo = data.flowinfo;
        var nextNodePersonInfo = {};
        var curnodename = "";
        nextNodePersonInfo.usrid = [];
        nextNodePersonInfo.groupsid = [];
        nextNodePersonInfo.apartmentsid = [];
        for(var i = 0 ; i < flowinfo.nodes.length;i++){
            if(flowinfo.nodes[i].nodeid == curnodeid){
                curnodename = flowinfo.nodes[i].name;
            }
            if(flowinfo.nodes[i].nodeid == nextnodeid){
                if(flowinfo.nodes[i].usrid && flowinfo.nodes[i].usrid.length > 0){
                    nextNodePersonInfo.usrid = flowinfo.nodes[i].usrid;
                }

                if(flowinfo.nodes[i].groupsid && flowinfo.nodes[i].groupsid.length > 0){
                    nextNodePersonInfo.groupsid = flowinfo.nodes[i].groupsid;
                }

                if(flowinfo.nodes[i].apartmentsid && flowinfo.nodes[i].apartmentsid.length > 0){
                    nextNodePersonInfo.apartmentsid = flowinfo.nodes[i].apartmentsid;
                }
            }
        }
        //  这是下个节点可见的人员信息-- end

        // 这是消息中设置的人员的信息 --Start
        var toIDs = [];
        var groupIDs = [];
        var departmentIDs = [];
        if(data.messageformatinfo.toIDs && data.messageformatinfo.toIDs.length > 0){
            toIDs = data.messageformatinfo.toIDs;
        }
        if(data.messageformatinfo.groupIDs && data.messageformatinfo.groupIDs.length > 0){
            groupIDs = data.messageformatinfo.groupIDs;
        }
        if(data.messageformatinfo.departmentIDs && data.messageformatinfo.departmentIDs.length > 0){
            departmentIDs = data.messageformatinfo.departmentIDs;
        }

        // 这是消息中设置的人员的信息  --end
        // 对下个节点设置的人员和消息设置中的人员做个合并，并去重
        var _toIDs = toIDs.concat(nextNodePersonInfo.usrid);
        var _groupIDs = groupIDs.concat(nextNodePersonInfo.groupsid);
        var _departmentIDs = departmentIDs.concat(nextNodePersonInfo.apartmentsid);

        var uniquetoIDs = uniqueArr(_toIDs);
        var uniquegroupIDs = uniqueArr(_groupIDs);
        var uniquedepartmentIDs = uniqueArr(_departmentIDs);

        data.informwho = {};
        data.informwho.toIDs = uniquetoIDs;
        data.informwho.groupIDs = uniquegroupIDs;
        data.informwho.departmentIDs = uniquedepartmentIDs;

        data.curnodename = curnodename;
        resolve(data)
    })
}

function composenotifcation(data) {
    return new Promise(function (resolve,reject) {
        var _itemid = data.itemid;
        var _flowid = data.flowid;
        var _fmtnodeid = data.messageformatinfo.nodeid;
        var _fmtpage = data.messageformatinfo.page;
        var _fmtdenynodeid = data.messageformatinfo.denynodeid;
        var _fmtdenypage = data.messageformatinfo.denypage;
        var _flowname = data.flowinfo.name;
        var _curnodename = data.curnodename;
        var _usrname = "";
        if(data.usrid == 0){
            _usrname = "自动审批";
        }else{
            _usrname = data.usrinfo.realname ? data.usrinfo.realname : data.usrinfo.loginname;
        }

        var _shenpistatus = data.approvalhistoryinfo.shenpistatus;
        var _shenpistatusval = "";
        if( _shenpistatus == "approve"){
            _shenpistatusval = "审批中"
        }
        if(_shenpistatus == "deny"){
            _shenpistatusval = "被拒绝";
        }
        if(_shenpistatus == "finished"){
          _shenpistatusval = "已结束";
        }

        var retObj = {};
        if(data.flowid){
          retObj.flowid = data.flowid;
        }
        // 消息的状态 'submit,qpprove,deny'
        retObj.status = _shenpistatus;
        // 消息的类型
        retObj.type = data.messagetype;
        // 消息的优先级
        retObj.priority = data.messageformatinfo.priority;
        // 谁发送的
        retObj.fromid = data.usrid;
        // 发给谁
        retObj.toPersonIDs = data.informwho.toIDs;
        retObj.toGroupIDs = data.informwho.groupIDs;
        retObj.toDepartmentIDs = data.informwho.departmentIDs;
        // 是否需要确认收到
        retObj.needconfirm = false;
        retObj.message = {};
        // 流程的名称
        retObj.message.flowname = data.flowinfo.name;
        // 审批的状态
        retObj.message.status = data.approvalhistoryinfo.shenpistatus;

        // 获取消息的url
        if(_shenpistatus != 'deny'){
          retObj.message.url = _flowid + '|' + _fmtnodeid + '|'+ _fmtpage +
            '?flowid='+_flowid + '&nodeid='+_fmtnodeid + '&itemid='+_itemid;
        }else {
          retObj.message.url = _flowid + '|' + _fmtdenynodeid + '|' + _fmtdenypage +
            '?flowid=' + _flowid + '&nodeid=' + _fmtnodeid + '&itemid=' + _itemid;
        }
        var _title = '来自 \'' + _usrname + "\'的 \'" + _curnodename +"\' " +  _shenpistatusval + " ,请继续处理";
        if(_shenpistatus == "finished"){
          _title = '来自 \'' + _usrname + "\'的 \'" + _curnodename +"\' " +  _shenpistatusval + "。";
        }
        retObj.message.title = _title;
        var keyword1Val = "";
        if(data.messageformatinfo.keyword1){
            keyword1Val = getSkKeyAndValById(data.messageformatinfo.keyword1,data.skvalue);
        }
        var keyword2Val = "";
        if(data.messageformatinfo.keyword2){
            keyword2Val = getSkKeyAndValById(data.messageformatinfo.keyword2,data.skvalue);
        }
        var keyword3Val = "";
        if(data.messageformatinfo.keyword3){
          keyword3Val = getSkKeyAndValById(data.messageformatinfo.keyword3,data.skvalue);
        }
        var keyword4Val = "";
        if(data.messageformatinfo.keyword4){
            keyword4Val = getSkKeyAndValById(data.messageformatinfo.keyword4,data.skvalue);
        }

        retObj.message.key1 = keyword1Val;
        retObj.message.key2 = keyword2Val;
        retObj.message.key3 = keyword3Val;
        retObj.message.key4 = keyword4Val;

        data.messageforwrite = retObj;
        resolve(data)
    })
}

// ComposeIfNotification中用的函数 --end

// ComposeIfSharing用的函数 --Start
function ComposeIfSharing(data) {
    return new Promise(function (resolve,reject) {
        var messagetype = data.messagetype;
        if(messagetype == "Sharing"){
            var messageforwrite = {};
            messageforwrite.type = data.messagetype;
            messageforwrite.priority = data.messageinfo.priority;
            messageforwrite.fromid = data.usrid;
            messageforwrite.toPersonIDs = uniqueArr(data.messageinfo.toIDs);
            // 这个groupIDs 是消息组的ids
            messageforwrite.toGroupIDs = uniqueArr(data.messagegroupid);
            messageforwrite.toDepartmentIDs = [];
            messageforwrite.needconfirm = data.messageinfo.needconfirm;
            messageforwrite.message = {};
            messageforwrite.message.title = data.messageinfo.title;
            messageforwrite.message.desc = data.messageinfo.desc;
            messageforwrite.message.thumb = data.messageinfo.thumb;
            messageforwrite.message.context = data.messageinfo.context;
            messageforwrite.message.url = data.messageinfo.url;

            data.messageforwrite = messageforwrite;
            resolve(data)
        }else{
            resolve(data)
        }

    })
}
// ComposeIfSharing用的函数 -- end

//ComposeIfChat用的函数 --start
function ComposeIfChat(data) {
    return new Promise(function (resolve, reject) {
        var _messagetype = data.messagetype;
        if(_messagetype == "Chat"){
            var messageforwrite = {};
            messageforwrite.type = data.messagetype;
            messageforwrite.priority = data.messageinfo.priority;
            messageforwrite.fromid = data.usrid;
            messageforwrite.toPersonIDs = uniqueArr(data.messageinfo.toIDs);
            // 这个groupIDs 是消息组的ids
            messageforwrite.toGroupIDs = uniqueArr(data.messagegroupid);
            messageforwrite.toDepartmentIDs = [];
            messageforwrite.needconfirm = data.messageinfo.needconfirm;
            messageforwrite.message = {};
            messageforwrite.message.title = data.messageinfo.title;
            messageforwrite.message.desc = data.messageinfo.desc;
            messageforwrite.message.thumb = data.messageinfo.thumb;
            messageforwrite.message.context = data.messageinfo.context;
            messageforwrite.message.url = data.messageinfo.url;

            data.messageforwrite = messageforwrite;
            resolve(data)
        }else {
            resolve(data)
        }
    })
}
//ComposeIfChat用的函数 --end

//ComposeIfAnnounce --start
function ComposeIfAnnounce(data) {
    return new Promise(function (resolve,reject) {
        var _messagetype = data.messagetype;
        if(_messagetype == "Announce"){
            var messageforwrite = {};
            messageforwrite.type = data.messagetype;
            messageforwrite.priority = data.messageinfo.priority;
            messageforwrite.fromid = data.usrid;
            messageforwrite.toPersonIDs = uniqueArr(data.messageinfo.toIDs);
            // 这个groupIDs 是消息组的ids
            messageforwrite.toGroupIDs = uniqueArr(data.messagegroupid);
            messageforwrite.toDepartmentIDs = [];
            messageforwrite.needconfirm = data.messageinfo.needconfirm;
            messageforwrite.message = {};
            messageforwrite.message.title = data.messageinfo.title;
            messageforwrite.message.desc = data.messageinfo.desc;
            messageforwrite.message.thumb = data.messageinfo.thumb;
            messageforwrite.message.context = data.messageinfo.context;
            messageforwrite.message.url = data.messageinfo.url;

            data.messageforwrite = messageforwrite;
            resolve(data)
        }else{
            resolve(data)
        }
    })
}
// ComposeIfAnnounce --end

//SaveMessage --start
function SaveMessage(data) {
    return new Promise(function (resolve,reject) {
        var messageforwrite = data.messageforwrite;
        Message.create(
            messageforwrite
        ).exec(function (err,message) {
            if(!message){
                reject("创建message失败")
            }else{
                data.createmessageid = message.id;
                resolve(data)
            }
        })
    })
}
//SaveMessage --end

// 根据数组中对象的某个key进行去重
function uniqueArrByKey(arr,key){
  var newArr=[];
  for(var i=0;i<arr.length;i++){
      if(_objIsInArray(arr[i],newArr,key) ==-1){
          newArr.push(arr[i]);
      }
  }
  return newArr;

  function _objIsInArray(obj,arr,key){
      var tmpStatus=false;
      for(var j=0;j<arr.length;j++){
          if(obj[key]==arr[j][key]){
              return j;
          }else{
              tmpStatus=false;
          }
      }
      if(!tmpStatus){
          return -1;
      }
  }
}

// 数组去重
function uniqueArr(ar) {
    var ret = [];
    for (var i = 0, j = ar.length; i < j; i++) {
        if (ret.indexOf(ar[i]) === -1) {
          ret.push(ar[i]);
        }
    }
    return ret;
}

// 根据skid返回key和val
function getSkKeyAndValById(id,skarr) {
    for(var i = 0 ; i < skarr.length;i++){
        if(skarr[i].sk.id == id){
            var _name = skarr[i].sk.name;
            var _val = canformattime(skarr[i].value);
            return _name + " : " + _val
        }
    }
}

//能否转为时间，能->转，不能->返回原值
function canformattime(str) {
    var _str = Number(str);
    if(!isNaN(_str) && str.length == 13){
        return formatTime(_str,"yyyy-MM-dd hh:mm")
    }else {
        return str
    }
}

// 把时间转为指定形式
function formatTime(time,fmt) {
  var date = new Date(time);
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
  };
  for (var k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
          var str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
  }
  return fmt;
  // 补0
  function padLeftZero(str) {
      return ('00' + str).substr(str.length);
  }
}