/*
 人员相关：
     system-myself: 表示用户自己，返回用户ID。
     system-myboss: 表示我的直接领导，，返回用户领导ID。

 日期相关：
     system-today：表示今天
     system-thisweek：表示本周
     system-thismonth：表示本月
     system-thisyear：表示本年

 日期计算
     system-today + n：未来几天。
     system-today  - n：过去几天。
*/
"use strict";

module.exports = {
  startprocess:function (data) {
      return new Promise(function (resolve, reject) {
          handlesystemkeymyself(data)
              .then(handlesystemkeymyboss)
              .then(handlesystemkeydate)
              .then(function (data) {
                resolve(data);
              })
      })
  }
}

function handlesystemkeymyself(data){
    return new Promise(function (resolve, reject) {
        //读取persons.who，如果为system-myself，转化为data.para.usrid.
        var _cks = data.cks;
        var _curUsrid = data._para.usrid;
        console.log("_curUsrid:" + _curUsrid);

        for(var i = 0 ; i < _cks.operations.length;i++){
            if(_cks.operations[i].condition.persons.who == "system-myself"){
                data.cks.operations[i].condition.persons.who = _curUsrid;
            }
        }
        resolve(data);
    });
}

// 获取我的上级
function handlesystemkeymyboss(data){
    return new Promise(function (resolve, reject) {
        getalluserdata(data)// 列出所有的登录信息
            .then(getallPersonData)// 列出所有的人员信息
            .then(getallDepartmentData)  // 列出所有的部门信息
            .then(function (data) {

                var _allusers = data.allusers;
                var _allpersons = data.allperson;
                var _alldepartment = data.alldepartment;
                var _cks = data.cks;
                var _curUsrid = data._para.usrid;
                //读取persons.who，如果为system-myboss，通过para.ursid,在数据库里查询。
                //查询思路是：找到本人所在的部门，再找到部门负责人的id。
                var _personID = getpersonidbyusrid(_curUsrid,_allusers);
                console.log('personID:'+_personID)
                var _departmentID = getdepartmentidbypersonid(_personID,_allpersons);
                console.log('_departmentID:'+_departmentID)
                var _mybossID = getbossidbydepartmentid(_departmentID,_alldepartment);
                console.log('myboss' + _mybossID);
                for(var i = 0 ; i < _cks.operations.length;i++){
                    if(_cks.operations[i].condition.persons.who == "system-myboss"){
                        data.cks.operations[i].condition.persons.who = _mybossID;
                    }
                }
                resolve(data);
            })
    });
}

// 获取所有的登录信息
function getalluserdata(data){
    return new Promise(function (resolve,reject) {
        Users.find({

        }).exec(function (err,users) {
            if(!users){
                reject("未读到users")
            }else{
                data.allusers = users;
                resolve(data)
            }
        })
    })
}

// 获取所有的人员信息
function getallPersonData(data) {
    return new Promise(function (resolve,reject) {
        Person.find({

        }).exec(function (err,person) {
            if(!person){
                reject("未读到person")
            }else{
                data.allperson = person;
                resolve(data)
            }
        })
    })
}

// 获取所有的部门信息
function getallDepartmentData(data) {
    return new Promise(function (resolve,reject) {
        Department.find({

        }).exec(function (err,department){
            if(!department){
                reject("未找到department")
            }else{
                data.alldepartment = department;
                resolve(data)
            }
        })
    })
}

// 获取当前usr的personid
 function getpersonidbyusrid(id,allusers) {
    var  personId = "";
    for(var i = 0 ; i < allusers.length;i++){
        if(allusers[i].id == id){
           if(!allusers[i].personId){
              console.log("personid为空")
           }
          personId =  allusers[i].personId;
        }
    }
    return personId;
 }

 //从person信息中读到部门id
 function getdepartmentidbypersonid(personid,persons) {
      if(personid == ''){
          console.log('未获取到personid');
          return '';
      }
      var departmentId = "";
      for(var i = 0 ; i < persons.length;i++){
          if(persons[i].id == personid){
              if(!persons[i].departmentId){
                  console.log("departmentId为空")
              }
            departmentId =  persons[i].departmentId;
          }
      }
      return departmentId;
 }

 // 从部门信息中读到部门创建者，即为我的上级的id
 function getbossidbydepartmentid(id,departments) {
    if(id == ''){
        console.log('部门id为空');
        return '';
    }
    var ownerId = '';
    for(var i = 0 ; i < departments.length;i++){
        if(departments[i].id == id){
            if(!departments[i].ownerId){
                console.log("部门创建者id为空")
            }
            ownerId =  departments[i].ownerId;
        }
    }
    return ownerId;
 }

// 日期的系统关键字
function handlesystemkeydate(data){
    return new Promise(function (resolve, reject) {
        data = handledayprocess(data);
        data = handleweekprocess(data);
        data = handlemonthprocess(data);
        data = handleyearprocess(data);
        resolve(data);
    });
}

/*
    jS如何获取日期的例子：
 http://blog.csdn.net/benbenchong_ok/article/details/53337365
 */

// system-thisyear计算
function handleyearprocess(data) {
  var _cks = data.cks;
  for(var i = 0 ;i < _cks.operations.length;i++){
    //判断自定义时间的开始时间,参数中以S结尾的都是开始时间用的，以E结尾都是结束时间用的
      if(_cks.operations[i].condition.duration.start.indexOf("system-thisyear") != -1){
          var _strS = "system-thisyear";
          var _strlenS = _strS.length;
          var _afterStrS = _cks.operations[i].condition.duration.start.slice(_strlenS);
          var _operatingS = _afterStrS.slice(0,1);//这里取出的是中间的=/-
          var _numberS = Number(_afterStrS.slice(1)); //这里取出的是=/-之后的数字

          var _curTimeS = new Date();
          var _curYearS = _curTimeS.getFullYear();

          if(_operatingS && _numberS){
              if(_operatingS == '+'){
                  _curYearS = _curYearS + _numberS
              }else if(_operatingS == '-'){
                  _curYearS = _curYearS - _numberS
              }
          };

          var _timeStampS = new Date();
          _timeStampS.setFullYear(_curYearS);
          _timeStampS.setMonth(0);
          _timeStampS.setDate(1);
          _timeStampS.setHours(0);
          _timeStampS.setMinutes(0);
          _timeStampS.setSeconds(0);
          _timeStampS = Date.parse(_timeStampS);

          data.cks.operations[i].condition.duration.start = Number(_timeStampS);

      }

      //判断自定义结束的开始时间,
      if(_cks.operations[i].condition.duration.end.indexOf("system-thisyear") != -1){
          var _strE = "system-thisyear";
          var _strlenE = _strE.length;
          var _afterStrE= _cks.operations[i].condition.duration.end.slice(_strlenE);
          var _operationE = _afterStrE.slice(0,1);
          var _numberE = Number(_afterStrE.slice(1));

          var _curTimeE = new Date();
          var _curYearE = _curTimeE.getFullYear();

          if(_operationE && _numberE){
              if(_operationE == "+"){
                  _curYearE = _curYearE + _numberE;
              }else if(_operationE == "-"){
                  _curYearE = _curTimeE - _numberE;
              }
          }

          var _timeStampE = new Date();
          _curYearE = _curYearE + 1;//这里+1是求年末的时间
          _timeStampE.setFullYear(_curYearE);
          _timeStampE.setMonth(0);
          _timeStampE.setDate(1);
          _timeStampE.setHours(0);
          _timeStampE.setMinutes(0);
          _timeStampE.setSeconds(0);
          _timeStampE = Date.parse(_timeStampE);

          data.cks.operations[i].condition.duration.end = Number(_timeStampE);
      }
  }
  return data;
}

//计算system-thismonth
function handlemonthprocess(data) {
  var _cks = data.cks;
  for(var i = 0 ;i < _cks.operations.length;i++) {
      //判断自定义时间的开始时间,参数中以S结尾的都是开始时间用的，以E结尾都是结束时间用的
      if(_cks.operations[i].condition.duration.start.indexOf("system-thismonth") != -1){
          var _strS = "system-thismonth";
          var _strlenS = _strS.length;
          var _afterStrS = _cks.operations[i].condition.duration.start.slice(_strlenS);
          var _operatingS = _afterStrS.slice(0,1);//这里取出的是中间的=/-
          var _numberS = Number(_afterStrS.slice(1)); //这里取出的是=/-之后的数字

          var _curTimeS = new Date();
          var _curMonthS = _curTimeS.getMonth();

          if(_operatingS && _numberS){
              if(_operatingS == '+'){
                  _curMonthS = _curMonthS + _numberS
              }else if(_operatingS == '-'){
                  _curMonthS = _curMonthS - _numberS
              }
          }

          var _timeStampS = new Date();
          _timeStampS.setMonth(_curMonthS);
          _timeStampS.setDate(1);
          _timeStampS.setHours(0);
          _timeStampS.setMinutes(0);
          _timeStampS.setSeconds(0);
          _timeStampS = Date.parse(_timeStampS);

          data.cks.operations[i].condition.duration.start = Number(_timeStampS);
      }

      //判断自定义结束的开始时间,
      if(_cks.operations[i].condition.duration.end.indexOf("system-thismonth") != -1){
          var _strE = "system-thismonth";
          var _strlenE = _strE.length;
          var _afterStrE= _cks.operations[i].condition.duration.end.slice(_strlenE);
          var _operationE = _afterStrE.slice(0,1);
          var _numberE = Number(_afterStrE.slice(1));

          var _curTimeE = new Date();
          var _curMonthE = _curTimeE.getMonth();

          if(_operationE && _numberE){
              if(_operationE == "+"){
                  _curMonthE = _curMonthE + _numberE;
              }else if(_operationE == "-"){
                  _curMonthE = _curMonthE - _numberE;
              }
          }

          var _timeStampE = new Date();

          _timeStampE.setMonth(_curMonthE + 1);
          _timeStampE.setDate(1);
          _timeStampE.setHours(0);
          _timeStampE.setMinutes(0);
          _timeStampE.setSeconds(0);
          _timeStampE = Date.parse(_timeStampE);

          data.cks.operations[i].condition.duration.end = Number(_timeStampE);
      }
  }
  return data;
}

// 计算system-thisweek
function handleweekprocess(data){

  var _cks = data.cks;
  for(var i = 0 ;i < _cks.operations.length;i++){
      //判断自定义时间的开始时间,参数中以S结尾的都是开始时间用的，以E结尾都是结束时间用的
      if(_cks.operations[i].condition.duration.start.indexOf("system-thisweek") != -1){
          var _strS = "system-thisweek";
          var _strlenS = _strS.length;
          var _afterStrS = _cks.operations[i].condition.duration.start.slice(_strlenS);
          var _operatingS = _afterStrS.slice(0,1);//这里取出的是中间的=/-
          var _numberS = Number(_afterStrS.slice(1)); //这里取出的是=/-之后的数字

          var _curTimeS = new Date();
          var _curDateS = _curTimeS.getDate();
          var _curDayS = _curTimeS.getDay();// 获取今天是周几
          var _curweekS = _curDateS - _curDayS;

          if(_operatingS && _numberS){
              if(_operatingS == '+'){
                  _curDateS = _curweekS + _numberS * 7;
              }else if(_operatingS == '-'){
                  _curDateS = _curweekS - _numberS * 7;
              }
          }

          var _timeStampS = new Date();

          _timeStampS.setDate(_curDateS);
          _timeStampS.setHours(0);
          _timeStampS.setMinutes(0);
          _timeStampS.setSeconds(0);
          _timeStampS = Date.parse(_timeStampS);

          data.cks.operations[i].condition.duration.start = Number(_timeStampS);
      }

      if(_cks.operations[i].condition.duration.end.indexOf("system-thisweek") != -1){
          var _strE = "system-thisweek";
          var _strlenE = _strE.length;
          var _afterStrE= _cks.operations[i].condition.duration.end.slice(_strlenE);
          var _operatingE = _afterStrE.slice(0,1);
          var _numberE = Number(_afterStrE.slice(1));

          var _curTimeE = new Date();
          var _curDateE = _curTimeE.getDate();
          var _curDayE = _curTimeS.getDay();// 获取今天是周几
          var _curweekE = _curDateE - _curDayE + 7; // 获取到这周最后一天的日期

          if(_operationE && _numberE){
              if(_operatingE == '+'){
                  _curDateE = _curweekE + _numberE * 7;
              }else if(_operatingE == '-'){
                  _curDateE = _curweekE - _numberE * 7;
              }
          }

          var _timeStampE = new Date();
          _curDateE = _curDateE + 1;//这里+1是求天末的时间
          _timeStampE.setDate(_curDateE);
          _timeStampE.setHours(0);
          _timeStampE.setMinutes(0);
          _timeStampE.setSeconds(0);
          _timeStampE = Date.parse(_timeStampE);

          data.cks.operations[i].condition.duration.end = Number(_timeStampE);
      }
  }

  return data;
}

// 计算system-today
function handledayprocess(data) {
  var _cks = data.cks;
  for(var i = 0 ;i < _cks.operations.length;i++){
    //判断自定义时间的开始时间,参数中以S结尾的都是开始时间用的，以E结尾都是结束时间用的
      if(_cks.operations[i].condition.duration.start.indexOf("system-today") != -1){
          var _strS = "system-today";
          var _strlenS = _strS.length;
          var _afterStrS = _cks.operations[i].condition.duration.start.slice(_strlenS);
          var _operatingS = _afterStrS.slice(0,1);//这里取出的是中间的=/-
          var _numberS = Number(_afterStrS.slice(1)); //这里取出的是=/-之后的数字

          var _curTimeS = new Date();
          var _curDateS = _curTimeS.getDate();

          if(_operatingS && _numberS){
              if(_operatingS == '+'){
                _curDateS = _curDateS + _numberS
              }else if(_operatingS == '-'){
                _curDateS = _curDateS - _numberS
              }
          };

          var _timeStampS = new Date();

          _timeStampS.setDate(_curDateS);
          _timeStampS.setHours(0);
          _timeStampS.setMinutes(0);
          _timeStampS.setSeconds(0);
          _timeStampS = Date.parse(_timeStampS);

          data.cks.operations[i].condition.duration.start = Number(_timeStampS);
      }

      if(_cks.operations[i].condition.duration.end.indexOf("system-today") != -1){
          var _strE = "system-today";
          var _strlenE = _strE.length;
          var _afterStrE= _cks.operations[i].condition.duration.end.slice(_strlenE);
          var _operationE = _afterStrE.slice(0,1);
          var _numberE = Number(_afterStrE.slice(1));

          var _curTimeE = new Date();
          var _curDateE = _curTimeE.getDate();

          if(_operationE && _numberE){
              if(_operationE == "+"){
                  _curDateE = _curDateE + _numberE;
              }else if(_operationE == "-"){
                  _curDateE = _curDateE - _numberE;
              }
          }

          var _timeStampE = new Date();
          _curDateE = _curDateE + 1;//这里+1是求天末的时间
          _timeStampE.setDate(_curDateE);
          _timeStampE.setHours(0);
          _timeStampE.setMinutes(0);
          _timeStampE.setSeconds(0);
          _timeStampE = Date.parse(_timeStampE);

          data.cks.operations[i].condition.duration.end = Number(_timeStampE);
      }
  }
  return data
}
