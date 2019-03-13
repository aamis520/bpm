/**
 * Created by demo on 2017/7/18.
 */
var querybysks = require("./querybysks");
var querybyck = require("./querybyck");
module.exports = {
    startprocess:function (itemid,flowid,nodeinfo) {
        return new Promise(function (resolve,reject) {
            var autocheckid = nodeinfo.autocheckID;
            getautocheckconditions(itemid,flowid,nodeinfo,autocheckid) // 读出自动审批的条件,并整理数据
                .then(getallskid)
                .then(getallskvalue)
                .then(getallckid)
                .then(getallckvalue)
                .then(calcautocheckconditions)
                .then(function (data) {
                    var _autocheckresult = data.autocheckresult;
                    var _whydeny = data.whydeny;

                    var _flowid = data.flowid;
                    var _itemid = data.itemid;
                    var _curnodeid = data.curnodeid;

                    // 自动审批的usrid存为0，便于查找所有的自动审批记录
                    // 自动审批同意
                    console.log("autocheckResult:"+ data.autocheckresult)
                    if(data.autocheckresult == true){
                        var _tempdata1 = {};
                        _tempdata1["shenpistatus"] = "approve";
                        _tempdata1["shenpicomments"] = "自动审批通过";
                        setTimeout(function () {
                            var NextNodeGenerateHandler = require("./NextNodeGenerateHandler");
                            NextNodeGenerateHandler.startprocess(_itemid,"0",_curnodeid,_flowid,_tempdata1,false)
                        },1);

                    }else{
                        // 自动审批拒绝
                        var _tempdata2 = {};
                        _tempdata2["shenpistatus"] = "deny";
                        _tempdata2["shenpicomments"] = _whydeny;
                        setTimeout(function () {
                            var NextNodeGenerateHandler = require("./NextNodeGenerateHandler");
                            NextNodeGenerateHandler.startprocess(_itemid,"0",_curnodeid,_flowid,_tempdata2,false)
                        },1);
                    }

                    // 这个data在这里resolve出去，只是为了不报错
                    resolve(data)
                })
        })
    }
};

// 根据我的审批的条件计算我的审批的值，返回是true或者false
function calcautocheckconditions(data) {
    return new Promise(function (resolve,reject) {
        var _condition = data.condition;
        var finalResu = false;
        // 这是对没一行的结果进行计算，得出整个条件的结果，true/false
        var colStr = "";

        var whydeny = "";
        // 循环取条件的operations
        for(var i = 0 ;i < _condition.operations.length;i++){
            var operation = _condition.operations[i].operation;
            var keyid = _condition.operations[i].func.keyid;
            var keytype = _condition.operations[i].func.keytype;
            var operate = _condition.operations[i].func.operate;
            var value = _condition.operations[i].func.value;

            if(keytype == "sk"){
                var keyvalue = getvaluebyskid(keyid,data);

                // 同时获取sk的name，如果审批拒绝，写入拒绝原因中
                var keyname = getnamebyskid(keyid,data);
            }
            if(keytype == "ck"){
                var keyvalue = getvaluebyckid(keyid,data);

                // 同时获取ck的name，如果审批拒绝，写入拒绝原因中
                var keyname = getnamebyckid(keyid,data);
            }

            // 这里是条件每一行的值
            var rowResu = false;
            var rowResuStr = `${keyvalue}${operate}${value}`;
            rowResu = eval(rowResuStr);
            if(Number(keyvalue) && Number(value)){
                rowResuStr = `${keyvalue}${operate}${value}`;
                rowResu = eval(rowResuStr)
            }
            // 这里对每一行的结果进行拼接
            colStr += `${operation}${rowResu}`;

            // 这里对每一行的原因进行拼接，结果是str
            var rowwhydeny = `${keyname} ${operate} ${value}`;
            whydeny += ` ${operation} ${rowwhydeny}`;
        }

        finalResu = eval(colStr);
        data.whydeny = whydeny;// 这是拒绝原因，有可能不用
        data.autocheckresult = finalResu;
        resolve(data)
    })
}
// 根据sk的id取值
function getvaluebyskid(skid,data) {
    var skinfo = data.skinfo;
    for(var i = 0 ; i < skinfo.length;i++){
        if(skinfo[i].sk.id == skid){
            return skinfo[i].value;
        }
    }
}

// 根据sk的id取name
function getnamebyskid(skid,data) {
    var skinfo = data.skinfo;
    for(var i = 0 ; i < skinfo.length;i++){
        if(skinfo[i].sk.id == skid){
            return skinfo[i].sk.name;
        }
    }
}

// 根据ck的id取值，这里暂时只能使用一个ck
function getvaluebyckid(ckid,data) {
    return data.ckinfo.value;
}

// 根据ck的id取name，这里暂时只能使用一个ck
function getnamebyckid(ckid,data) {
    return data.ckinfo.name;
}

// 获取ck的值
function getallckvalue(data) {
    return new Promise(function (resolve,reject) {
        if(data.ckidarr[0] && data.ckidarr[0].ckid){
            var _ckid = data.ckidarr[0].ckid;
            // todo 自动审批无当前usrid，这里_ckid之后没有传usrid，也就是无法使用‘我自己，我的上级等跟当前用户有关的关键字’
            querybyck.querybyckfn(_ckid)
                .then(function (result) {
                    data.ckinfo = result;
                    resolve(data);
                })
        }else{
            resolve(data);
        }
    })
}

// 读出所有ckid
function getallckid(data) {
    return new Promise(function (resolve,reject) {
        var _condition = data.condition;
        var _ckidarr = [];
        if(_condition && _condition.operations){
            for(var i = 0 ; i < _condition.operations.length;i++){
                if(_condition.operations[i].func.keytype == "ck"){
                    var _temp = {};
                    _temp.ckid = _condition.operations[i].func.keyid;
                    _ckidarr.push(_temp)
                }
            }
        }
        data.ckidarr = _ckidarr;
        resolve(data)
    })
}

// 读出所有sk的值
function getallskvalue(data) {
    return new Promise(function (resolve,reject) {
        var _skidarr = data.skidarr;
        if(_skidarr && _skidarr.length > 0){
            querybysks.querybysks(_skidarr)
                .then(function (result) {
                    data.skinfo = result;
                    resolve(data)
                })
        }else{
            resolve(data)
        }
    })
}

// 读出所有skid
function getallskid(data) {
   return new Promise(function (resolve,reject) {
       var _condition = data.condition;
       var _skidarr = [];
        if(_condition && _condition.operations) {
            for(var i = 0 ; i < _condition.operations.length;i++){
                if(_condition.operations[i].func.keytype == "sk"){
                    var _temp = {};
                    _temp.itemid = data.itemid;
                    _temp.flowid = _condition.operations[i].func.flowid;
                    _temp.skid = _condition.operations[i].func.keyid;
                    _skidarr.push(_temp);
                }
            }
        }

        // 对找出的skid进行去重
       var result = [],  temp = {};
       for(var j = 0 ; j < _skidarr.length;j++){
           var skid = _skidarr[j].skid;
           if(!temp[skid]){
               result.push(_skidarr[j]);
               temp[skid] = true;
           }
           temp[skid] = true;
       }
        data.skidarr = result;
        resolve(data);
   })
}

// 读出自动审批的条件,并整理数据
function getautocheckconditions(itemid,flowid,nodeinfo,autocheckid) {
    return new Promise(function (resolve,reject) {
        this.Autocheckconditions.findOne({
            id:autocheckid
        }).exec(function (err,condition) {
            if(!condition){
                reject("getautocheckconditionsw未找到信息")
            }else{
                var data = {};
                data.autocheckid = autocheckid;
                data.flowid = flowid;
                data.nodeinfo = nodeinfo;
                data.itemid = itemid;
                data.condition = condition;
                data.curnodeid = nodeinfo.nodeid;
                resolve(data)
            }
        })
    })
}
