/**
 * Created by demo on 2017/7/19.
 */
"use strict";

module.exports = {
    querybysks:function (skidarr) {
        return new Promise(function (resolve,reject) {
            async.series(
                buildskqueryfunction(skidarr),
                function (err,result) {
                    if(result){
                        resolve(result)
                    }else{
                        reject("querybusks.js中querybusks出错")
                    }
                }
            )
        })
    }
};

function buildskqueryfunction(skarr) {
    var fnarr = [];
    for(var i = 0 ; i < skarr.length;i++){
        // 这里如若不使用闭包，创建的函数只回抓取到for的最后一次取到的值
        (function () {
            var _usrid = "";
            if(skarr[i].usrid){
              _usrid = skarr[i].usrid;
            }
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
                                    for(var k in info){
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
        }())
    }
    return fnarr;
}
