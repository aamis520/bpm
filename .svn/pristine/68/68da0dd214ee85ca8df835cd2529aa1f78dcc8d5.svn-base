"use strict";

var Util = require("./util.js");
var SystemKeyHandler = require("./SystemKeyHandler.js");
var NextNodeGenerateHandler = require("./NextNodeGenerateHandler.js");
var querybyck = require("./querybyck");

module.exports = {
  //生成随机的id
  //取flowid的后8位 + 时间戳12位 + 4位随机数
  generatedataid:function(req, res) {
    var flowid = req.param("flowid")
    var randstr = daterandom()
    flowid = flowid.substr(-8)
    var dataid = flowid + randstr
    res.send(200,{id:dataid})

  },
  //通过flowid查询出当前流程写的所有数据
  queryalldatabyflowid:function(req, res) {
    var flowid = req.param("flowid")
    var flowdb = eval("n" + flowid)
    var usrid = req.param("usrid")
    flowdb.find({
      usrid:usrid
    }).exec(function(err,flowdatas){
      if(err) {
        res.send(500, {
          error: "网络错误"
        })
      } else if(!flowdatas) {
        res.send(200, {
          error: '未知错误'
        })
      }else {
        res.send(200, {
          flowdatas: flowdatas
        })
      }
    })
  },
  //通过一组skids查询数据
  querybyskids: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var ids = req.param("ids")
    var flowdb = eval("n" + flowid);
    //线从简单关键字查询出 name key
    Simplekeyword.find({
      id: ids
    }).exec(function(err, sks) {
      if(err) {
        res.send(500, {
          error: "网络错误"
        })
      } else if(!sks) {
        res.send(200, {
          error: '未找到这个简单关键字'
        })
      } else {
        var keys = []
        for(var i = 0; i < sks.length; i++) {
          keys.push(sks[i].key)
        }
        flowdb.find({

        }).exec(function(err, datas) {
          if(err) {
            res.send(200, {
              error: "未知错误"
            })
          } else if(!datas) {
            res.send(200, {
              success: "未找到数据"
            })
          } else {
            res.send(200, {
              sks: sks,
              datas: datas
            })
          }
        })
      }
    })

  },
  deldata: function(req, res){
    var id = req.param("id");
    var flowid = req.param("flowid");
    var flowdb = eval("n" + flowid);
    flowdb.destroy(
      {
        id:id,
      }
    ).exec(function(err,org){
      if(err){
        res.send(500,{error:"网络错误"})
      }else if(!org){
        res.send(200,{success:"您要删除的数据不存在"})
      }else{
        res.send(200,{success:"success"});
      }
    })
  },
  submitdata: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var nodeid = req.param("nodeid");
    var id = req.param("id")
    var submitinfo = JSON.parse(req.param("submitinfo"));
    //数据是存到n+flowid对应的库中的。
    var flowdb = eval("n" + flowid);
    flowdb.create(
      buildsubmitdata(id,usrid, flowid, nodeid, submitinfo)
    ).exec(function(err, flowdata) {
      if(!flowdata) {
        res.send(200, {
          error: "未知错误"
        })
      } else {
        //参数：itemid，usrid，nodeid，flowid，submitinfo,isforecast
        //submitinfo是提交的数据，新创建提交的数据和审批提交的数据不一样，
        //审批提交的数据中包括：shenpistatus和shenpicomments
        Flow.findOne({
          id:flowid
        }).exec(function (err,flow) {
          if(!flow){
            res.send(200,{error:'未找到flows'})
          }else {
            // 这里做出判断，单节点提交数据，只有存库的动作，不再找下个节点及自动审批等动作
            if(flow.flows && flow.flows.length > 0){
              NextNodeGenerateHandler.startprocess(flowdata.id, usrid, nodeid, flowid, submitinfo, false)
                .then(function(data) {
                  //这里返回的是itemid
                  res.send(200, {
                    itemid: data.itemid
                  });
                })
            }else{
              // 这里是仅有一个节点提交数据的情况
              res.send(200,{itemid:flowdata.id})
            }
          }
        })

      }
    })
  },

  updatedata: function(req, res) {
    var usrid = req.param("usrid");
    var itemid = req.param("itemid");
    var flowid = req.param('flowid');
    var nodeid = req.param("nodeid");
    var submitinfo = JSON.parse(req.param("submitinfo"));
    //数据是存到n+flowid对应的库中的。
    var flowdb = eval("n" + flowid);

    flowdb.findOne({
      id: itemid
    }).exec(function(err, finn) {
      if(err) {
        res.send(500, {
          error: "网络错误"
        })
      } else if(finn) {
        flowdb.update({
            id: itemid
          },
          buildupdatedata(itemid,usrid, flowid, nodeid,submitinfo)

        ).exec(function(err, flowdata) {
          if(!flowdata) {
            res.send(200, {
              error: "错误"
            })
          } else{
            Flow.findOne({
              id:flowid
            }).exec(function (err,flow) {
              if(!flow){
                res.send(200,{error:'未找到flows'})
              }else {
                // 这里做出判断，单节点提交数据，只有存库的动作，不再找下个节点及自动审批等动作
                if(flow.flows && flow.flows.length > 0){
                  NextNodeGenerateHandler.startprocess(itemid, usrid, nodeid, flowid, submitinfo, false)
                    .then(function(data) {
                      //这里返回的是itemid
                      res.send(200, {
                        itemid: data.itemid
                      });
                    })
                }else{
                  // 这里是仅有一个节点提交数据的情况
                  res.send(200,{itemid:flowdata.id})
                }
              }
            })
          }
        })
      }else if(!finn){
        res.send(200, {
          error: "notfound"
        })
      }
    })
  },

  //审批的动作
  submitapprove: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var nodeid = req.param("nodeid");
    var itemid = req.param("itemid");
    var submitinfo = JSON.parse(req.param("approveinfo"));
    //这是审批的意见,
    NextNodeGenerateHandler.startprocess(itemid, usrid, nodeid, flowid, submitinfo, false)
      .then(function(data) {
        res.send(200, {
          id: data.itemid
        });
      })
  },

  //从简单关键字进行查询。
  listsks: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var nodeid = req.param("nodeid");
    var nextnodeid = req.param("nextnodeid");
    var keywords = req.param("submitinfo");
    var filterkey = req.param("filterkey")
    var filterValue = req.param("filterValue")
    var isshowflowdata = req.param("isshowflowdata")
    var itemsid = req.param("itemsid")
    return new Promise(function(resolve, reject) {
      handlelistsks(usrid, flowid, nodeid,keywords, filterkey, filterValue,isshowflowdata,nextnodeid,itemsid)
        .then(function(data){
          var querydata = data.querydata
          res.send(200,{data:querydata})
          resolve(data)
        })

    })
    //设置列表过滤条件开始
    //设置列表过滤条件结束

  },

  //从简单关键字进行查询。
  querybysk: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var itemid = req.param('itemid');
    var skid = req.param('skid');
    var flowdb = eval("n" + flowid);
    //线从简单关键字查询出 name key
    Simplekeyword.findOne({
      id: skid
    }).exec(function(err, sk) {
      if(err) {
        res.send(500, {
          error: "网络错误"
        })
      } else if(!sk) {
        res.send(200, {
          error: '未找到这个简单关键字'
        })
      } else {
        //从库里查询对应的信息
        if(itemid != null && itemid != "" && itemid != undefined ) {
          flowdb.findOne({
            id: itemid
          }).exec(function(err, info) {
            if(err) {
              res.send(200, {
                error: '未找到这个信息'
              })
            } else {
              //返回单值
              var key = sk.key;
              var value = '';
              for(var k in info) {
                if(k == key) {
                  value = info[k]
                }
              }
              res.send(200, {
                info: info,
                sk: sk,
                value: value
              })
            }
          })
        } else {
          flowdb.find({

          }).exec(function(err, info) {
            if(err) {
              res.send(200, {
                error: '未找到这个信息'
              })
            } else {
              //返回一组数据
              var key = sk.key;
              res.send(200, {
                info: info,
                sk: sk
              })
            }
          })
        }
      }
    })

  },

  listbyitemid: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var itemid = req.param('itemid');
    var flowdb = eval("n" + flowid);
    flowdb.findOne({
      id: itemid
    }).exec(function(err, info) {
      if(err) {
        res.send(200, {
          error: '未找到这个信息'
        })
      } else {
        res.send(200, {
          info: info
        })
      }
    })
  },

  /*
   data{
   para:{
   usrid: usrid.
   }
   ck:{}
   sks:[]
   results:[]
   }
   */

  //从复杂关键字进行查询。
  querybyck: function(req, res) {
    var usrid = req.param("usrid");
    var keywordid = req.param("keywordid");
    var itemid = req.param("itemid");
    Complexkeyword.findOne({
      id: keywordid
    }).exec(function (err, ck) {
      if (!ck) {
        res.send(200, {error: "没有此ck"});
      } else {
        var _operations = ck.operations;
        var _runCk = true;
        for(var i=0;i<_operations.length;i++){
          if(_operations[i].condition.range.value == "para.itemid" && !itemid){
            _runCk = false;
            break;
          }
        }
        if (_runCk){
          querybyck.querybyckfn(keywordid, usrid, itemid)
            .then(function (reply) {
              res.send(200, {
                data: reply
              })
            })
        }else{
          res.send(200,{error:'请传入itemid'})
        }
      }
    });
    //todo:以下内容待稳定后，可删除，已将相应文件移入querybyck.js中
    // Complexkeyword.findOne({
    //     id: keywordid
    // }).exec(function (err, ck) {
    //     if (!ck) {
    //         res.send(200, {error: "这个关键字设置未找到"});
    //     } else {
    //         var _para = {"usrid":usrid};
    //         //思路：先根据条件取所有数据，然后进行行内操作，再进行纵向操作
    //         getallskinfo(ck, _para)//lyd 找到所有的sk的信息，主要使用sk的id，理解为便于拿数据具体值，找出sk的id，在下边拿
    //             .then(SystemKeyHandler.startprocess)
    //             .then(queryalldatabycondidtion) //lyd这里是根据ck下找出的所有的sk的id，去对应的flow下找所有的sk具体数据
    //             .then(calculate)//计算，有个util.js,
    //             .then(quaryusersinfo)//找ck中用到的人员信息
    //             .then(buildreply)//整理返回的数据结构
    //             .then(function(reply){
    //                 res.send(200, {data:reply})
    //             })
    //     }
    // });
  },

  // 获取预测的流程，即审批流程图
  getexceptedflow: function(req, res) {
    var usrid = req.param("usrid");
    var flowid = req.param("flowid");
    var itemid = req.param("itemid");
    forecastprocess(usrid, flowid, itemid) // 预测审批流程
      .then(function(data) {
        res.send(200, {
          flows: data
        })
      })
  },

  //输入框查询 系统关键字 和 ck
  //列出我的上级 我自己 返回
  querymyselfandmyboss:function(req,res){
    var usrid = req.param("usrid")
    var myself = ""
    var mybossname = ""
    var departmentId = ""
    Users.findOne({id:usrid}).exec(function(err,usr){
      var personid = usr.personId
      Person.findOne({id:personid}).exec(function(err,person){
        if(person){
//					if(person.personName){
//						myself = person.personName
//					}else{
//						myself = person.loginName
//					}
          myself = usrid
          departmentId = person.departmentId
          Department.findOne({id:departmentId}).exec(function(err,department){
            var bossid = ""
            if(department){
              bossid = department.ownerId
              Users.findOne({id:bossid}).exec(function(err,boss){
                if(boss){
                  var bossId = boss.personId
                  Person.findOne({id:bossId}).exec(function(err,myboss){
                    if(myboss){
//											if(myboss.personName){
//												mybossname = myboss.personName
//											}else{
//												mybossname = myboss.loginName
//											}
                      mybossname=bossid
                    }
                  }).exec(function(err,org){
                    if(err){

                    }else{
                      res.send(200,{myself:myself,myboss:mybossname})
                    }
                  })
                }else{
                  res.send(200,{myself:myself,myboss:mybossname})
                }
              })
            }else{
              res.send(200,{myself:myself,myboss:mybossname})
            }
          })
        }else{
          res.send(200,{myself:myself,myboss:mybossname})
        }

      })
    })
  }
  //

};

//输入框查询 系统关键字 和 ck






//列表设置过滤条件开始

function handlelistsks(usrid, flowid, nodeid,keywords, filterkey,filterValue,isshowflowdata,nextnodeid,itemsid) {
  return new Promise(function(resolve, reject) {
    collectsksdata({
      usrid: usrid,
      flowid: flowid,
      nodeid:nodeid,
      keywords: keywords,
      filterkey: filterkey,
      filterValue: filterValue,
      isshowflowdata:isshowflowdata,
      nextnodeid:nextnodeid,
      itemsid:itemsid
    })
      .then(querybyfilterkeyifneed)
      .then(querybykeywordsifneed)
      .then(function(data) {
        resolve(data);
      })
  })
}

//整合参数
function collectsksdata(data) {
  return new Promise(function(resolve, reject) {
    resolve(data);
  })
}

function querybyfilterkeyifneed(data) {
  return new Promise(function(resolve, reject) {
    queryusrnamebyusrid(data)
      .then(querymybossbyusrid)
      .then(getallflowsids)
      .then(queryitemid)
      .then(setfiltervalue)
      .then(function(data){
        resolve(data);
      })
  })
}


function queryusrnamebyusrid(data) {
  var usrid = data.usrid
  var filterValue = data.filterValue
  return new Promise(function(resolve, reject) {
    //如果为myself
    if(/system-myself/.test(filterValue)){
      Users.findOne({id:usrid}).exec(function(err,usr){
        if(usr){
          var personid = usr.personId;
          Person.findOne({id:personid}).exec(function(err,person){
            if(person){
              var name = ""
              if(person.personName){
                name = person.personName
              }else{
                name = person.loginname
              }
              if(name != ""){
                data.filtername = name
              }
              resolve(data);
            }else{
              resolve(data);
            }
          })
        } else {
          resolve(data);
        }
      })
    }else{
      resolve(data);
    }
  })
}

function querymybossbyusrid(data) {
  var filterValue = data.filterValue
  return new Promise(function(resolve, reject) {
    //如果为myself
    if(/system-myboss/.test(filterValue)){
      getdepartmentidbyusrid(data)
        .then(getmybossidbydepartmentid)
        .then(getmybossnamebybossid)
        .then(function(data){
          resolve(data)
        })
    }else{
      resolve(data);
    }
  })
}

function getdepartmentidbyusrid(data) {
  var usrid = data.usrid
  return new Promise(function(resolve, reject) {
    Users.findOne({id:usrid}).exec(function(err,usr){
      var personid = usr.personId
      Person.findOne({id:personId}).exec(function(err,person){
        if(person){
          data.departmentId = person.departmentId
          resolve(data);
        }else{
          resolve(data);
        }
      })
    })
  })
}

function getmybossidbydepartmentid(data) {
  var departmentId = data.departmentId
  return new Promise(function(resolve, reject) {
    if(departmentId){
      Department.findOne({id:departmentId}).exec(function(err,department){
        var bossid = ""
        if(department){
          bossid = department.ownerId
        }
        if(bossid != ""){
          data.bossid = bossid
        }
        resolve(data);
      })
    }else{
      resolve(data);
    }
  })
}

function getmybossnamebybossid(data) {
  var id = data.bossid
  return new Promise(function(resolve, reject) {
    if(id){
      Person.findOne({id:id}).exec(function(err,person){
        if(person){
          var name = ""
          if(person.personName){
            name = person.personName
          }else{
            name = person.loginname
          }
          if(name != ""){
            data.filtername = name
          }
          resolve(data);
        }else{
          resolve(data);
        }
      })
    }else{
      resolve(data);
    }
  })
}
function getallflowsids(data){
  return new Promise(function(resolve, reject) {
    if(/system-myitemid/.test(data.filterValue)){
      Flow.find({

      }).exec(function (err,flow) {
        if(!flow){
          res.send(200,{error:'未找到flows'})
        }else {
          var allflowids = [];
          for(let i=0;i<flow.length;i++){
            allflowids.push(flow[i].id);
          }
          data.allflowids = allflowids;
          resolve(data);
        }
      })
    }else{
      resolve(data);
    }
  })
}
function queryitemid(data){
  return new Promise(function (resolve,reject) {
    if(data.itemsid){
      var _allflowids = data.allflowids;
      async.series(
        buildfntofinditemdata(_allflowids,data.itemsid),
        function (err,resu) {
          if(resu){
            //这里边做的是获取key对应的value
            var resultsarr = [];
            for(let i=0;i<resu.length;i++){  //返回的是一个数组，有若干个空项，只有一项是一个数组内容是一个对象
              if(resu[i] != ""){
                resultsarr = resu[i][0];
              }
            }
            data.filterValue = resultsarr[data.filterkey];
            //这里边做的是获取key对应的value
            resolve(data)
          }
        })
    }else{
      resolve(data)
    }
  })
}
function setfiltervalue(data) {
  var filterkey = data.filterkey
  var filterValue = data.filterValue
  return new Promise(function(resolve, reject) {
    if(!(/system-/.test(data.filterValue))){
      data.filtername = filterValue
      resolve(data);
    }else{
      resolve(data);
    }
  })
}


function querybykeywordsifneed(data) {
  var usrid = data.usrid
  var flowid = data.flowid
  var nodeid = data.nodeid
  var keywords = data.keywords
  var filtername = data.filtername
  var filterkey = data.filterkey
  var isshowflowdata = data.isshowflowdata
  var flowdb = eval("n"+flowid)
  var filtervalue = data.filterValue;
  var nextnodeid = data.nextnodeid;
  var nextnodeidarg ={};
  if(nextnodeid){
    nextnodeidarg = {"nextnodeid":nextnodeid};
  }
  return new Promise(function(resolve, reject) {
    if(isshowflowdata == "false"){
      if(keywords) {
        var _submitinfo = JSON.parse(keywords);
        _submitinfo.usrid = usrid;
        _submitinfo.nextnodeid = nextnodeid
        var flowdb = eval("n" + flowid);
        flowdb.find(
          _submitinfo
        ).exec(function(err, flowdatas) {
          if(!flowdatas) {
            res.send(200, {
              error: "未知错误"
            })
          } else {
            var builddata = buildresultsbykeys(keywords, flowdatas)
            var newbuilddata = []
            if(filtername && filterkey){
              for(var i=0,len=builddata.length;i<len;i++){
                if(builddata[i][filterkey] == filtername){
                  newbuilddata.push(builddata[i])
                }
              }
              data.querydata = newbuilddata
              resolve(data);
            }else{
              data.querydata = builddata
              resolve(data);
            }
          }
        })
      } else {
        var flowdb = eval("n" + flowid);
        flowdb.find(
          nextnodeidarg
        ).exec(function(err, flowdatas) {
          if(!flowdatas) {
            res.send(200, {
              error: "未知错误"
            })
          } else {
            var builddata = buildresultsbykeys(keywords, flowdatas)
            var newbuilddata = []
            if(filtername && filterkey){
              for(var i=0,len=builddata.length;i<len;i++){
                if(builddata[i][filterkey] == filtername){
                  newbuilddata.push(builddata[i])
                }
              }
              data.querydata = newbuilddata
              resolve(data);
            }else{
              data.querydata = builddata
              resolve(data);
            }

          }
        })
      }
    }else if(isshowflowdata == "true"){
      if(keywords) {
        var _submitinfo = JSON.parse(keywords);
        _submitinfo.usrid = usrid;
        var flowdb = eval("n" + flowid);
        flowdb.find(
          _submitinfo
        ).exec(function(err, flowdatas) {
          if(!flowdatas) {
            res.send(200, {
              error: "未知错误"
            })
          } else {
            var builddata = buildresultsbykeys(keywords, flowdatas)
            var newbuilddata = []
            if(filtername && filterkey){

              for(var i=0,len=builddata.length;i<len;i++){
                if(builddata[i][filterkey] == filtername){
                  newbuilddata.push(builddata[i])
                }
              }
              data.querydata = newbuilddata
              resolve(data);
            }else{
              data.querydata = builddata
              resolve(data);
            }
          }
        })
      } else {
        var flowdb = eval("n" + flowid);

        flowdb.find(
          nextnodeidarg
        ).exec(function(err, flowdatas) {
          if(!flowdatas) {
            res.send(200, {
              error: "未知错误"
            })
          } else {
            var builddata = buildresultsbykeys(keywords, flowdatas)
            var newbuilddata = []
            if(filtername && filterkey){
              for(let i=0,len=builddata.length;i<len;i++){
                if(builddata[i][filterkey] == filtername){
                  newbuilddata.push(builddata[i])
                }
              }
              data.querydata = newbuilddata
              resolve(data);
            } else if(filtervalue){ //liuguochao--选我自己的时候不生效--把builddata里边是数据的集合，跟surid做对比
              data.querydata = builddata
              var builddata = buildresultsbykeys(keywords, flowdatas)
              var newbuilddata = [];
              for(let i=0,len=builddata.length;i<len;i++){
                if(builddata[i].usrid == usrid){
                  newbuilddata.push(builddata[i])
                }
              }
              data.querydata = newbuilddata;
              resolve(data);
            }else{
              data.querydata = builddata
              resolve(data);
            }

          }
        })
      }
    }


  })
}
// 预测审批流程
function forecastprocess(usrid, flowid, itemid) {
  return new Promise(function(resolve, reject) {
    gethistorynode(usrid, flowid, itemid) // 先从history找审批经过的节点，同时把history中按照时间排序最后一个单独保存，作为预测的开始节点
      .then(getflowdata) // 获取流程的信息
      .then(forecastnode) // 预测下一个节点
      .then(buildforecastprocessdata) // 整理数据
      .then(function(data) {
        resolve(data)
      })
  })
}

// 预测下一个节点,这是个地龟,用户保存nodeid的数组，在创建data对象时已经创建
function forecastnode(data) {
  // 参数：itemid，usrid，nodeid，flowid，submitinfo,isforecast
  return new Promise(function(resolve, reject) {
    var _itemid = data.itemid;
    var _usrid = data.usrid;
    var _flowid = data.flowid;
    var _nodeid = data.lasthistorynodeid;
    var _submitinfo = {};
    _submitinfo["shenpistatus"] = "approve";
    _submitinfo["shenpicomments"] = "";

    NextNodeGenerateHandler.startprocess(_itemid, _usrid, _nodeid, _flowid, _submitinfo, true)
      .then(function(resu) {
        if(data.lasthistorynodeid == resu.nextnodeid || data.lasthistorynodeid == "") {
          resolve(data);
        } else {
          data.lasthistorynodeid = resu.nextnodeid;
          if(data.lasthistorynodeid){
            data.forecastnodeidarr.push(data.lasthistorynodeid);
          }
          forecastnode(data)
            .then(function() {
              if(data.lasthistorynodeid == resu.nextnodeid || data.lasthistorynodeid == "") {
                resolve(data);
              }
            })
        }
      })
  })
}

function buildforecastprocessdata(data) {
  return new Promise(function(resolve, reject) {
    var _historiesnodeidarr = data.historiesnodeidarr;
    var _forecastnodeidarr = data.forecastnodeidarr;
    var nodes = data.flowInfo.nodes;
    var _temparr = [];
    for(var i = 0; i < _forecastnodeidarr.length; i++) {
      if(_forecastnodeidarr[i] == '') {
        continue;
      }
      var _tempObj = {};
      _tempObj["nodeid"] = _forecastnodeidarr[i];
      _tempObj["nodename"] = getnodenamebynodeid(_forecastnodeidarr[i], nodes);
      // 库中没有nodedesc，这里返回的结果是""
      _tempObj["nodedesc"] = getnodedescbynodeid(_forecastnodeidarr[i], nodes);

      // 判断数组中的nodeid在历史记录中查的到，ispassed = true,预测的是false
      if(_historiesnodeidarr.indexOf(_forecastnodeidarr[i]) != -1) {
        _tempObj["ispassed"] = true;
      } else {
        _tempObj["ispassed"] = false;
      }
      // 库中没有存icon，先置空
      _tempObj["icon"] = "";
      _temparr.push(_tempObj);
    }
    resolve(_temparr)
  })

}

function getnodenamebynodeid(nodeid, nodes) {
  for(var i = 0; i < nodes.length; i++) {
    if(nodes[i].nodeid == nodeid) {
      return nodes[i].name;
    }
  }
}

function getnodedescbynodeid(nodeid, nodes) {
  for(var i = 0; i < nodes.length; i++) {
    if(nodes[i].nodeid == nodeid) {
      if(nodes[i].desc) {
        return nodes[i].desc;
      } else {
        return "";
      }
    }
  }
}
// 获取指定流程的信息
function getflowdata(data) {
  return new Promise(function(resolve, reject) {
    var _flowid = data.flowid;
    Flow.findOne({
      id: _flowid
    }).exec(function(err, flow) {
      if(!flow) {
        reject("getflowdata error")
      } else {
        data.flowInfo = flow;
        resolve(data);
      }
    })
  })
}

// 获取已存在历史审批节点数据，并做排序，保存在一个数组中
function gethistorynode(usrid, flowid, itemid) {
  return new Promise(function(resolve, reject) {
    Approvalhistory.find({
      where: {
        "itemid": itemid
      },
      sort: "updateAt ASC"
    }).exec(function(err, histories) {
      if(!histories) {
        reject("gethistorynode error")
      } else {
        var data = {};
        data.usrid = usrid;
        data.flowid = flowid;
        data.itemid = itemid;
        data.historiesInfo = histories;
        if(histories && histories.length > 0){
          data.lasthistorynodeid = histories[0].nodeid;
          data.forecastnodeidarr = [histories[0].nodeid];
        }
        data.historiesnodeidarr = [];
        for(var i = 0; i < histories.length; i++) {
          if(histories[i].shenpistatus == 'deny'){
            data.historiesnodeidarr = []
            continue
          }
          data.historiesnodeidarr.push(histories[i].nodeid)
        }
        resolve(data);
      }
    })
  })
}
///////////////////////////////////////////////////////////////////////////////
//for simple key
function buildsubmitdata(id,usrid, flowid, nodeid, submitinfo) {
  submitinfo["usrid"] = usrid;
  submitinfo["id"] = id;
  submitinfo["flowid"] = flowid;
  submitinfo["nodeid"] = nodeid;
  return submitinfo;
}

function buildupdatedata(id,usrid, flowid,  nodeid,submitinfo){
  submitinfo["usrid"] = usrid;
  submitinfo["id"] = id;
  submitinfo["flowid"] = flowid;
  submitinfo["nodeid"] = nodeid;
  return submitinfo;
}

function buildresultsbykeys(keys, flowdatas) {
  return flowdatas;
}

///////////////////////////////////////////////////////////////////////////////
//for compelx key
//TODO：lyd   以下均可删除，暂时没删除原因是在queryckjs中已有一份，但不知否稳定，待稳定后再删除以下函数
//根据条件来对每一项进行搜索。
function getallskinfo(ck, _para) {
  return new Promise(function(resolve, reject) {
    Simplekeyword.find({
      or: getkeylike(ck, "skid")
    }).exec(function(err, sks) {
      if(sks) {
        resolve({
          cks: ck,
          sks: sks,
          _para: _para
        });
        //lyd   这里是返回找出的sk的信息，同时返回传入的ck，理解为sks是个[{},...]  log确定
      } else {
        reject(err);
      }
    })
  });
}

function queryalldatabycondidtion(data) {
  //这里的cks也就是ck所有数据
  var cks = data.cks; // 原始的complex key
  var sks = data.sks; // 取出的simple key类型。
  return new Promise(function(resolve, reject) {
    //异步调用所有的
    async.series(
      //lyd 这里是准备一个队列，是一组XXX.find(){}...
      buildckqueryfunctions(cks, sks),
      function(err, results) { //lyd   log一下看找到的数据的结果！
        if(results) {
          data.results = results;
          resolve(data);
        } else {
          reject(err);
        }
      }
    );
  });
}

function quaryusersinfo(data) {
  return new Promise(function(resolve, reject) {
    //这里返回data.cks中的id
    var _search_condition = [];
    // for(var j = 0; j < data.results[0].length;j++){
    //     var temp = {};
    //     //TODO, 为什么有"fuzeren"
    //     temp.id = data.results[0][j].fuzeren;
    //     _search_condition.push(temp);
    // }
    for(var j = 0; j < data.cks.operations.length; j++) {
      var temp = {};
      if(data.cks.operations[j].condition.persons.who) {
        temp.id = data.cks.operations[j].condition.persons.who;
        _search_condition.push(temp);
      }
    }
    Users.find({
      or: _search_condition
    }).exec(function(err, users) {
      if(users) {
        data.usersinfo = users;
        resolve(data)
      } else {
        reject('quaryusersinfo error')
      }
    })
  })
}

//整理返回的数据结构
function buildreply(data) {
  return new Promise(function(resolve, reject) {
    var _cks = data.cks;
    var _sks = data.sks;
    var _results = data.results;
    var _calcval = data.calcval;
    var _usersinfo = data.usersinfo;

    var isRange = false; //是否设定了范围
    var isInterVal = false; //是否设定了返回频率
    var isDuration = false; //是否设定了时间范围
    var isWho = false; //是否设定了person

    var _returnVal = {};
    //以第一行的条件设置作为返回JOSN数据结构的依据
    if(_cks.operations[0].condition.range.value && _cks.operations[0].condition.range.skid && _cks.operations[0].condition.range.operation) {
      isRange = true;
    }
    if(_cks.operations[0].condition.duration.interval) {
      isInterVal = true;
    }
    if(_cks.operations[0].condition.duration.start && _cks.operations[0].condition.duration.end && _cks.operations[0].condition.duration.skid) {
      isDuration = true;
    }
    if(_cks.operations[0].condition.persons.who && _cks.operations[0].condition.persons.skid && _cks.operations[0].condition.persons.operation) {
      isWho = true;
    }

    //判断节点的前置条件，两边都有前置条件，使用calc计算过的值   只有一边有前置条件，应报错  两边都没有前置条件，视为返回JSON结构的数据

    if(!isRange && !isWho && !isDuration) {
      if(isInterVal) {
        resolve("暂时没加interval判断")

      } else {
        _returnVal["name"] = data.cks.name;
        _returnVal["desc"] = data.cks.desc;
        // 这里返回数据的长度也按照第一行查出的数据长度为准，不管左右节点有几个，如果无前置条件并进行计算的话，数组长度不一致，会报错，如果长度一致，
        // 取第一行查出的数据长度也就合理了
        _returnVal.value = data.calcval;
        if(_returnVal) {
          resolve(_returnVal)
        } else {
          reject('!isRange && !isWho && !isDuration error')
        }
      }
    } else if(isRange && isDuration && isWho) {
      if(isInterVal) {
        resolve("暂时没加interval判断")
      } else {
        var _whoval = _cks.operations[0].condition.persons.who;
        var _whoname = getusername(_whoval, _usersinfo);
        var _rangeval = _cks.operations[0].condition.range.value;

        _returnVal["name"] = data.cks.name;
        _returnVal["desc"] = data.cks.desc;
        _returnVal["value"] = [];
        for(var i = 0; i < _calcval.length; i++) {
          var _temp = {};
          _temp[_whoname] = {};
          _temp[_whoname][_rangeval] = _calcval[i];
          _returnVal.value.push(_temp)
        }
        if(_returnVal) {
          resolve(_returnVal)
        } else {
          reject('isRange && isDuration && isWho  error')
        }
      }

    } else if(isWho && isDuration) {
      if(isInterVal) {
        resolve("暂时没加interval判断")
      } else {
        var _whoval = _cks.operations[0].condition.persons.who;
        var _whoname = getusername(_whoval, _usersinfo);

        _returnVal["name"] = data.cks.name;
        _returnVal["desc"] = data.cks.desc;
        _returnVal["value"] = [];

        for(var i = 0; i < _calcval.length; i++) {
          var _temp = {};
          _temp[_whoname] = {};
          _temp[_whoname] = _calcval[i];
          _returnVal["value"].push(_temp)
        }

        if(_returnVal) {
          resolve(_returnVal)
        } else {
          reject('isWho && isDuration erorr')
        }
      }

    } else if(isDuration) {
      if(isInterVal) {
        resolve("暂时没加interval判断")
      } else {
        _returnVal["name"] = data.cks.name;
        _returnVal["desc"] = data.cks.desc;
        _returnVal.value = data.calcval;

        if(_returnVal) {
          resolve(_returnVal)
        } else {
          reject("isDuration error")
        }
      }
    } else {
      _returnVal["name"] = data.cks.name;
      _returnVal["desc"] = data.cks.desc;
      _returnVal["value"] = data.calcval;
      resolve(_returnVal);
    }

  })
}

function calculate(data) {
  return new Promise(function(resolve, reject) {
    if(data.results) {
      //进到这个api的时候，data的results中存的是根据条件搜索出来的数据，下一步是按要求进行行内和行间的计算。
      var ret = [];
      var eachRowResuarr = [];
      //计算每一行的数据
      for(var i = 0; i < data.cks.operations.length; i++) {
        var _idx = i;

        //找左侧skid的具体数据
        var _func = data.cks.operations[i].func;
        var dataRowLarr = [],
          dataRowRarr = []; //保存的是左右节点的数据
        var resuLarr = [],
          resuRarr = []; //保存左右节点计算的结果
        var operationRowL = '',
          operationRowR = ''; //左右前置条件
        var _rangeValue = data.cks.operations[i].condition.range.value;
        var isGroupByNeeded = false;
        var groupByKey = '';
        var groupByDataarr = []; //这里是groupby的值[{k:v},...]
        var groupByDataKeyarr = []; //这里是groupby的k[k,...]
        var groupByDataValarr = []; //这里是groupby的v[v,...]

        //取左右节点数据代码可在group中复用，代码提前
        if(_func.leftnodeskid) {
          dataRowLarr = getdatabycolum(_idx, _func.leftnodeskid, data.sks, data.results);
          var tempdataRowLarr = [];
          for(var r = 0; r < dataRowLarr.length; r++) {
            tempdataRowLarr[r] = Number(dataRowLarr[r]);
          }
          dataRowLarr = tempdataRowLarr
        }
        // 找右侧skid的具体数据
        if(_func.rightnodeskid) {
          dataRowRarr = getdatabycolum(_idx, _func.rightnodeskid, data.sks, data.results);
          var tempdataRoWRarr = [];
          for(var s = 0; s < dataRowRarr.length; s++) {
            tempdataRoWRarr[s] = Number(dataRowRarr[s]);
          }
          dataRowRarr = tempdataRoWRarr;
        }

        //这里判断groupby谁
        if(_rangeValue && _rangeValue == "all") {
          groupByKey = data.cks.operations[i].condition.range.skid;
          isGroupByNeeded = true;
        } else {
          groupByKey = data.cks.operations[i].condition.range.skid;
        }

        //需要进行GroupBy的
        if(isGroupByNeeded) {
          groupByDataKeyarr = getdatabycolum(_idx, groupByKey, data.sks, data.results);
          if(dataRowLarr) {
            groupByDataValarr = dataRowLarr;
          } else if(dataRowRarr) {
            groupByDataValarr = dataRowRarr;
          }
          for(var i = 0; i < groupByDataKeyarr.length; i++) {
            var tempGroupByData = {};
            tempGroupByData[groupByDataKeyarr[i]] = groupByDataValarr[i];
            groupByDataarr.push(tempGroupByData)
          }
        }

        if(!isGroupByNeeded) {
          // 找左侧skid的前置条件
          if(_func.leftnodeskoperation) {
            operationRowL = _func.leftnodeskoperation
          }
          //找右侧skid的前置条件
          if(_func.rightnodeskoperation) {
            operationRowR = _func.rightnodeskoperation;
          }

          //对左侧数据进行计算
          if(dataRowLarr) {
            if(_func.leftnodeskoperation == "sum") {
              resuLarr[0] = Util.arraysum(dataRowLarr);
              iscalcvaluseable(resuLarr);
            } else if(_func.leftnodeskoperation == "avg") {
              resuLarr[0] = Util.arrayaveg(dataRowLarr);
              iscalcvaluseable(resuLarr);
            } else if(_func.leftnodeskoperation == "") {
              resuLarr = dataRowLarr;
              iscalcvaluseable(resuLarr);
            }
          }
          // 对右侧数据进行计算
          if(dataRowRarr) {
            if(_func.rightnodeskoperation == "sum") {
              resuRarr[0] = Util.arraysum(dataRowRarr);
              iscalcvaluseable(resuRarr);
            } else if(_func.rightnodeskoperation == "avg") {
              resuRarr[0] = Util.arrayaveg(dataRowRarr);
              iscalcvaluseable(resuRarr);
            } else if(_func.rightnodeskoperation == "") {
              resuRarr = dataRowRarr;
              iscalcvaluseable(resuRarr);
            }
          }

          var resuRowarr = [];
          if(resuLarr) {
            resuRowarr = resuLarr
          } else if(resuRarr) {
            resuRowarr = resuRarr
          } else if(resuLarr && resuRarr) {
            if(_func.operation == "+") {
              resuRowarr = Util.add(resuLarr, resuRarr);
              iscalcvaluseable(resuRowarr);
            } else if(_func.operation == "-") {
              resuRowarr = Util.sub(resuLarr, resuRarr);
              iscalcvaluseable(resuRowarr);
            } else if(_func.operation == "*") {
              resuRowarr = Util.app(resuLarr, resuRarr);
              iscalcvaluseable(resuRowarr);
            } else if(_func.operation == "/") {
              resuRowarr = Util.divs(resuLarr, resuRarr);
              iscalcvaluseable(resuRowarr);
            } else if(_func.operation == "") {
              resuRowarr = resuLarr;
              iscalcvaluseable(resuRowarr);
            }
          }
          eachRowResuarr.push(resuRowarr)
        }
      }

      if(!isGroupByNeeded) {
        // 计算只有一行的情况
        if(data.cks.operations.length == '1') {
          ret = eachRowResuarr;
        }

        //计算有多行的情况
        if(data.cks.operations.length > 1) {
          var totalNum = 0; //声明一个变量，判断每行的行首条件，往totalNum中操作，为空，赋值给totalNum，
          for(var j = 0; j < data.cks.operations.length; j++) {
            if(data.cks.operations[j].operation == '') {
              totalNum = eachRowResuarr[j];
            } else if(data.cks.operations[j].operation == '+') {
              totalNum = Util.add(totalNum, eachRowResuarr[j]);
              iscalcvaluseable(totalNum);
            } else if(data.cks.operations[j].operation == '-') {
              totalNum = Util.sub(totalNum, eachRowResuarr[j]);
              iscalcvaluseable(totalNum);
            } else if(data.cks.operations[j].operation == '*') {
              totalNum = Util.app(totalNum, eachRowResuarr[j]);
              iscalcvaluseable(totalNum);
            } else if(data.cks.operations[j].operation == '/') {
              totalNum = Util.divs(totalNum, eachRowResuarr[j]);
              iscalcvaluseable(totalNum);
            }
          }
          ret.push(totalNum)
        }
      }

      if(isGroupByNeeded) {
        ret[0] = groupByDataarr
      }

      data.calcval = ret[0];
      resolve(data);
    } else {
      reject("error")
    }
  })
}

function customergroupby(key, value) {

  var _ret = [];
  var index = -1;
  for(var i = 0; i < key.length; i++) {
    var _temp = {};

    var index = keyfinder(_ret, key[i]);
    // if(_ret.length == 0){
    //     index = -1
    // }
    // for(var j = 0; j < _ret.length;j++){
    //     for(var _key in _ret[j]){
    //         if(_key == key[i]){
    //           index = j;
    //         }else{
    //           index = -1
    //         }
    //     }
    // }
    if(index == -1) {
      _temp[key[i]] = value[i];
      _ret.push(_temp);
      _temp = {}
    } else {
      _ret[index][key[index]] = Number(_ret[index][key[index]]) + Number(value[i]);
    }
  }
}

function keyfinder(retarr, key) {
  if(retarr.length == 0) {
    return -1;
  }
  for(var j = 0; j < retarr.length; i++) {
    for(var _key in retarr[j]) {
      if(_key == key) {
        return j;
      } else {
        return -1;
      }
    }
  }
}

//lyd  这里key可能会有错，需要log    找包含skid  这里得细看一下if中keylike，理解为if中的keylike需写成’skid‘,具体log一下
function getkeylike(ck, keylike) {
  var ret = [];
  return _getkeylike(ck, keylike);

  function _getkeylike(ck, keylike) {
    for(var key in ck) {
      if(ck[key] && typeof ck[key] == 'object') {
        ret.concat(_getkeylike(ck[key], keylike));
      } else {
        if(key.indexOf(keylike) != -1) {
          if(ck[key]) {
            var temp = {}; //此处只是给对象的id赋值用，需要放for里
            temp.id = ck[key];
            ret.push(temp);
          }
          //lyd 这里得log出temp，确定具体格式及信息
        }
      }
    }

    //这里是sql里or后的条件，必须是个数组
    return ret;
  }
}

function buildckqueryfunctions(cks, sks) { //根据ck中的operations中的condition，做循环拼出sql，这里一个condition是一行，
  var ret = [];
  var lefttemp, righttemp;
  for(var key in cks) {
    if(cks[key] && typeof cks[key] == "object") { //这里找到的是operations
      for(var i = 0; i < cks[key].length; i++) {
        //这里不适用闭包，会在创建查询函数时候，取不到查询的条件
        (function() {
          var con = {},
            func = [];
          if(cks[key][i] && cks[key][i].condition) {
            if(cks[key][i].condition.range) { //lyd  这里返回的r开头的keyname在哪个document中
              var rangeKeyname = getskname(cks[key][i].condition.range.skid, sks);
              var rangeK, rangeV;
              rangeK = cks[key][i].condition.range.operation;
              rangeV = cks[key][i].condition.range.value;
              // 这里拼出是这样的
              //{xiangmu:xiangmuA}
              if(rangeV != 'all') {
                if(rangeKeyname && rangeK && rangeV) {
                  if(rangeK == "=") {
                    con[rangeKeyname] = rangeV;
                  }
                }
              }
            }
            if(cks[key][i].condition.duration) {
              var durationKeyname = getskname(cks[key][i].condition.duration.skid, sks);
              var durationS, durationE;
              durationS = cks[key][i].condition.duration.start;
              durationE = cks[key][i].condition.duration.end;

              if(durationKeyname && durationS && durationE) {
                // 这里拼出是这样的，注意：符号之后只能用string
                // {shijian:{'>=':'1485907200000','<':'1488326400000'}}
                var _opera = {};
                _opera[">="] = String(durationS);
                _opera["<"] = String(durationE);
                con[durationKeyname] = {
                  '>=': _opera[">="],
                  '<': _opera["<"]
                }
              }
            }
            if(cks[key][i].condition.persons) {
              var personsKeyname = getskname(cks[key][i].condition.persons.skid, sks);
              var personsK, personsV;
              personsK = cks[key][i].condition.persons.operation;
              personsV = cks[key][i].condition.persons.who;
              // 这里拼出是这样的
              //{xiangmu:xiangmuA}
              if(personsKeyname && personsK && personsV) {
                if(personsK == "=") {
                  con[personsKeyname] = personsV;
                }
              }
            }
          }

          if(cks[key][i] && cks[key][i].func) {
            if(cks[key][i].func.leftnodeskid) {
              var _leftgetskdb = getskdb(cks[key][i].func.leftnodeskid, sks);
              var _conL = con;
              var _leftquerybyconditionFn = function(callback) {
                var _flowdbL = eval("n" + _leftgetskdb);
                _flowdbL.find(
                  _conL
                ).exec(function(err, val) {
                  if(val) {
                    callback(null, val)
                  } else {
                    callback(null, '')
                  }
                })
              };
              ret.push(_leftquerybyconditionFn);
            } else if(cks[key][i].func.rightnodeskid) {
              var _rightgetskdb = getskdb(cks[key][i].func.rightnodeskid, sks);
              var _conR = con;
              var _rightquerybyconditionFn = function(callback) {
                var _flowdbR = eval("n" + _rightgetskdb);
                _flowdbR.find(
                  _conR
                ).exec(function(err, val) {
                  if(val) {
                    callback(null, val)
                  } else {
                    callback(null, '')
                  }
                })
              };
              ret.push(_rightquerybyconditionFn);
            } else {
              //这里判断没有左右节点的情况

            }
          }

        }())
      }
    }
  }
  return ret;
}

function getskname(skid, sks) {
  for(var i = 0; i < sks.length; i++) {
    if(skid == sks[i].id) {
      return sks[i].key;
    }
  }
}

function getskdb(skid, sks) {
  for(var i = 0; i < sks.length; i++) {
    if(skid == sks[i].id) {
      return sks[i].flowid;
    }
  }
}

function getdatabycolum(where, skid, sks, results) {
  var ret = [];
  var name = getskname(skid, sks);
  for(var i = 0; i < results[where].length; i++) {
    var _val = results[where][i][name];
    ret.push(_val)
  }
  return ret;
}

function getusername(id, usersinfo) {
  for(var i = 0; i < usersinfo.length; i++) {
    if(id == usersinfo[i].id) {
      if(usersinfo[i].realname) {
        return usersinfo[i].realname;
      } else {
        return usersinfo[i].loginname;
      }
    }
  }
}

function iscalcvaluseable(val) {
  if(typeof val == 'string') {
    // console.log(val);
    return false;
  } else {
    return true;
  }
}

//生成数据id
function daterandom() {
  //根据当前时间，生成随机数
  var date = new Date().getTime()
  //从后面取四位
  var str = new String(date)

  str =str.substr(-12)
  //生成四位随机数
  str += RndNum(4)
  return str;
}
//生成n位随机数
function RndNum(n){
  var rnd = "";
  for(var i=0;i<n; i++){
    rnd += Math.floor(Math.random()*10);
  }
  return rnd;
}
function buildfntofinditemdata(flowids,itemsid) {
  var ret = [];
  for(var i = 0 ; i < flowids.length;i++){
    (function(){
      try {
        var _flowid = flowids[i];
        var _flowdb = eval('n' + _flowid);
        var _fn = function (callback) {
          _flowdb.find({
            id: itemsid
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
      }
    }())
  }
  return ret;
}
