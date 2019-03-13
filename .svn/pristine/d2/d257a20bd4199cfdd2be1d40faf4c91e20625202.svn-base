/**
 * Created by demo on 2017/8/4.
 */
var createMessageHandler = require("./createMessageHandler.js");
module.exports = {
    // 创建
    send:function (req,res) {
        var type = req.param("type");//消息的类型
        var priority = req.param("priority");//消息的优先级
        var fromID = req.param("fromID");//发送者
        var toIDs = req.param("toIDs");//发送给谁
        var groupIDs = req.param("groupIDs");
        var needconfirm = req.param("needconfirm");
        var title = req.param("title");
        var desc = req.param("desc");
        var thumb = req.param("thumb");
        var context = req.param("context");
        var url = req.param("url");
        var messageinfo = {};

        messageinfo.priority = priority;
        messageinfo.title = title;
        messageinfo.desc = desc;
        messageinfo.thumb = thumb;
        messageinfo.context = context;
        messageinfo.url = url;

        messageinfo.needconfirm = needconfirm;
        messageinfo.toIDs = toIDs;

        // 参数顺序(messagetype,messageformatid,usrid,itemid,nodeid,identifyid,messageinfo,curnodeid,flowid)
        // identifyid是个arr
        createMessageHandler.start(type,"",fromID,"","",groupIDs,messageinfo,"","")
            .then(function (data) {
                if(data.createmessageid){
                    res.send(200,{id:data.createmessageid})
                }else{
                    res.send(200,{error:"创建消息失败"})
                }
            })


    },

    // 标记已读
    messageread:function (req,res) {
        var usrid = req.param("usrid");
        var messageid = req.param("messageid");
        Message.findOne({
            id:messageid
        }).exec(function(err,message){
            if(!message){
                res.send(200,{error:"未找到message"})
            }else{
                // 这里判断，字段已创建就push，没创建就赋第一个值
                if(message.readIDs && message.readIDs.length > 0){
                    var _readIDs = message.readIDs;
                    _readIDs.push(usrid);

                    // 对_readIDs做一个去重
                    var _tempReadIDs = arrunique(_readIDs);
                }else{
                    var _tempReadIDs = [];
                    _tempReadIDs[0] = usrid;
                }

                Message.update(
                    {id:messageid},
                    {
                      readIDs:_tempReadIDs
                    }
                ).exec(function (err,upmessage) {
                    if(!upmessage){
                       res.send(200,{error:"更新失败"})
                    }else{
                       res.send(200,{id:upmessage[0].id})
                    }
                })
            }
        })
    },

    // 标记已收到
    messageconfirm:function (req,res) {
        var usrid = req.param("usrid");
        var messageid = req.param("messageid");
        Message.findOne({
            id:messageid
        }).exec(function (err,message) {
            if(!message){
                res.send(200,{error:"未找到message"})
            }else{
              // 这里判断，字段已创建就push，没创建就赋第一个值
                if(message.confirmIDS && message.confirmIDS.length > 0){
                    var _confirmIDS = message.confirmIDS;
                    _confirmIDS.push(usrid);

                    // 对_readIDs做一个去重
                    var _tempConfirmIDS = arrunique(_confirmIDS);
                }else{
                    var _tempConfirmIDS = [];
                    _tempConfirmIDS[0] = usrid;
                }

                Message.update(
                    {id:messageid},
                    {
                        confirmIDS:_tempConfirmIDS
                    }
                ).exec(function (err,upmessage) {
                    if(!upmessage){
                        res.send(200,{error:"更新失败"})
                    }else{
                        res.send(200,{id:upmessage[0].id})
                    }
                })
            }
        })
    },

    // 给PC
    messagequeryforpc:function (req,res) {
        var usrid = req.param("usrid");
        var count = req.param("count");
        var type = req.param("type");
        var flowid = req.param("flowid");
        var status = req.param("status");

        messageQueryforPCStart(usrid,count,type,flowid,status)
            .then(buildapartmentarr)
            //.then(bulidgrouparr)
            .then(querymessageiftime)
            .then(querymessageifflow)
            .then(querymessageiftype)
            .then(function (data) {
                var _messages = data.result;
                res.send(200,{messages:_messages})
            })
    },

    // 列出消息总列表中时间倒叙最新200条消息
     messagequerybycount:function(req,res){
         var usrid = req.param("usrid");
         var count = req.param("count");
         messagequerybycountStart(usrid,count)
            .then(buildapartmentarr)
            //.then(bulidgrouparr)
            .then(querymessage)
             .then(getallusers)
            .then(bycountbulidreplydata)
            .then(function (data) {
                var _messages = data.result;
                res.send(200,{messages:_messages})
            })
     },

    // 读取所有消息,给移动端
    messagequeryformobile:function (req,res) {
        var usrid = req.param(usrid);
        var timestamp = Number(req.param("timestamp"));
        var type = req.param("type");
        var from = req.param("from");
        var length = req.param("length");

        Message.find({
            where:{
                or:[
                    {
                        ToIDs:{
                            "contains":usrid
                        }
                    },
                    groupIdsContains()//生成查询消息中组的条件

                ]
            },
            date:{
                ">":timestamp
            },
            sort:"createdAt DESC"
        }).exec(function (err,messages) {
            var _arrlength = messages.length;// 时间戳之后的所有消息

            var _skip = from;
            var _limit = length;

            var _retarr = [];

            // 如果from为-1，返回所有值
            if(from == -1){
              _retarr = messages;
            }else{
                if(timestamp == 0 || timestamp == "undefined"){
                    _skip = 0;
                    _limit = 50;
                }
                _retarr = messages.slice(_skip,_limit);// 取出多少条
            }

            var _retarrlength = _retarr.length;

            // 判断还有没有更多消息
            var havemore = true;
            if(_arrlength <= _retarrlength){
                havemore = false;
            }
            // 判断是不是已读和是不是已确认过
            for(var i = 0;i < _retarr.length;i++){
                if(inarr(_retarr[i].ReadIDs,usrid)){
                    _retarr[i].isread = true;
                }else{
                    _retarr[i].isread = false;
                }
                if(inarr(_retarr[i].ConfirmIDS,usrid) ){
                    _retarr[i].isconfirmed = true;
                }else{
                    _retarr[i].isconfirmed = false;
                }
            }

            var data = {};
            data.havemore = havemore;
            data.messages = _retarr;

            var timestamp = new Date().getTime();
            data.timestamp = timestamp;

            res.send(data)
        })
    },

    // 读出组下的信息
    querygroup:function (req,res) {
        var usrid = req.param("usrid");
        var groupid = req.param("groupid");
        Messagegroup.findOne({
          id:groupid
        }).exec(function (err,Messagegroup) {
            if(err){
                res.send(200,{error:'querygroup出错了'})
            }else{
                if(!department){
                    res.send(200,{dataerr:'未找到相关组信息'})
                }else{
                    var data = {};
                    data.title = Messagegroup.title;
                    data.desc = Messagegroup.desc;
                    data.icon = Messagegroup.icon ? Messagegroup.icon : "";
                    res.send(200,{data:data})
                }
            }
        })
    }
};

// messagequerybycount --start
function messagequerybycountStart(usrid,count) {
    return new Promise(function (resolve,reject) {
        var data = {};
        data.usrid = usrid;
        data.count = count;
        resolve(data)
    })
}

function querymessage(data) {
    return new Promise(function (resolve,reject) {
        var _usrid = data.usrid;
        var _count = data.count;
        var _departrmentsarr = data.departrmentsarr;
        Message.find({
            where:{
                or:
                    buildquerycondition(_usrid,_departrmentsarr),
                type:"Notification"
            },
            sort:'createdAt DESC',
            skip:0,
            limit:_count
        }).exec(function (err,messages) {
            if(!messages){
                reject("未读取到messages")
            }else {
                data.messages = messages;
                resolve(data)
            }
        })

    })
}

function getallusers(data) {
    return new Promise(function (resolve,reject) {
        Users.find({}).exec(function (err,users) {
            if(!users){
                reject("未读取到users")
            }else{
                data.users = users;
                resolve(data)
            }
        })
    })
}

function bycountbulidreplydata(data) {
    return new Promise(function (resolve,reject) {
        var _messages = data.messages;
        var _users = data.users;
        var _tempArr = []
        for(var i = 0 ; i < _messages.length;i++){
            var _tempObj = {};
            _tempObj.flowname = _messages[i].message.flowname;
            _tempObj.flowid = _messages[i].flowid;
            _tempObj.status = _messages[i].status;
            _tempObj.title = _messages[i].message.title;
            _tempObj.time = formatTime(_messages[i].createdAt,"yyyy-MM-dd hh:mm");
            _tempObj.url = _messages[i].message.url;
            _tempObj.sender = getnamebyid(_messages[i].fromid,_users);
            _tempArr.push(_tempObj)
        }
        data.result = _tempArr;
        resolve(data)
    })
}
//messagequerybycount --end

// 数组去重
function arrunique(ar) {
    var ret = [];
    for (var i = 0, j = ar.length; i < j; i++) {
       if (ret.indexOf(ar[i]) === -1) {
           ret.push(ar[i]);
       }
    }
    return ret;
}

// messagequeryforpc --start
function messageQueryforPCStart(usrid,count,type,flowid,status) {
    return new Promise(function (resolve,reject) {
        var data = {};
        data.usrid = usrid;
        data.count = count;
        data.type = type;
        data.flowid = flowid;
        data.status = status;
        resolve(data)
    })
}

// 此函数messagequerybycount，messagequeryforpc共用
function buildapartmentarr(data) {
    return new Promise(function (resolve,reject) {
        getpersonid(data)
            .then(getapartmentid)
            .then(getallapartment)
            .then(function (data) {
                var apartmentid = data.apartmentid;
                var departrments = data.departrments;
                var departrmentsarr = getdepartmentsarr(apartmentid,departrments);
                data.departrmentsarr = departrmentsarr;
                resolve(data)
            })

    })
}
// 此函数messagequerybycount，messagequeryforpc共用
function getpersonid(data) {
    return new Promise(function (resolve,reject) {
        var usrid = data.usrid;
        Users.findOne({
            id:usrid
        }).exec(function (err,user) {
            if(!user){
                reject("未读取到user")
            }else{
                data.personid = user.personId;
                resolve(data)
            }
        })
    })
}
// 此函数messagequerybycount，messagequeryforpc共用
function getapartmentid(data) {
  return new Promise(function (resolve,reject) {
      var _personid = data.personid;
      Person.findOne({
        id:_personid
      }).exec(function (err,person) {
          if(!person){
              reject("未读取到person")
          }else{
               data.apartmentid = person.departmentId;
               resolve(data)
          }
      })
  })
}
// 此函数messagequerybycount，messagequeryforpc共用
function getallapartment(data) {
    return new Promise(function (resolve,reject) {
        Department.find({

        }).exec(function (err,departments) {
            if(!departments){
                reject("未读取到departments")
            }else{
                data.departrments = departments;
                resolve(data)
            }
        })
    })
}

function querymessageiftime(data) {
    return new Promise(function (resolve,reject) {
        var _type = data.type;
        var _count = data.count;
        if(_type == "time"){
            var _usrid = data.usrid;
            var _departrmentsarr = data.departrmentsarr;
            Message.find({
                where:{
                    or :
                        buildquerycondition(_usrid,_departrmentsarr),
                    type:"Notification"
                },
                sort:'createdAt DESC',
                skip:0,
                limit:_count
            }).exec(function (err,messages) {
                if(!messages){
                    reject("未读取到messages")
                }else{
                    data.result = messages;
                    resolve(data)
                }
            })
        }else{
            resolve(data)
        }
    })
}

// 生成查询条件
// 此函数messagequerybycount，messagequeryforpc共用
// [
//  { toPersonIDs: { contains: '598186bb13b114687efa39e4' } },
//  { toDepartmentIDs : {contains : '598186bb13b114687efa39e4'}},
//  ...
// ]
function buildquerycondition(usrid,arr) {
    var ret = [];
    if(usrid){
        var _usrObj = {};
        _usrObj.toPersonIDs = {};
        _usrObj.toPersonIDs.contains = usrid;
        ret.push(_usrObj)
    }
    if(arr.length == 0){
        return ret;
    }
    for(var i = 0 ; i < arr.legnth;i++){
        var _arrObj = {};
        _arrObj.toDepartmentIDs = {};
        _arrObj.toDepartmentIDs.contains = arr[i];
        ret.push(_arrObj)
    }
    console.log('查询消息的条件');
    console.log(ret);
    return ret;
}

function querymessageifflow(data) {
    return new Promise(function (resolve,reject) {
        var _type = data.type;
        if(_type == "flow"){
            var _count = data.count;
            var _flowid = data.flowid;
            var _usrid = data.usrid;
            var _departrmentsarr = data.departrmentsarr;
            Message.find({
                where:{
                     or :
                        buildquerycondition(_usrid,_departrmentsarr),
                    type:"Notification",
                    flowid:_flowid
                },
                sort:'createdAt DESC',
                skip:0,
                limit:_count
            }).exec(function (err,messages) {
                if(!messages){
                    reject("未读取到messages")
                }else{
                    data.result = messages;
                    resolve(data)
                }
            })
        }else{
            resolve(data)
        }
    })
}

function querymessageiftype(data) {
    return new Promise(function (resolve,reject) {
        var _type = data.type;
        var _status = data.status;
        if(_type == "type"){
            var _usrid = data.usrid;
            var _count = data.count;
            var _departrmentsarr = data.departrmentsarr;
            var _statusSql = "";
            if(_status == "submit"){
              _statusSql = ["submit","approve","deny"];
            }else{
              _statusSql = [_status];
            };
            Message.find({
                where:{
                    or :
                        buildquerycondition(_usrid,_departrmentsarr),
                    type:"Notification",
                    status:_statusSql
                },
                sort:'createdAt DESC',
                skip:0,
                limit:_count
            }).exec(function (err,messages) {
                if(!messages){
                    reject("未读取到messages")
                }else{
                    data.result = messages;
                    resolve(data)
                }
            })
        }else{
            resolve(data)
        }
    })
}
// messagequeryforpc -- end


// 由当前的部门id找这个部门所在的父级、爷爷级...祖宗级部门
function getdepartmentsarr(departmentid,departments) {
  var relArr = [];
  return _getdepartments(departmentid,departments);
  function _getdepartments(departmentid,departments) {
    for (var i = 0; i < departments.length; i++) {
      if (departments[i].id == departmentid) {
        relArr.push(departments[i].id);
        _getdepartments(departments[i].parentId, departments);
      }
    }
    return relArr;
  }
}

function getnamebyid(id,arr) {
    for(var i = 0 ; i < arr.length;i++){
        if(arr[i].id == id){
            var _name = arr[i].realname ? arr[i].realname : arr[i].loginname;
            return _name
        }
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
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
    }
  }
  return fmt;

  function _padLeftZero(str) {
    return ('00' + str).substr(str.length);
  }
}


