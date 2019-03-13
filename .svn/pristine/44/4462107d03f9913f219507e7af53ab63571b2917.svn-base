/**
 * Created by demo on 2017/7/3.
 */
"use strict";

var SystemKeyHandler = require("./SystemKeyHandler.js");
var Util = require("./util.js");
module.exports = {
  querybyckfn:function (keywordid,usrid,itemid){
    return new Promise(function (resolve,reject) {
      Complexkeyword.findOne({
        id: keywordid
      }).exec(function (err, ck) {
        if (!ck) {
          reject('未找到这个ck');
        } else {
          var _para = {"usrid": usrid};
          //思路：先根据条件取所有数据，然后进行行内操作，再进行纵向操作
          getallskinfo(ck, _para,itemid)//lyd 找到所有的sk的信息，主要使用sk的id，理解为便于拿数据具体值，找出sk的id，在下边拿
            .then(SystemKeyHandler.startprocess)// 这是系统关键字
            .then(quaryusersinfo)//找人员信息，这时候，ck中的person的值还没有增加name这一项
            .then(geteachrowconditionflowid) // 获取每一行条件的flowid
            .then(getallflowidsforitemid) // 根据每一行条件的flowid和传入的itemid找rangevalue的值
            .then(getitemiddatafromalldocus)// 从ck中取到值为para.itemid对应的一条数据
            .then(addwhonametopersonscondition)// 向条件中写入whoname，存的是当前persons中人员的realname
            .then(queryalldatabycondidtion) //lyd这里是根据ck下找出的所有的sk的id，去对应的flow下找所有的sk具体数据
            .then(groupforcalculate)//groupby，需要进行groupby的时候，进行groupby
            .then(calculate)// 计算单行
            .then(calcmanyrows)//计算多行的数据并整理返回的数据结构
            .then(buildreply) // 整理返回结果
            .then(function (reply) {
              resolve(reply)
            })
        }
      });
    })
  }
};

///////////////////////////////////////////////////////////////////////////////
//向cks的person中写入realname，便于在查找数据时候，用id和loginname查
function addwhonametopersonscondition(data) {
  return new Promise(function (resolve,reject) {
    var _condition = data.cks.operations;
    for(var i = 0 ; i < _condition.length;i++){
      var whoid = _condition[i].condition.persons.who;
      var realname = getuserrealname(whoid,data.usersinfo)
      var loginname = getusrloginname(whoid,data.usersinfo)
      data.cks.operations[i].condition.persons.realname = realname;
      data.cks.operations[i].condition.persons.loginname = loginname;
    }
    resolve(data)
  })
}

// 如果有itemid，取出每一行条件的flowid，组成数组，去重
function geteachrowconditionflowid(data) {
  return  new Promise(function (resolve,reject) {
    if(data.itemid){
      var _operations = data.cks.operations;
      var ret = [];
      for(var i = 0 ; i < _operations.length;i++){
        ret.push(_operations[i].flowid)
      }
      data.flowidarr = uniqueArr(ret);
      resolve(data)
    }else{
      resolve(data)
    }
  })
}

// 根据传入的itemid和每一行的flowid，取出数据
function getallflowidsforitemid(data) {
  return new Promise(function (resolve,reject){
    if(data.itemid){
      // 找出所有的flowid
      Flow.find({

      }).exec(function (err,flows) {
        if(flows && flows.length >0){
          var _arr = [];
          for(var i = 0 ; i < flows.length;i++){
            _arr.push(flows[i].id)
          }
          data.allflowids = _arr;
          resolve(data)
        }else{
          reject(err)
        }
      })
    }else{
      resolve(data)
    }
  })
}

// 从ck中取到值为para.item的一项，取出对应的key
function getitemiddatafromalldocus(data) {
  return new Promise(function (resolve,reject) {
    if(data.itemid){
      var _allflowids = data.allflowids;
      async.series(
        buildfntofinditemdata(_allflowids,data.itemid),
        function (err,resu) {
          if(resu){
            var obj = {}
            for(var i=0;i<resu.length;i++){
              if(Util.isArray(resu[i])){
                obj = resu[i][0];
              }
            }
            data.itemiddata = obj;
            resolve(data)
          }
        }
      )
    }else{
      resolve(data)
    }
  })
}

// 根据所有的flowid和itemid找出item对应的数据
function buildfntofinditemdata(flowids,itemid) {
  var ret = [];
  for(var i = 0 ; i < flowids.length;i++){
    (function(){
      try {
        var _flowid = flowids[i];
        var _flowdb = eval('n' + _flowid);
        var _fn = function (callback) {
          _flowdb.find({
            id: itemid
          }).exec(function (err, data) {
            if (data && data.length > 0) {
              callback(null, data)
            } else {
              callback(null, '')// 这里故意写成返回''
            }
          })
        };
        ret.push(_fn)
      } catch (e) {
        // console.log('--------' + e)
      }
    }())
  }
  return ret;
}
// 跟据flowid和itemid，组件查询函数
function buildqueryrangevaluefn(flowidarr ,itemid) {
  var ret = [];
  for(var i = 0 ; i < flowidarr.length;i++){
    (function (i) {
      var queryrangevaluefn = function (callback) {
        var flowid = flowidarr[i];
        var  flowdb = eval("n"+flowid);
        flowdb.findOne(
          {id:itemid}
        ).exec(function (err,val) {
          if(!val){
            callback(null,"")
          }else {
            callback(null,val)
          }
        })
      };
      ret.push(queryrangevaluefn)
    }(i))

  }
  return ret;
}

// 根据flowid和keyname找出相对应的值
function getrangekeyval(flowid,keyname,arr) {
  for(var i = 0 ; i < arr.length;i++){
    if(arr[i].flowid == flowid){
      return arr[i][keyname]
    }
  }
}

//for compelx key
//根据条件来对每一项进行搜索。
function getallskinfo(ck,_para,itemid){
  return new Promise(function (resolve, reject) {
    Simplekeyword.find({
      or : getkeylike(ck,"skid")
    }).exec(function (err, sks) {
      if (sks) {
        var data = {};
        data.cks = ck;
        data.sks = sks;
        data._para = _para;
        data.itemid = itemid;
        resolve(data);
        //lyd   这里是返回找出的sk的信息，同时返回传入的ck，理解为sks是个[{},...]  log确定
      } else {
        reject(err);
      }
    })
  });
}

function queryalldatabycondidtion(data){
  //这里的cks也就是ck所有数据
  var cks = data.cks; // 原始的complex key
  var sks = data.sks; // 取出的simple key类型。
  var itemiddata = data.itemiddata;
  return new Promise(function (resolve, reject) {
    //异步调用所有的
    async.series(
      //lyd 这里是准备一个队列，是一组XXX.find(){}...
      buildckqueryfunctions({cks:cks, sks:sks,itemiddata:itemiddata})
      ,function(err, results) {//lyd   log一下看找到的数据的结果！
        if (results) {
          data.results = results;
          resolve(data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function calculate(data) {
  return new Promise(function (resolve,reject) {
    if(data.groupforcalc){
      var _forcalc = data.groupforcalc;
      for(var i = 0;i < _forcalc.length;i++){
        for(var keylevel1 in _forcalc[i]){
          if(keylevel1 == "operate"){
            var rst = eachrowcalc(_forcalc[i]);
            rst['preOperate'] = _forcalc[i]["preOperate"];
            _forcalc[i] = rst;
            break
          }
          if(Util.isObject(_forcalc[i][keylevel1])){
            for(var keylevel2 in _forcalc[i][keylevel1]){
              if(keylevel2 == "operate"){
                var rst = eachrowcalc(_forcalc[i][keylevel1]);
                _forcalc[i][keylevel1] = rst;
                break
              }
              if(Util.isObject(_forcalc[i][keylevel1][keylevel2])){
                for(var keylevel3 in _forcalc[i][keylevel1][keylevel2]){
                  if(keylevel3 == "operate"){
                    var rst = eachrowcalc(_forcalc[i][keylevel1][keylevel2]);
                    _forcalc[i][keylevel1][keylevel2] = rst;
                    break
                  }
                }
              }
            }
          }
        }
      }
      // add多行结果合并
      data.forrowcalc = _forcalc;
      data.firstforrowcalc = _forcalc[0];
      resolve(data)
    }else{
      resolve(data)
    }
  })
}

// 对每一行进行计算
// { keyL: '收入金额
//   valL:
//     [ '10000',
//       '10000',
//       '10000',
//       '10000',
//       '10000',
//       '10000',
//       '10000',
//       '10000',
//       '10000',
//       '1011000'
//       operateL: 'sum’，
//   keyR: '',
//     valR: [],
//   operateR: '',
//   operate: '' }
function eachrowcalc(obj) {
  // 为接收的参数
  var _valL = obj.valL;
  var _valR = obj.valR;
  var _operateL = obj.operateL;
  var _operateR = obj.operateR;
  var _operate = obj.operate;

  // 左侧值是不是可计算
  var _isCalcAbleL = true;
  // 右边的值是不是可计算
  var _isCalcAbleR = true;
  // 左右之间是不是可计算的
  var _isCalcAble = true;
  // 这是中间保存的要返回的值
  var ret = {};
  // 这是最终要return的值
  var finalRet = {};

  // 判断左边的值是不是可计算的,左侧为空数组，也视为不可计算
  if(_valL && _valL.length > 0){
    for(var il = 0; il < _valL.length;il++){
      // 判断只要有一个不能转为数字则不可计算
      if(isNaN(Number(_valL[il]))){
        _isCalcAbleL = false;
        break
      }
    }
  }else {
    _isCalcAbleL = false;
  }

  // 判断右边的值是不是可计算的，右侧为空数组，也视为不可计算
  if(_valR && _valR.length > 0){
    for(var ir = 0 ; ir < _valR.length;ir++){
      // 判断只要有一个不能转为数字则不才可计算
      if(isNaN(Number(_valR[ir]))){
        _isCalcAbleR = false;
        break
      }
    }
  }else{
    _isCalcAbleR = false;
  }

  // 先对左侧数据进行处理
  if(_isCalcAbleL){
    if(_operateL == "sum"){
      ret['valL'] = Util.arraysum(_valL)
    }else if(_operateL == "avg"){
      ret['valL'] = Util.arrayaveg(_valL)
    }else if (_operateL == ""){
      var _valNumArrL = [];
      for(var al = 0; al < _valL.length;al++){
        if(!isNaN(Number(_valL[al]))){
          _valNumArrL.push(Number(_valL[al]))
        }
      }
      ret['valL'] = _valNumArrL
    }
  }else{
    // 这里是不可计算的情况
    // 只有前置条件为“”时，才会列出，否侧，取长度
    if(_operateL == ""){
      var _valNumArrL = [];
      for(var al = 0; al < _valL.length;al++){
        if(!isNaN(Number(_valL[al]))){
          _valNumArrL.push(Number(_valL[al]))
        }
      }
      ret['valL'] = _valL
    }else{
      ret['valL'] = _valL.length;
    }
  }

  // 对右边的数据进行处理
  if(_isCalcAbleR){
    if(_operateR == "sum"){
      ret['valR'] = Util.arraysum(_valR)
    }else if (_operateR == "avg"){
      ret['valR'] = Util.arrayaveg(_valR)
    }else if(_operateR == ""){
      var _valNumArrR = [];
      for(var ar = 0 ; ar < _valR.length;ar++){
        if(!isNaN(Number(_valR[ar]))){
          _valNumArrR.push(Number(_valR[ar]))
        }
      }
      ret['valR'] = _valNumArrR;
    }
  }else{
    // 这里是不可计算的情况
    // 只有前置条件为“”时，才会列出，否侧，取长度
    if(_operateR == "") {
      var _valNumArrR = [];
      for(var ar = 0 ; ar < _valR.length;ar++){
        if(!isNaN(Number(_valR[ar]))){
          _valNumArrR.push(Number(_valR[ar]))
        }
      }
      ret['valR'] = _valR;
    }else {
      ret['valR'] = _valR.length;
    }
  }

  // 用左右的出的值判断左右之间是不是可计算的
  var _tempIsCalcAbleL = true;
  if(!Util.isArray(ret['valL']) && isNaN(Number(ret['valL']))){
    _tempIsCalcAbleL = false;
  }else if (Util.isArray(ret['valL'])){
    if(ret['valL'].length > 0){
      for(var cl = 0;cl < ret['valL'].length;cl++){
        if(isNaN(Number(ret['valL'][cl]))){
          _tempIsCalcAbleL = false;
          break
        }
      }
    }else {
      _tempIsCalcAbleL = false;
    }
  }

  var _tempIsCalcAbleR = true;
  if(!Util.isArray(ret['valR']) &&isNaN(Number(ret['valR']))){
    _tempIsCalcAbleR = false
  }else if(Util.isArray(ret['valR'])){
    if(ret['valR'].length > 0){
      for(var cr = 0 ; cr < ret['valR'].length;cr++ ){
        if(isNaN(Number(ret['valR'][cr]))){
          _tempIsCalcAbleR = false;
          break
        }
      }
    }else {
      _tempIsCalcAbleR = false;
    }
  }

  // console.log("是否可计算 L:"+_tempIsCalcAbleL + "// R: " + _tempIsCalcAbleR);
  if(_tempIsCalcAbleL && _tempIsCalcAbleR){
    if(_operate == "+"){
      finalRet['data'] = Util.add(ret["valL"],ret["valR"])
    }else if (_operate == "-"){
      finalRet["data"] = Util.sub(ret["valL"],ret['valR'])
    }else if (_operate == "*"){
      finalRet["data"] = Util.app(ret["valL"],ret["valR"])
    }else if(_operate == "/"){
      finalRet["data"] = Util.divs(ret["valL"],ret["valR"])
    }else if (_operate == ""){
      // 如果两侧都是可计算的值，没有定义中间符号，取左侧的值
      finalRet["data"] = ret['valL'];
    }
  }else if(_tempIsCalcAbleL && !_tempIsCalcAbleR){
    finalRet['data'] = ret['valL']
  }else if(!_tempIsCalcAbleL && _tempIsCalcAbleR){
    finalRet['data'] = ret['valR']
  }else{
    if(Util.isArray(ret['valL']) && ret['valL'].length != 0 || typeof(ret['valL']) == "number"){
      finalRet["data"] = ret['valL']
    }else if(Util.isArray(ret['valR']) && ret['valR'].length != 0 || typeof(ret['valR']) == "number"){
      finalRet["data"] = ret['valR'];
    }
  }
  return finalRet;
}

// 整理返回结果
function buildreply(data) {
  return new Promise(function (resolve,reject) {
    var ret = {}
    ret['value'] = {}
    if(data.forrowcalc){
      var _forbuild;
      if(Util.isObject(data.forrowcalc)){
        _forbuild = data.forrowcalc;
      }
      if(Util.isArray(data.forrowcalc)){
        _forbuild = data.forrowcalc[0];
      }
      for(var keylev1 in _forbuild){
        if(keylev1 == 'data'){
          ret['value'] = _forbuild['data'];
        }else if(Util.isObject(_forbuild[keylev1])){
          ret['value'][keylev1] = {};
          for(var keylev2 in _forbuild[keylev1]){
            if(keylev2 == "data"){
              ret['value'][keylev1] = _forbuild[keylev1]["data"]
            }else if(Util.isObject(_forbuild[keylev1][keylev2])){
              ret['value'][keylev1][keylev2] = {}
              for(var keylev3 in _forbuild[keylev1][keylev2]){
                if(keylev3 == 'data'){
                  ret['value'][keylev1][keylev2] = _forbuild[keylev1][keylev2]['data']
                }
              }
            }
          }
        }
      }
    }
    ret['name'] = data.cks.name;
    ret['desc'] = data.cks.desc;
    resolve(ret)
  })
}

// 对多行数据进行计算并整理返回值
function calcmanyrows(data) {
  return new Promise(function (resolve,reject) {
    var _forrowcalc = [];
    var firstRowRet = deepCopy(data.firstforrowcalc);
    for(var j = 0 ; j < data.forrowcalc.length;j++ ){
      _forrowcalc.push( deepCopy(data.forrowcalc[j]))
    }
    if(_forrowcalc.length > 1){
      delete firstRowRet.preOperate;
      var resuObj = firstRowRet;
      for(var i = 1;i < _forrowcalc.length;i++){
        var _tempObj = _forrowcalc[i];
        var preOperate = _tempObj.preOperate;
        delete _tempObj.preOperate;
        var _tempArg = _tempObj;
        Objoperator(firstRowRet,resuObj,_tempArg,preOperate);
        //resuObj = resuObjtemp
        data.forrowcalc = resuObj;
        resolve(data)
      }
    }else{
      resolve(data)
    }

  })
}

// resuobj,这是每次计算之后保存下来的值，newrow是每次传入的新值，operate是传入的运算符号，firstObj，第一行的结果
function Objoperator(firstRowRet,resuObj,newRow,operate){
  var resuKeyArray = [];
  var newKeyArray = [];
  for(var resuKey in resuObj){
    resuKeyArray.push(resuKey);
  }
  for(var newKey in newRow) {
    newKeyArray.push(newKey);
  }

  if(resuKeyArray.length != newKeyArray.length){
    return firstRowRet;
  }else{
    for(var i = 0;i < resuKeyArray.length;i++){
      var key = resuKeyArray[i];
      if(Util.isObject(resuObj[key]) && Util.isObject(newRow[key])){
        var _resuKeyArr = []
        var _newKeyArr = []
        for(var _resuKey in resuObj[key]){
          _resuKeyArr.push(_resuKey)
        }
        for(var _newKey in newRow[key]){
          _newKeyArr.push(_newKey)
        }

        for(var m = 0;m < _resuKeyArr.length;m++){
          resuObj[key] = Objoperator(resuObj[key],resuObj[key],newRow[key],operate)
        }

      }else if(!Util.isObject(resuObj[key]) && !Util.isObject(newRow[key])){
        // 或者都为可计算的值，或者都为数组
        if(Util.isArray(resuObj[key]) && Util.isArray(newRow[key]) || !isNaN(Number(resuObj[key])) && !isNaN(Number(newRow[key]))){
          if(operate == "+"){
            resuObj[key]  = Util.add(resuObj[key],newRow[key])
          }else if(operate == "-"){
            resuObj[key] = Util.sub(resuObj[key],newRow[key])
          }else if(operate == "*"){
            resuObj[key] = Util.app(resuObj[key],newRow[key])
          }else if(operate == '/'){
            resuObj[key] = Util.divs(resuObj[key],newRow[key])
          }
          return resuObj;
        }else {
          return firstRowRet;
        }
      }else{
        return firstRowRet;
      }
    }
  }
}

function calceachrownode(arr,lev,key1,key2,key3) {
  // 这里ret的值可能是数组，也可能是单值
  var ret;
  if(lev == 1){
    for(var i = 0 ; i < arr.length;i++){
      if(arr[i].rowOperation == ""){
        if(arr[i]['data']){
          ret = arr[i]['data'];
        }else if(arr[i]["valL"]){
          ret = arr[i]['valL'];
        }else if(arr[i]['valR']){
          ret = arr[i]['valR'];
        }
      }else if(arr[i].rowOperation == "+"){
        if(arr[i]['data']){
          ret =Util.add(ret, arr[i]['data']);
        }else if(arr[i]["valL"]){
          ret = Util.add(ret,arr[i]['valL']);
        }else if(arr[i]['valR']){
          ret = Util.add(arr[i]['valR']);
        }
      }else if(arr[i].rowOperation == "-"){
        if(arr[i]['data']){
          ret =Util.sub(ret, arr[i]['data']);
        }else if(arr[i]["valL"]){
          ret = Util.sub(ret,arr[i]['valL']);
        }else if(arr[i]['valR']){
          ret = Util.sub(ret,arr[i]['valR']);
        }
      }else if(arr[i].rowOperation == "*"){
        if(arr[i]['data']){
          ret =Util.app(ret, arr[i]['data']);
        }else if(arr[i]["valL"]){
          ret = Util.app(ret,arr[i]['valL']);
        }else if(arr[i]['valR']){
          ret = Util.app(ret,arr[i]['valR']);
        }
      }else if(arr[i].rowOperation == "/") {
        if (arr[i]['data']) {
          ret = Util.divs(ret, arr[i]['data']);
        } else if (arr[i]["valL"]) {
          ret = Util.divs(ret, arr[i]['valL']);
        } else if (arr[i]['valR']) {
          ret = Util.divs(ret, arr[i]['valR']);
        }
      }
    }
  } else if(lev == 2){
    for(var i = 0 ; i < arr.length;i++){
      if(arr[i].rowOperation == ""){
        if(arr[i][key1]["data"]){
          ret = arr[i][key1]["data"];
        }else if (arr[i][key1]["valL"]){
          ret = arr[i][key1]["valL"];
        }else if (arr[i][key1]["valR"]){
          ret = arr[i][key1]["valR"];
        }
      }else if(arr[i].rowOperation == "+"){
        if(arr[i][key1]["data"]){
          ret = Util.add(ret,arr[i][key1]["data"]);
        }else if (arr[i][key1]["valL"]){
          ret = Util.add(ret,arr[i][key1]["valL"]);
        }else if (arr[i][key1]["valR"]){
          ret = Util.add(ret,arr[i][key1]["valR"]);
        }
      }else if(arr[i].rowOperation == "-"){
        if(arr[i][key1]["data"]){
          ret = Util.add(ret,arr[i][key1]["data"]);
        }else if (arr[i][key1]["valL"]){
          ret = Util.add(ret,arr[i][key1]["valL"]);
        }else if (arr[i][key1]["valR"]){
          ret = Util.add(ret,arr[i][key1]["valR"]);
        }
      }else if(arr[i].rowOperation == "*"){
        if(arr[i][key1]["data"]){
          ret = Util.app(ret,arr[i][key1]["data"]);
        }else if (arr[i][key1]["valL"]){
          ret = Util.app(ret,arr[i][key1]["valL"]);
        }else if (arr[i][key1]["valR"]){
          ret = Util.app(ret,arr[i][key1]["valR"]);
        }
      }else if(arr[i].rowOperation == "/"){
        if(arr[i][key1]["data"]){
          ret = Util.divs(ret,arr[i][key1]["data"]);
        }else if (arr[i][key1]["valL"]){
          ret = Util.divs(ret,arr[i][key1]["valL"]);
        }else if (arr[i][key1]["valR"]){
          ret = Util.divs(ret,arr[i][key1]["valR"]);
        }
      }
    }
  }else if(lev == 3){
    for(var i = 0; i < arr.length;i++){
      if(arr[i].rowOperation == ""){
        if(arr[i][key1][key2]["data"]){
          ret = arr[i][key1][key2]["data"];
        }else if (arr[i][key1][key2]["valL"]){
          ret = arr[i][key1][key2]["valL"];
        }else if (arr[i][key1][key2]["valR"]){
          ret = arr[i][key1][key2]["valR"];
        }
      }else if(arr[i].rowOperation == "+"){
        if(arr[i][key1][key2]["data"]){
          ret = Util.add(ret,arr[i][key1][key2]["data"]);
        }else if (arr[i][key1][key2]["valL"]){
          ret = Util.add(ret,arr[i][key1][key2]["valL"]);
        }else if (arr[i][key1][key2]["valR"]){
          ret = Util.add(ret,arr[i][key1][key2]["valR"]);
        }
      }else if(arr[i].rowOperation == "-"){
        if(arr[i][key1][key2]["data"]){
          ret = Util.add(ret,arr[i][key1][key2]["data"]);
        }else if (arr[i][key1][key2]["valL"]){
          ret = Util.add(ret,arr[i][key1][key2]["valL"]);
        }else if (arr[i][key1]["valR"]){
          ret = Util.add(ret,arr[i][key1][key2]["valR"]);
        }
      }else if(arr[i].rowOperation == "*"){
        if(arr[i][key1][key2]["data"]){
          ret = Util.app(ret,arr[i][key1][key2]["data"]);
        }else if (arr[i][key1][key2]["valL"]){
          ret = Util.app(ret,arr[i][key1][key2]["valL"]);
        }else if (arr[i][key1][key2]["valR"]){
          ret = Util.app(ret,arr[i][key1][key2]["valR"]);
        }
      }else if(arr[i].rowOperation == "/"){
        if(arr[i][key1][key2]["data"]){
          ret = Util.divs(ret,arr[i][key1][key2]["data"]);
        }else if (arr[i][key1][key2]["valL"]){
          ret = Util.divs(ret,arr[i][key1]["valL"]);
        }else if (arr[i][key1][key2]["valR"]){
          ret = Util.divs(ret,arr[i][key1][key2]["valR"]);
        }
      }
    }
  }else if(lev == 4){
    for(var i = 0 ; i < arr.length;i++){
      if(arr[i].rowOperation == ""){
        if(arr[i][key1][key2][key3]["data"]){
          ret = arr[i][key1][key2][key3]["data"];
        }else if (arr[i][key1][key2][key3]["valL"]){
          ret = arr[i][key1][key2][key3]["valL"];
        }else if (arr[i][key1][key2][key3]["valR"]){
          ret = arr[i][key1][key2][key3]["valR"];
        }
      }else if(arr[i].rowOperation == "+"){
        if(arr[i][key1][key2][key3]["data"]){
          ret = Util.add(ret,arr[i][key1][key2][key3]["data"]);
        }else if (arr[i][key1][key2][key3]["valL"]){
          ret = Util.add(ret,arr[i][key1][key2][key3]["valL"]);
        }else if (arr[i][key1][key2][key3]["valR"]){
          ret = Util.add(ret,arr[i][key1][key2][key3]["valR"]);
        }
      }else if(arr[i].rowOperation == "-"){
        if(arr[i][key1][key2][key3]["data"]){
          ret = Util.add(ret,arr[i][key1][key2][key3]["data"]);
        }else if (arr[i][key1][key2][key3]["valL"]){
          ret = Util.add(ret,arr[i][key1][key2][key3]["valL"]);
        }else if (arr[i][key1][key3]["valR"]){
          ret = Util.add(ret,arr[i][key1][key2][key3]["valR"]);
        }
      }else if(arr[i].rowOperation == "*"){
        if(arr[i][key1][key2][key3]["data"]){
          ret = Util.app(ret,arr[i][key1][key2][key3]["data"]);
        }else if (arr[i][key1][key2]["valL"]){
          ret = Util.app(ret,arr[i][key1][key2][key3]["valL"]);
        }else if (arr[i][key1][key2]["valR"]){
          ret = Util.app(ret,arr[i][key1][key2][key3]["valR"]);
        }
      }else if(arr[i].rowOperation == "/"){
        if(arr[i][key1][key2]["data"]){
          ret = Util.divs(ret,arr[i][key1][key2][key3]["data"]);
        }else if (arr[i][key1][key2][key3]["valL"]){
          ret = Util.divs(ret,arr[i][key1]["valL"]);
        }else if (arr[i][key1][key2][key3]["valR"]){
          ret = Util.divs(ret,arr[i][key1][key2][key3]["valR"]);
        }
      }
    }
  }
  return ret;
}
// 对左右节点选出的数据进行整理
function calculateNode(obj,usrinfo) {
  // 这是要返回的值
  var ret = {};
  // 这是左右之间的计算条件,可为空
  var _operation = '';
  if(obj.operation){
    _operation = obj.operation;
  }
  // 左边的前置条件
  var _leftOperation = "";
  if(obj.leftOperation){
    _leftOperation = obj.leftOperation;
  }
  // 右边的前置条件
  var _rightOperation = "";
  if(obj.rightOperation){
    _rightOperation = obj.rightOperation;
  }
  // 左节点选出的值
  var _left = [];
  if(obj.left){
    _left = obj.left;
  }
  // 右节点选出的值
  var _right = [];
  if(obj.right){
    _right = obj.right;
  }
  // 是否可用于计算
  // 两边的值是不是都可计算的
  var _isCalcAble = true;
  // 左边的值是不是可计算的
  var _isCalcAbleL = true;
  // 右边的值是不是可计算的
  var _isCalcAbleR = true;
  // 左边返回的值是个数组
  var _tempLeftValArr = [];
  // 右边返回的值是个数组
  var _tempRightValArr = [];
  // 左边的值是个单值
  var _tempLeftSingleVal = 0;
  // 右边的值是个单值
  var _tempRightSingleVal = 0;

  // 判断值是不是可计算
  if(_left && _left.length > 0){
    for(var ii = 0 ; ii < _left.length;ii++){
      if(isNaN(Number(_left[ii]["val"])) || (typeof _left[ii]["val"] == "number" && String(parseInt(_left[ii]["val"])).length == 13)){
        _isCalcAble = false;
        _isCalcAbleL = false;
        break;
      }
    }
  }

  if(_right && _right.length > 0){
    for(var nn = 0 ; nn < _right.length;nn++){
      if(isNaN(Number(_right[nn]["val"])) || (typeof _right[nn]["val"] == "number" && String(parseInt(_right[nn]["val"])).length == 13)){
        _isCalcAbleR = false;
        break;
      }
    }
  }

  if(_isCalcAble == true){
    if(_right && _right.length > 0){
      for(var nn = 0 ; nn < _right.length;nn++){
        if(isNaN(Number(_right[nn]["val"])) || (typeof _right[nn]["val"] == "number" && String(parseInt(_right[nn]["val"])).length == 13)){
          _isCalcAble = false;
          break;
        }
      }
    }
  }
  // 如果左侧有数据
  if(_left && _left.length > 0){
    // 将左侧选出的值中的id和时间戳转为时间
    for(var jj = 0 ;jj < _left.length;jj++){
      var regid = /^[a-zA-Z0-9]{24}/;
      // 如果是id,替换为人
      if(regid.test(_left[jj]["val"])) {
        var _temp = _left[jj]["val"];
        var usrname = getusername(_temp, usrinfo);
        _left[jj]["val"] = usrname;
      }
      if( typeof _left[jj]["val"] == "number" && String(parseInt(_left[jj]["val"])).length == 13){
        var tempTime = formatTime(_left[jj]["val"],"yyyy-MM-dd hh:mm");
        _left[jj]["val"] = tempTime
      }
    }

    var _tempLeftArr = [];
    var  _leftKey = _left[0]["key"];
    // 不可计算的
    if(_isCalcAbleL == false){
      // 左边的
      // 不可计算的，没有前置条件则列出所有的
      if(_leftOperation == ""){
        for(var i = 0;i < _left.length;i++){
          if(!ret[_left[i]["key"]]){
            ret[_left[i]["key"]] = [];
          };
          ret[_left[i]["key"]].push(_left[i]["val"]);
        }
      }else{ // 不可计算的，有前置条件的返回计算结果统计个数
        var _tempArrL = [];
        for(var i = 0 ; i < _left.length;i++){
          _tempArrL.push(_left[i]["val"]);
        }
        var resuL = arrRepeatEle(_tempArrL);
        ret = resuL;
      }
    }else{
      // 左边的可计算
      for(var i = 0 ; i < _left.length;i++){
        _tempLeftArr.push(_left[i]["val"]);
      }
      if(_leftOperation == "sum"){
        var sumVal = Util.arraysum(_tempLeftArr);
        ret['keyL'] = _leftKey;
        ret['valL'] = sumVal;
        _tempLeftSingleVal = sumVal;
      }else if(_leftOperation == "avg"){
        var avgVal = Util.arrayaveg(_tempLeftArr);
        ret['keyL'] = _leftKey;
        ret['valL'] = avgVal;
        _tempLeftSingleVal = avgVal;
      }else if(_leftOperation == ''){
        ret['keyL'] = _leftKey;
        ret['valL'] = _tempLeftArr;
        _tempLeftValArr = _tempLeftArr;
      }
    }
  }

  // 如果右侧有数据
  if(_right && _right.length > 0){
    // 将右侧选出的值中的id和时间戳做替换
    for(var mm = 0 ; mm < _right.length;mm++){
      var regid = /^[a-zA-Z0-9]{24}/;
      if(regid.test(_right[mm]["val"])){
        var _temp = _right[mm]["val"];
        var usrname = getusername(_temp, usrinfo);
        _right[mm]["val"] = usrname;
      }
      if(typeof _right[mm]["val"] == "number" && String(parseInt(_right[mm]["val"])).length == 13){
        var tempTime = formatTime(_right[mm]["val"],"yyyy-MM-dd hh:mm");
        _right[mm]["val"] = tempTime;
      }
    }
    var _tempRightArr = [];
    var _rightKey = _right[0]["key"];
    // 这里是不可计算的
    if(_isCalcAbleR == false){
      // 右边的前置条件为空，不计算
      if(_rightOperation == ""){
        for(var j = 0;j < _right.length;j++){
          if(!ret[_right[j]["key"]]){
            ret[_right[j]["key"]] = [];
          }
          ret[_right[j]["key"]].push(_right[j]["val"]);
        }
      }else{
        // 右侧的前置条件不为空，则列出每一项及个数
        var _tempArrR = [];
        for(var j = 0 ; j < _right.length;j++){
          _tempArrR.push(_right[j]["val"]);
        }
        var resuR = arrRepeatEle(_tempArrR);
        ret = Object.assign(ret,resuR);
      }
    }else{
      // 可计算的，则进行计算
      for(var j = 0 ; j < _right.length;j++){
        _tempRightArr.push(_right[j]["val"]);
      }
      if(_rightOperation == "sum"){
        var sumVal = Util.arraysum(_tempRightArr);
        ret['keyR'] = _rightKey;
        ret['valR'] = sumVal;
        _tempRightSingleVal = sumVal;
      }else if(_rightOperation == "avg"){
        var avgVal = Util.arrayaveg(_tempRightArr);
        ret['keyR'] = _rightKey;
        ret['valR'] = _rightKey;
        _tempRightSingleVal = avgVal;
      }else if(_rightOperation == ""){
        ret['keyR'] = _rightKey;
        ret['valR'] = _tempRightArr;
        _tempRightValArr = _tempRightArr;
      }
    }
  }

  // 如果有中间条件，做出计算
  if(_operation){
    if(_isCalcAble == true){
      // 判断数组对数据计算

      if(_tempLeftValArr && _tempLeftValArr.length > 0 && _tempRightValArr && _tempRightValArr.length > 0){
        var _rempRowRsuArr = [];
        for(var h = 0 ; h < _tempLeftValArr.length;h++){
          var _tempRsu = 0;
          if(_operation == "+"){
            _tempRsu = _tempLeftValArr[h] + _tempRightValArr[h];
          }else if(_operation == "-"){
            _tempRsu = _tempLeftValArr[h] - _tempRightValArr[h];
          }else if(_operation == "*"){
            _tempRsu = _tempLeftValArr[h] * _tempRightValArr[h];
          }else if(_operation == "/"){
            _tempRsu = _tempLeftValArr[h] / _tempRightValArr[h];
          }
          _rempRowRsuArr.push(_tempRsu)
        }
        ret = {};
        ret['data'] = _rempRowRsuArr;
      }else if(_tempLeftValArr && _tempLeftValArr.length > 0){
        ret = {};
        ret['data'] = _tempLeftValArr;
      }else if(_tempRightValArr && _tempRightValArr.length > 0){
        ret = {};
        ret['data'] = _tempRightValArr;
      }

      if(_tempLeftSingleVal && _tempRightSingleVal){
        // 判断单值对单值计算
        var _tempRsuSingle = 0;
        if(_operation == "+"){
          _tempRsuSingle = _tempLeftSingleVal + _tempRightSingleVal;
        }else if(_operation == "-"){
          _tempRsuSingle = _tempLeftSingleVal - _tempRightSingleVal;
        }else if(_operation == "*"){
          _tempRsuSingle = _tempLeftSingleVal * _tempRightSingleVal;
        }else if(_operation == "/"){
          _tempRsuSingle = _tempLeftSingleVal / _tempRightSingleVal;
        }
        ret = {};
        ret['data'] = _tempRsuSingle;
      }
    }
  }
  return ret;
}

function groupforcalculate(data){
  return new Promise(function (resolve,reject) {
    var _ckOperations = data.cks.operations;
    var ret = [];
    for(var i = 0;i < _ckOperations.length;i++){
      var _rangeVal = _ckOperations[i].condition.range.value;
      var _interval = _ckOperations[i].condition.duration.interval;
      var _when = _ckOperations[i].condition.duration.skid;
      var _personVal = _ckOperations[i].condition.persons.who;

      var _isNeedGroupByRange = false;
      if(_rangeVal == "all"){
        _isNeedGroupByRange = true
      }
      var _isNeedGroupByWho = false;
      if(_personVal == "all"){
        _isNeedGroupByWho = true;
      }
      var _isNeedGroupByWhen = false;
      if(_when && _interval){
        _isNeedGroupByWhen = true;
      }
      // 这里是不需要进行groupby的,可直接进行计算的，这里是组织数据
      if(_rangeVal != "all" && _interval == "" && _personVal != "all" ){
        // console.log('---------------------------不要groupby的');
        var _tempObj = {};
        var _tempObjKeyNameL = getskname(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjValL = getvalbyskkeynotneedgroupby(_tempObjKeyKeyL,data.results[i],data.usersinfo);
        _tempObj['keyL'] = _tempObjKeyNameL;
        _tempObj['valL'] = _tempObjValL;
        _tempObj['operateL'] = _ckOperations[i].func.leftnodeskoperation;

        var _tempObjKeyNameR = getskname(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObjValR = getvalbyskkeynotneedgroupby(_tempObjKeyKeyR,data.results[i],data.usersinfo);

        _tempObj['keyR'] = _tempObjKeyNameR;
        _tempObj['valR'] = _tempObjValR;
        _tempObj['operateR'] = _ckOperations[i].func.rightnodeskoperation;
        _tempObj['operate'] = _ckOperations[i].func.operation;
        _tempObj['preOperate'] = _ckOperations[i].operation;
      }else if(_isNeedGroupByRange && !_isNeedGroupByWhen && !_isNeedGroupByWho){
        // console.log('----------------------------groupby range的');
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObj = getvalbyskkeyneedgroupby1level({
          ctnSkid:_ckOperations[i].condition.range.skid,
          keyL:_tempObjKeyKeyL,
          keyR:_tempObjKeyKeyR,
          keyLSkid:_ckOperations[i].func.leftnodeskid,
          keyRSkid:_ckOperations[i].func.rightnodeskid,
          resultArr:data.results[i],
          func:_ckOperations[i].func,
          data:data,
          preOperate:_ckOperations[i].operation
        });
      }else if(!_isNeedGroupByRange && _isNeedGroupByWhen && !_isNeedGroupByWho){
        // console.log('----------------------------groupby when的');
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObj = getvalbyskkeyneedgroupby1level({
          ctnSkid:_ckOperations[i].condition.duration.skid,
          keyL:_tempObjKeyKeyL,
          keyR:_tempObjKeyKeyR,
          keyLSkid:_ckOperations[i].func.leftnodeskid,
          keyRSkid:_ckOperations[i].func.rightnodeskid,
          resultArr:data.results[i],
          func:_ckOperations[i].func,
          data:data,
          interval:_ckOperations[i].condition.duration.interval,
          preOperate:_ckOperations[i].operation
        });
      }else if(!_isNeedGroupByRange && !_isNeedGroupByWhen && _isNeedGroupByWho){
        // console.log('----------------------------groupby who的');
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObj = getvalbyskkeyneedgroupby1level({
          ctnSkid:_ckOperations[i].condition.persons.skid,
          keyL:_tempObjKeyKeyL,
          keyR:_tempObjKeyKeyR,
          keyLSkid:_ckOperations[i].func.leftnodeskid,
          keyRSkid:_ckOperations[i].func.rightnodeskid,
          resultArr:data.results[i],
          func:_ckOperations[i].func,
          data:data,
          preOperate:_ckOperations[i].operation
        });
      }else if(_isNeedGroupByRange && _isNeedGroupByWhen && !_isNeedGroupByWho){
        // console.log('----------------------------groupby range && when && !who的');
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObj = getvalbyskkeyneedgroupby2level({
          preCtnSkid : _ckOperations[i].condition.duration.skid,
          ctnSkid : _ckOperations[i].condition.range.skid,
          keyL:_tempObjKeyKeyL,
          keyR:_tempObjKeyKeyR,
          keyLSkid:_ckOperations[i].func.leftnodeskid,
          keyRSkid:_ckOperations[i].func.rightnodeskid,
          resultArr:data.results[i],
          data:data,
          func:_ckOperations[i].func,
          interval:_ckOperations[i].condition.duration.interval,
          preOperate:_ckOperations[i].operation
        });
      }else if(!_isNeedGroupByRange && _isNeedGroupByWhen && _isNeedGroupByWho){
        // console.log('----------------------------groupby !range && when && who的');
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObj = getvalbyskkeyneedgroupby2level({
          preCtnSkid : _ckOperations[i].condition.duration.skid,
          ctnSkid : _ckOperations[i].condition.persons.skid,
          keyL:_tempObjKeyKeyL,
          keyR:_tempObjKeyKeyR,
          keyLSkid:_ckOperations[i].func.leftnodeskid,
          keyRSkid:_ckOperations[i].func.rightnodeskid,
          resultArr:data.results[i],
          data:data,
          func:_ckOperations[i].func,
          interval:_ckOperations[i].condition.duration.interval,
          preOperate:_ckOperations[i].operation
        });
      }else if(_isNeedGroupByRange && !_isNeedGroupByWhen && _isNeedGroupByWho){
        // console.log('----------------------------groupby range && !when && who的');
        var _tempObjKeyKeyL = getskkey(_ckOperations[i].func.leftnodeskid,data.sks);
        var _tempObjKeyKeyR = getskkey(_ckOperations[i].func.rightnodeskid,data.sks);
        var _tempObj = getvalbyskkeyneedgroupby2level({
          preCtnSkid : _ckOperations[i].condition.persons.skid,
          ctnSkid : _ckOperations[i].condition.range.skid,
          keyL:_tempObjKeyKeyL,
          keyR:_tempObjKeyKeyR,
          keyLSkid:_ckOperations[i].func.leftnodeskid,
          keyRSkid:_ckOperations[i].func.rightnodeskid,
          resultArr:data.results[i],
          data:data,
          func:_ckOperations[i].func,
          interval:_ckOperations[i].condition.duration.interval,
          preOperate:_ckOperations[i].operation
        });
      }
      ret.push(_tempObj)
    }
    data.groupforcalc = ret;
    resolve(data)
  })
}

function getvalbyskkeyneedgroupby2level(obj) {
  var preCtnSkid = obj.preCtnSkid;
  var ctnSkid = obj.ctnSkid;
  var data = obj.data;
  var keyL = obj.keyL;
  var keyR = obj.keyR;
  var keyLskid = obj.keyLSkid;
  var keyRskid = obj.keyRSkid;
  var interval = obj.interval || "";
  var arr = obj.resultArr;
  var func = obj.func;

  var keyLName = getskname(keyLskid,data.sks);
  var keyRName = getskname(keyRskid,data.sks);
  var reg = /[\w]{24}/;// 匹配mongodb的id的正则
  var retObj = {};
  for(var i = 0 ; i < arr.length;i++){
    var _prectnKeyKey = getskkey(preCtnSkid,data.sks);
    var _prectnKeyVal = arr[i][_prectnKeyKey];
    var _ctnKeyKey = getskkey(ctnSkid,data.sks);
    var _ctnKeyVal = arr[i][_ctnKeyKey];
    if(reg.test(_prectnKeyVal)){
      _prectnKeyVal = getusername(_prectnKeyVal,data.usersinfo);
    }else if(typeof _prectnKeyVal == "number" && String(parseInt(_prectnKeyVal)).length == 13){
      if(interval == "month"){
        _prectnKeyVal = formatTime(_prectnKeyVal,"yyyyMM")
      }else if(interval == "year"){
        _prectnKeyVal = formatTime(_prectnKeyVal,"yyyy")
      }
    }
    if(reg.test(_ctnKeyVal)){
      _ctnKeyVal = getusername(_ctnKeyVal,data.usersinfo);
    }else if(typeof ctnKeyVal == "number" && String(parseInt(ctnKeyVal)).length == 13){
      if(interval == "month"){
        _ctnKeyVal = formatTime(_ctnKeyVal,"yyyyMM");
      }else if(interval == "year"){
        _ctnKeyVal = formatTime(_ctnKeyVal,"yyyy");
      }
    }
    for(var curkey in arr[i]){
      var _valL = "";
      var _valR = "";
      if(curkey == keyL){
        _valL = arr[i][keyL];
        if(reg.test(_valL)){
          _valL = getusername(_valL,data.usersinfo)
        }else if(typeof _valL == "number" && String(parseInt(_valL)).length == 13){
          _valL = formatTime(_valL,"yyyy-MM")
        }
      }
      if(curkey == keyR){
        _valR = arr[i][keyR];
        if(reg.test(_valR)){
          _valR = getusername(_valR,data.usersinfo)
        }else if(typeof _valR == "number" && String(parseInt(_valR)).length == 13){
          _valR = formatTime(_valR,"yyyy-MM")
        }
      }
      if(curkey == keyL || curkey == keyR){
        if(retObj[_prectnKeyVal]){
          if(retObj[_prectnKeyVal][_ctnKeyVal]){
            if(_valL){
              retObj[_prectnKeyVal][_ctnKeyVal]["valL"].push(_valL);
            }
            if(_valR){
              retObj[_prectnKeyVal][_ctnKeyVal]["valR"].push(_valR);
            }
          }else {
            retObj[_prectnKeyVal][_ctnKeyVal] = {};
            retObj[_prectnKeyVal][_ctnKeyVal]["keyL"] = keyLName;
            retObj[_prectnKeyVal][_ctnKeyVal]["keyR"] = keyRName;
            retObj[_prectnKeyVal][_ctnKeyVal]["operateL"] = func.leftnodeskoperation;
            retObj[_prectnKeyVal][_ctnKeyVal]["operateR"] = func.rightnodeskoperation;
            retObj[_prectnKeyVal][_ctnKeyVal]["operate"] = func.operation;
            retObj[_prectnKeyVal][_ctnKeyVal]["valL"] = [];
            retObj[_prectnKeyVal][_ctnKeyVal]["valR"] = [];
            if(_valL){
              retObj[_prectnKeyVal][_ctnKeyVal]["valL"]=[_valL];
            }
            if(_valR){
              retObj[_prectnKeyVal][_ctnKeyVal]["valR"]=[_valR];
            }
          }
        }else {
          retObj[_prectnKeyVal] = {};
          retObj[_prectnKeyVal][_ctnKeyVal] = {};
          retObj[_prectnKeyVal][_ctnKeyVal]["keyL"] = keyLName;
          retObj[_prectnKeyVal][_ctnKeyVal]["keyR"] = keyRName;
          retObj[_prectnKeyVal][_ctnKeyVal]["operateL"] = func.leftnodeskoperation;
          retObj[_prectnKeyVal][_ctnKeyVal]["operateR"] = func.rightnodeskoperation;
          retObj[_prectnKeyVal][_ctnKeyVal]["operate"] = func.operation;
          retObj[_prectnKeyVal][_ctnKeyVal]["valL"] = [];
          retObj[_prectnKeyVal][_ctnKeyVal]["valR"] = [];
          if(_valL){
            retObj[_prectnKeyVal][_ctnKeyVal]["valL"].push(_valL)
          }
          if(_valR){
            retObj[_prectnKeyVal][_ctnKeyVal]["valR"].push(_valR)
          }
        }
      }
    }
  }
  retObj['preOperate'] = obj.preOperate;
  return retObj
}

function getvalbyskkeyneedgroupby1level(obj) {
  var arr = obj.resultArr;
  var ctnskid = obj.ctnSkid;
  var data = obj.data;
  var keyL = obj.keyL;
  var keyR = obj.keyR;
  var keyLskid = obj.keyLSkid;
  var keyRskid = obj.keyRSkid;
  var interval = obj.interval || "";
  var func = obj.func;

  var keyLName = getskname(keyLskid,data.sks);
  var keyRName = getskname(keyRskid,data.sks);
  var reg = /[\w]{24}/;// 匹配mongodb的id的正则
  var retObj = {};
  for(var i = 0 ; i <arr.length;i++){
    var _ctnKeyKey = getskkey(ctnskid,data.sks);//条件的key的key
    var ctnKeyVal = arr[i][_ctnKeyKey];//条件的key的值
    if(reg.test(ctnKeyVal)){
      ctnKeyVal = getusername(ctnKeyVal,data.usersinfo);
    }else if(typeof ctnKeyVal == "number" && String(parseInt(ctnKeyVal)).length == 13){
      if(interval == "month"){
        ctnKeyVal = formatTime(ctnKeyVal,"yyyyMM");
      }else if(interval == "year"){
        ctnKeyVal = formatTime(ctnKeyVal,"yyyy")
      }
    }
    if(!retObj[ctnKeyVal]){
      retObj[ctnKeyVal] = {};
      retObj[ctnKeyVal]["keyL"] = keyLName;
      retObj[ctnKeyVal]["keyR"] = keyRName;
      retObj[ctnKeyVal]["operateL"] = func.leftnodeskoperation;
      retObj[ctnKeyVal]["operateR"] = func.rightnodeskoperation;
      retObj[ctnKeyVal]["operate"] = func.operation;
      retObj[ctnKeyVal]["valL"] = [];
      retObj[ctnKeyVal]["valR"] = [];
    }
    for(var curkey in arr[i]){
      var _val = arr[i][curkey];
      //这里是判断放入数组中的值的，是id，转为人名，是13位数字，转为时间
      if(reg.test(_val)){
        _val = getusername(_val,data.usersinfo)
      }else if(typeof _val == "number" && String(parseInt(_val)).length == 13){
        _val = formatTime(_val,"yyyy-MM-dd hh:mm");
      }

      if(curkey == keyL){
        retObj[ctnKeyVal]["valL"].push(_val);
      }
      if(curkey == keyR){
        retObj[ctnKeyVal]["valR"].push(_val);
      }
    }
  }
  retObj['preOperate'] = obj.preOperate;
  return retObj;
}

// 通过key找result中的值，返回是个数据,如果返回值是个id，则去找人员的name，
// 如果返回值是个时间戳，则转为时间，
// 这里取到的值，需要是之后不再经过转换就能返回出去的值
function getvalbyskkeynotneedgroupby(key,arr,usrs) {
  var ret = [];
  for(var i = 0;i <arr.length;i++){
    for(var curkey in arr[i]){
      if(curkey == key){
        var reg = /[\w]{24}/g;
        if(reg.test(arr[i][key])){
          var usrname = getusername(arr[i][key], usrs);
          ret.push(usrname)
        }else if(typeof arr[i][key] == "number" && String(parseInt(arr[i][key])).length == 13){
          var time = formatTime(arr[i][key],"yyyy-MM-dd hh:mm");
          ret.push(time)
        }else {
          ret.push(arr[i][key])
        }
      }
    }
  }
  return ret;
}

function quaryusersinfo(data) {
  return new Promise(function (resolve,reject) {
    Users.find({

    }).exec(function (err,users) {
      if(users){
        data.usersinfo = users;
        resolve(data)
      }else{
        reject('quaryusersinfo error')
      }
    })
  })
}

//整理返回的数据结构
function getkeylike(ck ,keylike) {
  var ret = [];
  return _getkeylike(ck ,keylike);
  function _getkeylike(ck ,keylike) {
    for(var key in ck){
      if(ck[key] && typeof ck[key] == 'object'){
        ret.concat(_getkeylike(ck[key], keylike));
      }else{
        if(key.indexOf(keylike) != -1){
          if(ck[key]){
            var temp = {};//此处只是给对象的id赋值用，需要放for里
            temp.id = ck[key];
            ret.push(temp);
          }
        }
      }
    }
    //这里是sql里or后的条件，必须是个数组
    return ret;
  }
}

function buildckqueryfunctions(obj) { //根据ck中的operations中的condition，做循环拼出sql，这里一个condition是一行，
  var ret = [];
  var cks = obj.cks;
  var sks = obj.sks;
  var itemiddata = obj.itemiddata;
  for(var key in cks){
    if(cks[key] && typeof cks[key] == "object"){ //这里找到的是operations
      for(var i = 0;i < cks[key].length;i++){
        //这里不适用闭包，会在创建查询函数时候，取不到查询的条件
        (function(){
          var conbypersonid={};// 这是通过人员id找数据的sql
          var conbyrealname={};// 这是通过人员realname找数据的sql
          var conbyloginname={};//这是通过人员loginname找数据的sql
          if(cks[key][i] && cks[key][i].condition){
            if(cks[key][i].condition.range.skid && cks[key][i].condition.range.value && cks[key][i].condition.range.operation){
              var rangeKeyname = getskkey(cks[key][i].condition.range.skid, sks);
              var rangeK, rangeV;
              rangeK = cks[key][i].condition.range.operation;
              rangeV = cks[key][i].condition.range.value;
              // 这里拼出是这样的
              //{xiangmu:xiangmuA}
              if(rangeV == 'all'){
                //  为all的时候，不写入任何条件
              }else if(rangeV == "para.itemid" && rangeKeyname){
                if (itemiddata[rangeKeyname]){
                  if(rangeK == '='){
                    conbypersonid[rangeKeyname] = itemiddata[rangeKeyname];
                    conbyrealname[rangeKeyname] = itemiddata[rangeKeyname];
                    conbyloginname[rangeKeyname] = itemiddata[rangeKeyname];
                  }
                }else {
                  // 如果通过itemid找到的值不存在，则不拼接这个sql
                }
              }else if(rangeKeyname && rangeV != "all" && rangeV != "para.itemid"){
                if(rangeK == "="){
                  conbypersonid[rangeKeyname] = rangeV;
                  conbyrealname[rangeKeyname] = rangeV;
                  conbyloginname[rangeKeyname] = rangeV;
                }
              }else{
                // 如果不满足条件，什么都不写
              }
            }

            if(cks[key][i].condition.duration.skid){
              var durationKeyname = getskkey(cks[key][i].condition.duration.skid, sks);

              var durationS, durationE;
              durationS = cks[key][i].condition.duration.start;
              durationE = cks[key][i].condition.duration.end;

              var stampDurationS,stampDurationE;

              // 这里将时间转换为时间戳
              // 在系统关键字中，已将系统关键字时间替换为数字格式的时间戳
              if(durationS){
                if(typeof durationS == 'number' && String(durationS).length == 13){
                  stampDurationS = durationS;
                }else{
                  stampDurationS = new Date(durationS).getTime();
                }
              }
              if(durationE){
                if(typeof durationE == 'number' && String(durationE).length == 13){
                  stampDurationE = durationE;
                }else{
                  stampDurationE = new Date(durationE).getTime();
                }
              }

              // 开始拼sql语句
              // 这里拼出是这样的
              // {shijian:{'>=':1485907200000,'<':1488326400000}}
              if(durationKeyname && stampDurationS && !stampDurationE){
                conbypersonid[durationKeyname] = {'>=':stampDurationS};
                conbyrealname[durationKeyname] = {'>=':stampDurationS};
                conbyloginname[durationKeyname] = {'>=':stampDurationS};
              }else if(durationKeyname && !stampDurationS && stampDurationE){
                conbypersonid[durationKeyname] = {'<=':stampDurationE};
                conbyrealname[durationKeyname] = {'<=':stampDurationE};
                conbyloginname[durationKeyname] = {'<=':stampDurationE};
              }else if(durationKeyname && durationS && durationE){
                conbypersonid[durationKeyname] = {'>=':stampDurationS,'<=':stampDurationE};
                conbyrealname[durationKeyname] = {'>=':stampDurationS,'<=':stampDurationE};
                conbyloginname[durationKeyname] = {'>=':stampDurationS,'<=':stampDurationE};
              }
            }
            if(cks[key][i].condition.persons.skid && cks[key][i].condition.persons.who && cks[key][i].condition.persons.operation){
              var personsKeyname = getskkey(cks[key][i].condition.persons.skid, sks);
              var personsK,personsV,realname,loginname;
              personsK = cks[key][i].condition.persons.operation;
              personsV = cks[key][i].condition.persons.who;
              realname = cks[key][i].condition.persons.realname;
              loginname = cks[key][i].condition.persons.loginname;
              // 这里拼出是这样的
              //{xiangmu:xiangmuA}
              if(personsKeyname && personsK && personsV || personsKeyname && personsK && personname ){
                if(personsV != "all"){
                  if(personsK == "="){
                    conbypersonid[personsKeyname] = personsV;
                    conbyrealname[personsKeyname] = realname;
                    conbyloginname[personsKeyname] = loginname;
                  }
                }else{
                  // 等于all的时候，不写任何条件
                }
              }
            }
          }
          if(cks[key][i].flowid){
            var _flowdb = eval("n" + cks[key][i].flowid);
            var _conbypersonid = conbypersonid;
            var _conbyrealname = conbyrealname;
            var _conbyloginname = conbyloginname;
            // 根据传入的时间，正序排列，便于后边计算的时候需要取数据的起止时间的时候，好取值
            var _conditionquuerybyconditionFn = function (callback) {
              _flowdb.find({
                where: _conbypersonid
              }).exec(function(err,val){
                if(val && val.length > 0){
                  callback(null,val)
                }else{
                  _flowdb.find({
                    where:_conbyrealname
                  }).exec(function (err,val) {
                    if(val && val.length > 0){
                      callback(null,val)
                    }else{
                      _flowdb.find({
                        where:_conbyrealname
                      }).exec(function (err,val) {
                        if(val && val.length > 0){
                          callback(null,val)
                        }else{
                          callback(null,[])
                        }
                      })
                    }
                  })
                }
              })
            }
            ret.push(_conditionquuerybyconditionFn);
          }
        }())
      }
    }
  }
  return ret;
}

function getskname(skid,sks) {
  if(skid == "" || skid == undefined){return ""};
  for(var i= 0;i < sks.length;i++){
    if(skid == sks[i].id){
      if(sks[i].name){
        return sks[i].name
      }
    }
  }
}

function getskkey(skid, sks){
  if(skid == "" || skid == undefined){return ""};
  for(var i = 0;i < sks.length;i++){
    if(skid == sks[i].id){
      return sks[i].key;
    }
  }
}

function getuserrealname(id,usrinfo) {
  if(id == "") {return ""};
  for(var i = 0 ; i < usrinfo.length;i++){
    if(id == usrinfo[i].id || id == usrinfo[i].loginname){
      return usrinfo[i].realname ? usrinfo[i].realname : "";
    }
  }
}

function getusrloginname(id,usrinfo) {
  if(id == ""){ return ""}
  for(var i = 0 ; i < usrinfo.length;i++){
    if(id == usrinfo[i].id || id == usrinfo[i].loginname){
      return usrinfo[i].loginname ? usrinfo[i].loginname : "";
    }
  }
}

// 返回用户的realname或者loginname
function getusername(id,usersinfo) {
  if(id==""){return ""}
  for(var i = 0; i < usersinfo.length;i++){
    if(id == usersinfo[i].id || id == usersinfo[i].loginname){
      if(usersinfo[i].realname){
        return usersinfo[i].realname;
      }else{
        return usersinfo[i].loginname;
      }
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

function arrRepeatEle(arr) {
  var i = 0, maxI,
    item = {};
  arr.sort(function(x,y){return x - y;});
  for(i = 0; maxI = arr.length, i < maxI; i +=1){
    var key = arr[i], obj = {};

    if(item[key]){
      item[key]++;
    }else{
      obj = arr[i] == arr[i+1]? 2: 1;
      item[key] = obj;
    }
    if(arr[i] == arr[i+1]){
      arr.splice(i+1,1);
    }
  }
  return item
}

function uniqueArr(ar) {
  var ret = [];
  for (var i = 0, j = ar.length; i < j; i++) {
    if (ret.indexOf(ar[i]) === -1) {
      ret.push(ar[i]);
    }
  }
  return ret;
}

function padzero(s){
  if(String(s).length == 1){
    return "0"+s;
  }
  return String(s);
}

function deepCopy(source) {
  var result = {};
  for(var key in source) {
    result[key] = Object.prototype.toString.call(source[key]) == '[object Object]' ? deepCopy(source[key]) : source[key];
  }
  return result;
}
