/**
 * Created by demo on 2017/5/25.
 * 主要用于在提交申请或审批回复时，根据情况来决定下一节点的位置
 * 同时，申批/协作历史记录也从这里生成。
 */
/*
     主数据结构：
     {
     currentnodeid:
     submitinfo:
     usrid;
     flowinfo:
     itemid
     keys:{
            id: value //对应的ck或sk的 id做为key, 值为value.
                }

     condidnations:[ //记录的是当前node出发的条件的计算结果
            {
                condidation:"当前的条件及条件的值。"
                ret:"结果如何,返回的为true或false",
             }
            ...
            ]

    nextnodeid
     }

 */

"use strict";

var querybyckfn = require("./querybyck");
var querybysks = require("./querybysks");

module.exports = {
  //这个函数原本在readflowinfo之后，已换位置进行处理
  //.then(calculateallkeys) //计算所有ck和sk （注，这里的sk只是针对表单内内容，如果是复杂条件，需要定义ck。），这个函数不再在这里执行

  // 这里的submitinfo已经是个对象，不用传字符串过来
  startprocess:function (itemid, usrid, nodeid, flowid, submitinfo,isforecast){
      return new Promise(function (resolve, reject) {
          readflowinfo(itemid, usrid, nodeid, flowid, submitinfo,isforecast)  //读出来flow的信息。
              .then(selectforwardcondidations)//这里读出本节点出发的forward条件，包括提交数据和审批，按照优先级排序
              .then(selectbackwordflow) //这里选出本节点触发的backword条件，及找出backword的下一个节点是谁,
                                        // 如果是forecast，不执行这一步
              .then(getallconditions)//读出condition的具体信息
              .then(getallskid)//读出条件中的sk的id
              .then(getallskvalue)//读出所有的sk的值
              .then(getallckid)//读出条件所有的ck的id
              .then(getallckvalue)//读出条件中ck的值
              .then(calccondidations)//计算条件值，并选择下一个节点
              .then(writenextnodeinfo)//将下一个处理结点的信息，写入流程。
              // 这里需要判断：提交数据和同意，用nextnodeid，拒绝，用backnextnodeid

              .then(recordashistory)//将本次提交存成历史记录。
              .then(sendmessageifneeded)// 有需要的话，发出消息
              .then(function (data) { // 判断下个节点是不是自动审批，只有是，启动自动审批函数

                  // 判断是不是预测下个节点,不是的话，启动自动计算
                  if(data.isforecast == false){
                      var _nextnodeid = data.nextnodeid;
                      var _flowinfo = data.flowinfo;
                      var _submitInfo = data.submitinfo;
                      var _nodeinfo = {};
                    console.log('submitinfo---')
                    console.log(data.submitinfo)
                    // 没有shenpistatus的是新提交的数据，有且等于approve才是审批通过
                    if(!_submitInfo.shenpistatus || (_submitInfo.shenpistatus && _submitInfo.shenpistatus =="approve")){
                      // 这里找到的是非结束节点的信息,用于判断下个节点是不是自动审批节点
                      for(var i = 0 ; i < _flowinfo.nodes.length;i++){
                          if(_nextnodeid == _flowinfo.nodes[i].nodeid && _flowinfo.nodes[i].type != "end" ){
                            _nodeinfo = _flowinfo.nodes[i];
                          }
                      }
                      // 判断是不是自动审批节点
                      if(_nodeinfo.type && _nodeinfo.type == "autocheck") {
                          setTimeout(function () {
                              var AutoCheckNodeHandler = require("./AutoCheckNodeHandler");
                              AutoCheckNodeHandler.startprocess(data.itemid,data.flowid,_nodeinfo)
                                // 这个函数在这里是为了不报错
                                  .then(function (data) {

                                  })
                          },1);
                      }
                      // 判断自动审批结束

                      var _currentnodeid = data.currentnodeid;
                      // 这里找本节点出发的所有下个节点，可能有多个
                      var nextNodeidByFlowArr = [];

                      for(var j = 0;j < _flowinfo.flows.length;j++){
                          if(_currentnodeid == _flowinfo.flows[j].start && _flowinfo.flows[j].type=="forward"){
                              nextNodeidByFlowArr.push(_flowinfo.flows[j].end)
                          }
                      }

                      // 这里找所有的结束节点
                      var endNodeidByNodeArr = [];
                      for(var m = 0;m < _flowinfo.nodes.length;m++){
                          if(_flowinfo.nodes[m].type == "end"){
                              endNodeidByNodeArr.push(_flowinfo.nodes[m].nodeid)
                          }
                      }

                      // 对endNodeidByNodeArr和nextNodeidByFlowArr进行判断，看是否有交集，有交集，则到达了结束节点
                      var tempEndNodeidArrUnique = getArrayMixedVal(endNodeidByNodeArr,nextNodeidByFlowArr);

                      var _usrid = data.usrid;
                      var _flowid = data.flowid;
                      var _itemid = data.itemid;
                      console.log('nextnode-----')
                      console.log(tempEndNodeidArrUnique)
                      console.log('nextnode-----')

                      // >0时候，是有交集，即是到达了结束节点
                      if(tempEndNodeidArrUnique.length > 0){
                          var _tempObj = {};
                          _tempObj.shenpistatus = "finished";
                          _tempObj.shenpiuserid = data.usrid;
                          _tempObj.shenpicomments = data.submitinfo.shenpicomments ? submitinfo.shenpicomments : "";
                          _tempObj.flowid = data.flowid;
                          _tempObj.itemid = data.itemid;
                          _tempObj.nodeid = data.nextnodeid;

                          Approvalhistory.create(
                              _tempObj
                          ).exec(function(err, endapprover){
                              if(!endapprover){
                                  reject("Approvalhistory error")
                              }else{

                              }
                          })

                          for(let k = 0;k < tempEndNodeidArrUnique.length;k++){
                              if(_submitInfo.shenpistatus && (_submitInfo.shenpistatus == 'approve' || _submitInfo.shenpistatus == "") || !_submitInfo.shenpistatus){
                                  // 这里不使用闭包的话，在timer中取到的_nextNodeid永远是for的最后一个
                                  (function () {
                                      var _nextNodeid = endNodeidByNodeArr[k];
                                      setTimeout(function () {
                                          var EndNodeHandler = require("./EndNodeHandler");
                                          EndNodeHandler.startprocess(_usrid,_flowid,_itemid,_submitInfo,_nextNodeid)
                                      },1);
                                  })(k)
                              }
                          }
                      }
                    }
                  }
                  // 这个data跟自动审批没有任何关系
                  resolve(data);
              })
      })
  }

};

// 这里取得本节点出发的反向flow
function selectbackwordflow(data) {
    return new Promise(function (resolve,reject) {
        if(data.isforecast == false){
            var _flowinfo = data.flowinfo;
            var _curnodeid = data.currentnodeid;
            // 这只是个临时变量，存的是返回条件找出的下个返回节点，跟正向的下个节点没有关系
            var _nextnodeid = "";
            // 这里保存的是找出的正向的条件，用于在没有返回连线的时候，找到第一个节点，接收返回数据
            var _tempFLowsArr = [];
            for(var i = 0;i < _flowinfo.flows.length;i++){
                if(_flowinfo.flows[i].type == "backward" && _flowinfo.flows[i].start == _curnodeid){
                    _nextnodeid = _flowinfo.flows[i].end
                }
                if(_flowinfo.flows[i].type == "forward"){
                    _tempFLowsArr.push(_flowinfo.flows[i])
                }
            }
            // 这里是判断没有返回连线的时候，才会找最初的节点，作为数据的指向节点使用，这里只有再拒绝时候才会用
            if(_nextnodeid == ""){
                _nextnodeid = getFirstNode(_tempFLowsArr,_curnodeid);
            }
            data.backnextnodeid = _nextnodeid;
          resolve(data)
        }else{
            resolve(data)
        }
    })
}

// 找到当前流程最开始的节点，也就是提交数据的节点 //给一份curnodeid是方便决定从哪里开始找
function getFirstNode(arr,nodeid) {
  return _getFirstNode(arr,nodeid);
  function _getFirstNode(arr,nodeid) {
    for(var i = 0 ; i < arr.length;i++){
      if(arr[i].end == nodeid){
        return _getFirstNode(arr,arr[i].start);
      }else{
        return arr[i].start;
      }
    }
  }
}

// 判断是否需要发出消息
function sendmessageifneeded(data) {
    return new Promise(function (resolve,reject) {
        if(data.isforecast == false) {
          var flows = data.flowinfo.flows;
          var currentnodeid = data.currentnodeid;
          var messageformatid = "";
          var usrid = data.usrid;
          var itemid = data.itemid;
          var flowid = data.flowid;
          var submitinfo = data.submitinfo;
          var nextnodeid = data.nextnodeid;
          for (var i = 0; i < flows.length; i++) {
            if (flows[i].end == nextnodeid && flows[i].start == currentnodeid) {
              messageformatid = flows[i].messageID;
            }
          }
          var messagetype = "Notification";
          // 有messageid,进入发消息的模块,消息是否成功，跟数据流程无关
          var _flowid = [];
          _flowid[0] = flowid;
          var currentnodeid = data.currentnodeid;
          if (messageformatid != "") {
            setTimeout(function () {
              var createMessageHandle = require("./createMessageHandler");
              // 参数顺序(messagetype,messageformatid,usrid,itemid,nodeid,identifyid,messageinfo,curnodeid,flowid)
              createMessageHandle.start(messagetype, messageformatid, usrid, itemid, currentnodeid, _flowid, {}, currentnodeid, flowid)
            }, 1);
          }
          resolve(data)
        }else{
          resolve(data)
        }
    })
}

//读出来flow的信息。
function readflowinfo(itemid, usrid, nodeid, flowid, submitinfo,isforecast){
    return new Promise(function (resolve, reject) {
        // 根据flowid读数据库。
        // 构造data结构
        Flow.findOne({
            id:flowid
        }).exec(function (err,flowinfo) {
            if(!flowinfo){
                reject("readflowinfo：未找到flowinfo")
            }else{
                var data = {
                    isforecast:isforecast,
                    itemid:itemid,
                    currentnodeid:nodeid,
                    submitinfo:submitinfo,
                    usrid:usrid,
                    flowinfo:flowinfo,
                    flowid:flowid
                };
                resolve(data)
            }
        });
    });
}

//获取条件中所有ck的id,目前先写一个，在data中写成了数组格式，查询的时候，只查index=0那个
function getallckid(data) {
    return new Promise(function(resolve,reject){
        // 是否需要进行计算，需要计算就需要排列，拿值，计算，不需要就直接返回data
        var isneedcalc = data.isneedcalc;
        if(isneedcalc) {
            var _conditions = data.conditions;
            var _ckidarr = [];
            for (var i = 0; i < _conditions.length; i++) {
                if (_conditions[i].operations) {
                    for (var j = 0; j < _conditions[i].operations.length; j++) {
                        if (_conditions[i].operations[j].func.keytype == "ck") {
                            var _temp = {};
                            _temp.ckid = _conditions[i].operations[j].func.keyid;
                            _ckidarr.push(_temp)
                        }
                    }
                }
            }
            data.ckidarr = _ckidarr;
            resolve(data)
        }else {
            resolve(data);
        }
    })
}

//获取所有的ck的值
function getallckvalue(data) {
    return new Promise(function (resolve,reject) {
        // 是否需要进行计算，需要计算就需要排列，拿值，计算，不需要就直接返回data
        var isneedcalc = data.isneedcalc;
        if(isneedcalc) {
            //如果没有ckid，直接返回data
            if(!data.ckidarr || data.ckidarr.length == 0){
                resolve(data)
            }else{
                //这里主要用usrid和ckid，返回一个计算过的值：data.ckvalue
                //调用其他js的函数，resolve写在调用的函数中
                var keywordid = data.ckidarr[0].ckid;
                var usrid = data.usrid;
                querybyckfn.querybyckfn(keywordid,usrid)
                    .then(function (reply) {
                        data.ckvalue = reply;
                        resolve(data)
                    })
            }
        }else {
          resolve(data);
        }
    })
}

//获取所有的sk的id
function getallskid(data) {
  return new Promise(function (resolve,reject) {
      // 是否需要进行计算，需要计算就需要排列，拿值，计算，不需要就直接返回data
      var isneedcalc = data.isneedcalc;
      if(isneedcalc){
          var _conditions = data.conditions;
          var _skidarr = [];
          for(var i = 0 ; i < _conditions.length;i++){
              if(_conditions[i].operations){
                  for(var j = 0 ; j < _conditions[i].operations.length;j++){
                      if(_conditions[i].operations[j].func.keytype == "sk"){
                          var _temp = {};
                          _temp.usrid = data.usrid;
                          _temp.itemid = data.itemid;
                          _temp.flowid = _conditions[i].operations[j].func.flowid;
                          _temp.skid = _conditions[i].operations[j].func.keyid;
                          _skidarr.push(_temp);
                      }
                  }
              }
          }
          // 对找出的skid进行去重
          var result = [],  temp = {};
          for(var i = 0 ; i < _skidarr.length;i++){
              var skid = _skidarr[i].skid;
              if(!temp[skid]){
                  result.push(_skidarr[i]);
                  temp[skid] = true;
              }
              temp[skid] = true;
          }

          data.skidarr = result;
          resolve(data)
      }else {
          resolve(data);
      }
  })
}

// 获取所有sk的值
function getallskvalue(data) {
    return new Promise(function (resolve,reject) {
        var isneedcalc = data.isneedcalc;
        // 是否需要进行计算，需要计算就需要排列，拿值，计算，不需要就直接返回data
        if(isneedcalc){
            if(!data.skidarr || data.skidarr.length == 0){
              resolve(data)
            }else{
              // todo 如果querybysks.querybysks(data.skidarr)稳定，这个函数可删除
              //   async.series(
              //       buildskqueryfunction(data.skidarr),
              //       function(err,result){
              //           if(result){
              //               data.skvalue = result;
              //               resolve(data)
              //           }else{
              //               reject("getallskvalue error")
              //           }
              //       }
              //   )
                querybysks.querybysks(data.skidarr)
                    .then(function (result) {
                        data.skvalue = result;
                        resolve(data)
                    })
            }
        }else {
          resolve(data);
        }
    })
}

// todo 如果querybysks.querybysks(data.skidarr)稳定，这个函数可删除
function buildskqueryfunction(skarr) {
    var fnarr = [];
    for(var i = 0 ; i < skarr.length;i++){
        var _usrid = skarr[i].usrid;
        var _itemid = skarr[i].itemid;
        var _flowid = skarr[i].flowid;
        var _skid = skarr[i].skid;

        var fn = function (callback) {
            var flowdb = eval("n"+_flowid);
            Simplekeyword.findOne({
                id:_skid
            }).exec(function(err,sk){
                if(err){
                  callback(null,'')
                }else if(!sk){
                  callback(null,'')
                }else{
                  //从库里查询对应的信息
                    if(_itemid != null || _itemid != ""){
                        flowdb.findOne({
                            id:_itemid
                        }).exec(function(err,info){
                            if(err){
                              callback(null,'')
                            }else{
                                //返回单值
                                var key = sk.key;
                                var value = '';
                                for(k in info){
                                    if(k == key){
                                        value = info[k];
                                    }
                                }
                                var _tempObj = {};
                                _tempObj.info = info;
                                _tempObj.sk = sk;
                                _tempObj.value = value;
                                callback(null,_tempObj)
                            }
                        })
                    }else{
                        var _temp = {};
                        _temp.sk = sk;
                        callback(null,_temp)
                    }
                }
            })
        };
        fnarr.push(fn);
    }
    return fnarr;
}

//获取所有的条件信息
function getallconditions(data) {
    return new Promise(function (resolve,reject) {
        // 是否需要进行计算，需要计算就需要排列，拿值，计算
        var isneedcalc = data.isneedcalc;
        if(isneedcalc){
            var _flowsSort = data.sortConnections;

            var _conditionIdarr = [];
            for(var i = 0 ; i < _flowsSort.length;i++){
                var _conditionId = _flowsSort[i].conditions.conditionID;
                var _temp = {};
                _temp.id = _conditionId;
                _conditionIdarr.push(_temp);
            }
            Flowconditions.find({
                or:_conditionIdarr
            }).exec(function (err,flowconditions) {
                if(!flowconditions){
                    reject("getallconditions error")
                }else{
                    data.conditions = flowconditions;
                    resolve(data);
                }
            })
        }else{
          resolve(data);
        }
    })
}

//计算条件并选择下个节点的id
function calccondidations(data) {
    return new Promise(function (resolve, reject) {
        // 是否需要进行计算，需要计算就需要排列，拿值，计算
        var isneedcalc = data.isneedcalc;
        if(isneedcalc){
            var _sortConnections = data.sortConnections;
            var _flowsSortAlls = data.flowsSortAlls;
            var _usrid = data.usrid;
            var _flowid = data.flowid;
            var _itemid = data.itemid;
            //循环排列过的链接,计算

            for (var i = 0; i < _sortConnections.length; i++) {
                if (_sortConnections[i].conditions) {
                    // _conditionid可能会为''
                    var _conditionid = _sortConnections[i].conditions.conditionID;

                    // _conditionid可能会为空，_conditionid为空时_conditiondata会为undefined，没有_conditiondata的不参与计算，可视为没有条件
                    var _conditiondata = getdatabyconditionid(_conditionid, data);
                    //这里保存的是条件每一行计算出来的值
                    var rowResuarr = [];

                    // 有条件的进行计算
                    if (_conditiondata && _conditiondata.operations) {
                        //循环取条件的operations
                        for (var j = 0; j < _conditiondata.operations.length; j++) {
                            var operation = _conditiondata.operations[j].operation;
                            var keyid = _conditiondata.operations[j].func.keyid;
                            var keytype = _conditiondata.operations[j].func.keytype;
                            var operate = _conditiondata.operations[j].func.operate;
                            var value = _conditiondata.operations[j].func.value;

                            var keyvalue = 0;
                            if (keytype == "sk") {
                                 keyvalue = getvaluebyskid(keyid, data);
                            }
                            if (keytype == "ck") {
                                 keyvalue = getvaluebyckid(keyid, data);
                            }

                            //这是每一行条件的值
                            var rowResu = false;
                            var rowResuStr = `${keyvalue}${operate}${value}`;
                            rowResu = eval(rowResuStr);
                            if (Number(keyvalue) && Number(value)) {
                                rowResuStr = `${keyvalue}${operate}${value}`;
                                rowResu = eval(rowResuStr)
                            }else{
                              rowResu = false;
                            }
                            console.log('--condition rowCondition:--')
                            console.log(`${keyvalue}${operate}${value}` + '--> :' + rowResu)
                            rowResuarr.push(rowResu);
                        }
                    }

                    var finalResu = false;
                    var finalResuArr = [];
                    // 这里对有优先级但无条件的一条直接赋值结果为true，无条件没法计算，直接赋值
                    if(!_conditiondata.operations[0].operation && !_conditiondata.operations[0].func.operate && !_conditiondata.operations[0].func.value){
                      finalResu = true;
                    }else{
                        //这里对多行计算出的结果进行计算
                        var colStr = rowResuarr[0];
                        for (var k = 1; k < rowResuarr.length; k++) {
                            colStr += `${operation}${rowResuarr[k]}`;
                        }
                        console.log('--conditionFinalResult--')
                        console.log(colStr + '-> :'+eval(colStr))
                        finalResu = eval(colStr);
                    }

                    //这里保存的是没个条件的结果，作为每个条件都不满足，取优先级最大的那个作为下个节点
                    finalResuArr.push(finalResu);

                    //这里判断的是有条件 == true执行，直接返回结果，不再继续执行
                    if (finalResu == true) {
                        var _flows = data.flowinfo.flows;
                        var _currentnodeid = data.currentnodeid;
                        for (var m = 0; m < _flows.length; m++) {
                            if (_flows[m].start == _currentnodeid && _flows[m].type == "forward" && _flows[m].conditions.conditionID == _conditionid) {
                                data.nextnodeid = _flows[m].end;
                            }
                        }
                        //条件满足，跳出循环
                         resolve(data);
                         return;
                    }
                }
            }

            //这里判断所有条件都不满足，选择优先级中数字最大的作为执行条件，优先级：1>2....
             for(var n = 0 ; n < finalResuArr.length;n++){
                  var isneedDefaultCondition = false;
                  if(finalResuArr[i] != false){
                      isneedDefaultCondition = true;
                  }
             }

            //条件都不满足，这里招排序过的条件的最后一条，作为执行条件
            //这里的data.sortConnections是根据priority排序过后的
            if(isneedDefaultCondition){
                var _flowsSortAllsLen =  _flowsSortAlls.length;
                var connection = _flowsSortAlls[_flowsSortAllsLen - 1];
                var choosedEnd = connection.end;
                data.nextnodeid = choosedEnd;
                resolve(data);
            }
        }else {
            resolve(data);
        }
    })
}

//根据ckid返回对应的值
function getvaluebyskid(skid,data) {
    var skvalue = data.skvalue;
    for(var i = 0 ; i < skvalue.length;i++){
        if(skvalue[i].sk.id == skid){
            return skvalue[i].value;
        }
    }
}

//根据ckid返回对应的值,这里暂时只能使用一个ck
function getvaluebyckid(ckid,data) {
    return data.ckvalue.value[0];
}

//跟据条件的id获取条件信息
function getdatabyconditionid(conditionid,data) {
    if(!conditionid){
        return
    }
    var _conditions = data.conditions;
    for(var i = 0; i < _conditions.length;i++){
        if(_conditions[i].id == conditionid){
            return _conditions[i]
        }
    }
}

//根据审批意见或者新提交的数据选择从本节点出发的forward条件，按优先级排序。顺序：1>2....
function selectforwardcondidations(data){
    return new Promise(function (resolve, reject) {
        var _flows = data.flowinfo.flows;
        var _currentnodeid = data.currentnodeid;
        // 有优先级的flow组
        var _tempflowsarr = [];
        // 没有优先级的flow组
        var _hasnotflowarr = [];

        var _nextnodeid = "";
        // 需要进行计算
        var _isneedcalc = false;
        for(var i = 0; i <_flows.length;i++){
            //这里对一个节点出发的所有连线上有优先级的条件进行排序
            // 这里对有优先级的条件进行排序，不管是不是有条件,没有优先级的条件视为废条件
            // 其实，只要有优先级，就有条件id，不过条件中各参数为空，可能有为（0）
            if (_currentnodeid == _flows[i].start && _flows[i].type == "forward" && (_flows[i].priority && _flows[i].priority != "0")) {
              _tempflowsarr.push(_flows[i]);

              // 需要计算，就需要取ck和sk的id和值进行计算，给true
              _isneedcalc = true;
            } else if (_currentnodeid == _flows[i].start && _flows[i].type == "forward" && (!_flows[i].priority || _flows[i].priority == "0")) {
              _hasnotflowarr.push(_flows[i]);

              // 没有条件的，不管多少个链接，只返回第一个链接
              _nextnodeid = _hasnotflowarr[0].end;
            }
          }
          // 这是有优先级的排序过后的flow
          var _flowsSort = _tempflowsarr.sort(compare('priority'));

        // 这是将没有优先级的flow追加到有优先级的排序过后的flow的最后
        var _flowsSortAlls = _flowsSort.concat(_hasnotflowarr);
        data.isneedcalc = _isneedcalc;
        data.nextnodeid = _nextnodeid;
        data.sortConnections = _flowsSort;
        data.flowsSortAlls = _flowsSortAlls;
        resolve(data)
    })
}

//数据中的几个状态：新创建，待审批，待修改，已完成
function writenextnodeinfo(data){
    return new Promise(function (resolve, reject) {
        // isforecast 是否是预测下个节点，不是，存库，是，resolve
        if(data.isforecast == false){
            var _submitinfo = data.submitinfo;
            var _itemid = data.itemid;
            var _flowid = data.flowid;
            var _forwardnextnodeid = data.nextnodeid;
            var _backnextnodeid = data.backnextnodeid;
            var _nextnodeid = "";
            var flowdb = eval("n" + _flowid);
            // 如果有shenpistatus，则视为审批
            if(_submitinfo.shenpistatus){
              //审批同意，写入正向的下一个节点，即nextnodeid
                if(_submitinfo.shenpistatus == "approve"){
                    _nextnodeid = _forwardnextnodeid;
                }else if(_submitinfo.shenpistatus == "deny"){
                    _nextnodeid = _backnextnodeid;
                }
              // 审批不同意，写入反向的节点，backnextnodeid
            }else{
                _nextnodeid = _forwardnextnodeid;
              // 提交数据也使用正向的下一个节点，即nextnodeid
            }
            console.log('------_nextnodeid')
            console.log(_nextnodeid)
            if(_nextnodeid != ''){
              flowdb.update(
                {id: _itemid},
                {
                  nextnodeid: _nextnodeid,
                  nextflowid:_flowid
                }
              ).exec(function (err, flowdata) {
                if(!flowdata){
                  reject("writenextnodeinfo update error")
                }else {
                  resolve(data);
                }
              });
            }else{
              resolve(data);
            }

        }else{
            resolve(data)
        }
    })
}


function recordashistory(data){
    //这里接收的data是更改过状态之后的data
    return new Promise(function (resolve, reject) {
        // 判断是不是预测下个节点，不是，存库，是，resolve
        if(data.isforecast == false){
            var _tempdata = {};
            var _submitinfo = data.submitinfo;
            var _itemid = data.itemid;
            var _flowid = data.flowid;
            var _nodeid = data.currentnodeid;

            //如果有shenpistatus,则视为审批
            if(_submitinfo.shenpistatus){
                if(_submitinfo.shenpistatus == "approve"){
                    _tempdata.shenpistatus = "approve";
                }else if(_submitinfo.shenpistatus == "deny"){
                    _tempdata.shenpistatus = "deny";
                }
                _tempdata.shenpiuserid = data.usrid;
                _tempdata.shenpicomments = _submitinfo.shenpicomments;
            }else{
                // 没有则视为普通提交数据
                _tempdata.shenpiuserid = data.usrid;
                _tempdata.shenpicomments = "";
                _tempdata.shenpistatus = "approve";
            }
            _tempdata.flowid = _flowid;
            _tempdata.nodeid = _nodeid;
            _tempdata.itemid = _itemid;

            Approvalhistory.create(
                _tempdata
            ).exec(function(err, approver){
                if(!approver){
                    reject("Approvalhistory error")
                }else{
                    data.approverid = approver.id;
                    resolve(data)
                }
            })
        }else{
            resolve(data)
        }
    })
}


//根据对象的某个值进行排序,selectallcondidations中引用
function compare(prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
}

// 获取两个数组的交集，有共同值，返回数组，没有，返回空数组
function getArrayMixedVal(arr1,arr2){
  var arr3=[];
  for(var s in arr1){
    for(var x in arr2){
      if(arr1[s]==arr2[x]){
        arr3.push(arr1[s]);
      }
    }
  }
  return arr3;
}
