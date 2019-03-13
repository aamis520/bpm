/**
 * Created by demo on 2017/8/22.
 */
module.exports = {
  startprocess:function (usrid,flowid,itemid,submitInfo,nextNodeid) {
    return new Promise(function (resolve,reject) {
      readflowinfo(usrid,flowid,itemid,submitInfo,nextNodeid)
        .then(getlateseflowdata) // 获取本次审批的数据
        .then(readEndConditionid)  // 读出结束条件设置的条件:data.endNodeConditionid
        // 之后每一步都判断data.hasEndCondition
        .then(readEndConditionByid)// 根据结束节点的条件id读出结束节点的条件
        .then(getrelatedflowdataidArr) // 取出相关流程的数据的flowid
        .then(getrelatedflowdata) // 取出相关流程的数据
        .then(buliddatafornewflow) //按照结束节点指定的条件，准备好需要赋值给新流程的数据
        .then(writedatafornewflow) // 将准备好的数据，写入到新流程中
        .then(function (resu) {
          // 这里有执行顺序的问题，writeinnewflowdataid不一定有，endapproverid一定有
        })
    })
  }
};
// 获取本次审批的数据
function getlateseflowdata(data) {
  return new Promise(function (resolve,reject) {
    var _itemid = data.itemid;
    var _flowid = data.flowid;
    var _flowdb = eval('n'+_flowid);
    _flowdb.findOne({
      id:_itemid
    }).exec(function (err,flowdata) {
      if(!flowdata){
        reject('未读取到本次数据')
      }else{
        data.lastestflowdata = flowdata;
        resolve(data)
      }
    })
  })
}

// 取相关流程的数据
function getrelatedflowdata(data) {
  return new Promise(function (resolve,reject) {
    if(data.endNodeConditionid){
      var _dataneedflowidarr = data.dataneedflowidarr;
      var _itemid = data.itemid;
      async.series(
        buildflowdataqueryfunctions(_dataneedflowidarr,_itemid),
        function (err,results) {
          if(results){
            data.result = results;
            resolve(data)
          }
        }
      )
    }
  })
}

// 生成查询的函数
function buildflowdataqueryfunctions(arr,itemid) {
  var ret = [];
  for(var i = 0 ; i < arr.length;i++){
    // 这里必须得闭包，不然_flowid取到的是最后一次循环的值
    (function () {
      var _flowid = arr[i];
      var flowDataQueryFn = function (callback) {
        var _flowdb = eval('n' + _flowid);
        _flowdb.find({
          parentid:itemid
        }).exec(function (err,val) {
          if(!val){
            callback(null,"")
          }else{
            callback(null,val);
          }
        })
      };
      ret.push(flowDataQueryFn)
    })(i)
  }
  return ret;
}

// 取出相关流程的数据的flowid
function getrelatedflowdataidArr(data) {
  return new Promise(function (resolve,reject) {
    if(data.endNodeConditionid){
      var _condition = data.endNodeConditionInfo;
      var _DataNeedFlowidArr = [];

      if(_condition.condition && _condition.condition.length > 0){
        for(var i = 0 ; i < _condition.condition.length;i++){
          if(_condition.condition[i].relatedflow){
            if(_condition.condition[i].relatedflow.fromflowid){
              _DataNeedFlowidArr.push(_condition.condition[i].relatedflow.fromflowid)
            }
          }
        }
      }
        var _DataNeedFlowidArrUnique = [];
        _DataNeedFlowidArrUnique = uniqueArr(_DataNeedFlowidArr);
        data.dataneedflowidarr = _DataNeedFlowidArrUnique;
        resolve(data)
    }else{
      resolve(data)
    }
  })
}

// 读出本流程的信息
function readflowinfo(usrid,flowid,itemid,submitInfo,nextNodeid) {

  return new Promise(function (resolve,reject) {
    Flow.findOne({
      id:flowid
    }).exec(function (err,flowinfo) {
      if(!flowinfo){
        reject("未找到flow")
      }else{
        var data = {};
        data.usrid = usrid;
        data.flowid = flowid;
        data.itemid = itemid;
        data.submitinfo = submitInfo;
        data.nextnodeid = nextNodeid;
        data.flowinfo = flowinfo;
        resolve(data)
      }
    })
  })
}

// 读出结束条件的id，同时判断需不需要给新的流程赋值,这里读出的是个数组
function readEndConditionid(data) {
  return new Promise(function (resolve,reject) {
    var _flowInfo = data.flowinfo;
    var _endNodeid = data.nextnodeid;
    var _endNodeConditionid = "";
    for(var i = 0;i < _flowInfo.nodes.length;i++){
      if(_flowInfo.nodes[i].nodeid == _endNodeid){
        _endNodeConditionid = _flowInfo.nodes[i].endConditionID;
      }
    }
    data.endNodeConditionid = _endNodeConditionid;
    resolve(data)
  })
}

// 根据结束节点的条件id读出结束节点的条件
function readEndConditionByid(data) {
  return new Promise(function (resolve,reject) {
    if(data.endNodeConditionid){
      var _endNodeConditionid = data.endNodeConditionid;
      Endnodeconditions.findOne({
        id:_endNodeConditionid
      }).exec(function (err,endnodecondition) {
        if (!endnodecondition){
          reject("未找到endnodecondition")
        }else{
          data.endNodeConditionInfo = endnodecondition;
          resolve(data)
        }
      })
    }else{
      resolve(data)
    }
  })
}

//按照结束节点指定的条件，准备好需要赋值给新流程的数据
function buliddatafornewflow(data) {
  return new Promise(function (resolve,reject) {
    if(data.endNodeConditionid) {
      var _endNodeConditionInfo = data.endNodeConditionInfo;
      var curFlowData = data.lastestflowdata;
      // 这是最后需要赋值给data的变量
      var retArr = [];
      if (_endNodeConditionInfo.condition && _endNodeConditionInfo.condition.length > 0) {
        for (var i = 0; i < _endNodeConditionInfo.condition.length; i++) {
          // 这是判断本流程的
          if (_endNodeConditionInfo.condition[i].toflowid) {
            var _tempCurDataObj = {};
            _tempCurDataObj.flowid = _endNodeConditionInfo.condition[i].toflowid;
            _tempCurDataObj.data = [];
            var _eachTempCurDataObj = {};
            _eachTempCurDataObj.data = {};
            _eachTempCurDataObj.condition = {};
            _eachTempCurDataObj['data'].flowid = _endNodeConditionInfo.condition[i].toflowid;
            if(_endNodeConditionInfo.condition[i].tonodeid){
              _eachTempCurDataObj['data'].nodeid = _endNodeConditionInfo.condition[i].tonodeid
            }
            if(_endNodeConditionInfo.condition[i].tonextnodeid){
              _eachTempCurDataObj['data'].nextnodeid = _endNodeConditionInfo.condition[i].tonextnodeid
            };
            if(curFlowData.usrid){
              _eachTempCurDataObj['data'].usrid = curFlowData.usrid;
            }
            if(_endNodeConditionInfo.condition[i].condition && _endNodeConditionInfo.condition[i].condition.length > 0){
              for (var ii = 0; ii < _endNodeConditionInfo.condition[i].condition.length; ii++) {
                _eachTempCurDataObj["data"][_endNodeConditionInfo.condition[i].condition[ii].toSkName] = curFlowData[_endNodeConditionInfo.condition[i].condition[ii].fromSkName];
                if(_endNodeConditionInfo.condition[i].condition[ii].checked && _endNodeConditionInfo.condition[i].condition[ii].checked == "true"){
                  _eachTempCurDataObj["condition"][_endNodeConditionInfo.condition[i].condition[ii].toSkName] = curFlowData[_endNodeConditionInfo.condition[i].condition[ii].fromSkName];
                }
              }
              _tempCurDataObj.data.push(_eachTempCurDataObj);
              retArr.unshift(_tempCurDataObj);
            }
            // 这是判断相关流程的，以下的else if之间，顺序不能变

            // 这一个是判断相关流程中同时有有本流程和其他流程，目标流程的id以本流程中定的目标流程为准
          } else if (_endNodeConditionInfo.condition[i].curflow && _endNodeConditionInfo.condition[i].relatedflow) {
            var _tempRelateAndCurObj = {};
            _tempRelateAndCurObj.flowid = _endNodeConditionInfo.condition[i].curflow.toflowid;
            _tempRelateAndCurObj.data = [];
            var _tempRelatedRelatedData = getflowDataByFlowid(_endNodeConditionInfo.condition[i].relatedflow.fromflowid, data.result);
            if(_tempRelatedRelatedData && _tempRelatedRelatedData.length > 0){
              for (var ij = 0; ij < _tempRelatedRelatedData.length; ij++) {
                var _tempRelatedRelatedObj = {};
                _tempRelatedRelatedObj.data = {}
                _tempRelatedRelatedObj.condition = {}
                _tempRelatedRelatedObj['data'].flowid = _endNodeConditionInfo.condition[i].curflow.toflowid;
                if(_endNodeConditionInfo.condition[i].tonodeid){
                  _tempRelatedRelatedObj['data'].nodeid = _endNodeConditionInfo.condition[i].tonodeid
                }
                if(_endNodeConditionInfo.condition[i].tonextnodeid){
                  _tempRelatedRelatedObj['data'].nextnodeid = _endNodeConditionInfo.condition[i].tonextnodeid
                };
                if(curFlowData.usrid){
                  _tempRelatedRelatedObj['data'].usrid = curFlowData.usrid;
                }
                if( _endNodeConditionInfo.condition[i].curflow.condition && _endNodeConditionInfo.condition[i].curflow.condition.length > 0){
                  for (var d = 0; d < _endNodeConditionInfo.condition[i].curflow.condition.length; d++) {
                    _tempRelatedRelatedObj["data"][_endNodeConditionInfo.condition[i].curflow.condition[d].toSkName] = curFlowData[_endNodeConditionInfo.condition[i].curflow.condition[d].fromSkName];
                    if(_endNodeConditionInfo.condition[i].curflow.condition[d]['checked'] && _endNodeConditionInfo.condition[i].curflow.condition[d]['checked'] == 'true'){
                      _tempRelatedRelatedObj["condition"][_endNodeConditionInfo.condition[i].curflow.condition[d].toSkName] = curFlowData[_endNodeConditionInfo.condition[i].curflow.condition[d].fromSkName];
                    }
                  }
                }

                if(_endNodeConditionInfo.condition[i].relatedflow.condition && _endNodeConditionInfo.condition[i].relatedflow.condition.length > 0){
                  for (var e = 0; e < _endNodeConditionInfo.condition[i].relatedflow.condition.length; e++) {
                    _tempRelatedRelatedObj['data'][_endNodeConditionInfo.condition[i].relatedflow.condition[e].toSkName] = _tempRelatedRelatedData[ij][_endNodeConditionInfo.condition[i].relatedflow.condition[e].fromSkName];
                    if(_endNodeConditionInfo.condition[i].relatedflow.condition[e].checked && _endNodeConditionInfo.condition[i].relatedflow.condition[e].checked == "true"){
                      _tempRelatedRelatedObj['condition'][_endNodeConditionInfo.condition[i].relatedflow.condition[e].toSkName] = _tempRelatedRelatedData[ij][_endNodeConditionInfo.condition[i].relatedflow.condition[e].fromSkName];
                    }
                  }
                }
                _tempRelateAndCurObj.data.push(_tempRelatedRelatedObj);
              }
            }
            retArr.push(_tempRelateAndCurObj);

            // 判断相关流程中只有本流程部分,没有相关流程部分
          } else if (_endNodeConditionInfo.condition[i].curflow && !_endNodeConditionInfo.condition[i].relatedflow) {
            var _tempRelCurObj = {};
            _tempRelCurObj.data = [];
            _tempRelCurObj.flowid = _endNodeConditionInfo.condition[i].curflow.toflowid;

            var eachTempRelCurObj = {};
            eachTempRelCurObj.data = {};
            eachTempRelCurObj.condition = {};
            eachTempRelCurObj['data'].flowid = _endNodeConditionInfo.condition[i].curflow.toflowid;
            if(_endNodeConditionInfo.condition[i].tonodeid){
              _tempRelatedRelatedObj['data'].nodeid = _endNodeConditionInfo.condition[i].tonodeid
            }
            if(_endNodeConditionInfo.condition[i].tonextnodeid){
              _tempRelatedRelatedObj['data'].nextnodeid = _endNodeConditionInfo.condition[i].tonextnodeid
            }
            if(curFlowData.usrid){
              eachTempRelCurObj['data'].usrid = curFlowData.usrid;
            }
            if(_endNodeConditionInfo.condition[i].curflow.condition && _endNodeConditionInfo.condition[i].curflow.condition.length > 0){
              for (var ik = 0; ik < _endNodeConditionInfo.condition[i].curflow.condition.length; ik++) {
                eachTempRelCurObj['data'][_endNodeConditionInfo.condition[i].curflow.condition[ik].toSkName] = curFlowData[_endNodeConditionInfo.condition[i].curflow.condition[ik].fromSkName];
                if(_endNodeConditionInfo.condition[i].curflow.condition[ik].checked && _endNodeConditionInfo.condition[i].curflow.condition[ik].checked == "true"){
                  eachTempRelCurObj['condition'][_endNodeConditionInfo.condition[i].curflow.condition[ik].toSkName] = curFlowData[_endNodeConditionInfo.condition[i].curflow.condition[ik].fromSkName];
                }
              }
            }
            _tempRelCurObj.data.push(eachTempRelCurObj);
            retArr.push(_tempRelCurObj);
          }
          // 判断相关流程中的相关流程部分，没有本流程部分
          /*else if (_endNodeConditionInfo.condition[i].relatedflow && !_endNodeConditionInfo.condition[i].curflow) {
            var _tempRelRelObj = {};
            _tempRelRelObj.data = [];
            _tempRelRelObj.flowid = _endNodeConditionInfo.condition[i].relatedflow.toflowid;
            var _tempRelRelData = getflowDataByFlowid(_endNodeConditionInfo.condition[i].relatedflow.fromflowid, data.result);
            for (var f = 0; f < _tempRelRelData.length; f++) {
              // 每一条数据就是一个新的Obj
              var _eachTempRelRelObj = {};
                  _eachTempRelRelObj.data = {};
                  _eachTempRelRelObj.condition = {};
                  _eachTempRelRelObj['data'].flowid = _endNodeConditionInfo.condition[i].relatedflow.toflowid;
              if(_endNodeConditionInfo.condition[i].relatedflow.condition && _endNodeConditionInfo.condition[i].relatedflow.condition.length > 0){
                for (var fi = 0; fi < _endNodeConditionInfo.condition[i].relatedflow.condition.length; fi++) {
                  _eachTempRelRelObj['data'].usrid = _tempRelRelData[f].usrid;
                  _eachTempRelRelObj['data'][_endNodeConditionInfo.condition[i].relatedflow.condition[fi].toSkName] = _tempRelRelData[f][_endNodeConditionInfo.condition[i].relatedflow.condition[fi].fromSkName];
                  if(_endNodeConditionInfo.condition[i].relatedflow.condition[fi].checked && _endNodeConditionInfo.condition[i].relatedflow.condition[fi].checked == "true"){
                    _eachTempRelRelObj['condition'][_endNodeConditionInfo.condition[i].relatedflow.condition[fi].toSkName] = _tempRelRelData[f][_endNodeConditionInfo.condition[i].relatedflow.condition[fi].fromSkName];
                  }
                }
              }
              _tempRelRelObj.data.push(_eachTempRelRelObj);
            }
            retArr.push(_tempRelRelObj);
          }*/
        }
      }
      data.writefornew = retArr;
      resolve(data)
    }else {
      resolve(data)
    }
  })
}

function getflowDataByFlowid(id,arr) {
  var ret = [];
  for(var i = 0 ; i < arr.length;i++){
    for(var j = 0 ; j < arr[i].length;j++){
      if(arr[i][j].flowid == id){
        ret.push(arr[i][j])
      }
    }
  }
  return ret;
}

// 将准备好的数据，写入到新流程中
function writedatafornewflow(data) {
  return new Promise(function (resolve,reject) {
    if(data.endNodeConditionid){
      async.series(
        buildcreatedata(data.writefornew),
        function (err,result) {
          if(!result){
            reject("向新流程赋值失败")
          }else{
            resolve(result);
          }
        }
      )
    }else{
      resolve(data)
    }
  })
}

function buildcreatedata(obj) {
  var ret = [];
  for(var j = 0 ; j< obj.length;j++){
    for(var i = 0 ; i < obj[j].data.length;i++){
      // 这里不用闭包， _flowid取值会异常
      (function () {
        var cont = obj[j].data[i].data;
        var _flowid = obj[j].flowid;
        var _condition = obj[j].data[i].condition;
        var buildcreatedatafn = function (callback) {
          if(isEmptyObj(_condition)){
            eval("n"+_flowid).create(
              cont
            ).exec(function (err,crdata) {
              if(!crdata){
                callback(null,"")
              }else{
                callback(null,crdata.id)
              }
            })
          }else{
            eval('n'+_flowid).find(
              _condition
            ).exec(function (err,val) {
                if(val && val.length > 0){
                  eval('n'+_flowid).update(
                    _condition,
                    cont
                  ).exec(function(err,upval){
                    if(!upval){
                      callback(null,'')
                    }else{
                      callback(null,upval)
                    }
                  })
                }else{
                  eval("n"+_flowid).create(
                    cont
                  ).exec(function (err,crdata) {
                    if(!crdata){
                      callback(null,"")
                    }else{
                      callback(null,crdata.id)
                    }
                  })
                }
            })
          }
        }
        ret.push(buildcreatedatafn)
      })(i)
    }
  }
  return ret;
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

// 判断是不是空对象
function isEmptyObj(o) {
  for(var t in o) {
    return !1;
  }
  return !0;
}
