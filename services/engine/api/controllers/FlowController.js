/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createflow: function (req, res) {
        //创建的时候，将页面数据存到flowview中，将流程元素存到flow中。
        var name = req.param('flowname');
        var desc = req.param('flowdesc');
        Flow.create({
            name: name,
            desc: desc
        }).exec(function (err,flow) {
            if(!flow){
                res.send(200,{error:"未找到flow"})
            }else{
                Flowview.create({
                    id:flow.id
                }).exec(function (err,flowview) {
                    if(!flowview){
                        res.send(200,{error:"未找到flowview"})
                    }else{
                        // 创建消息组
                        var _title = name + "消息";
                        var _desc = name + "消息";
                        Messagegroup.create({
                            identify:flow.id,
                            title:_title,
                            desc:_desc,
                            icon:""
                        }).exec(function (err,messagegroup) {
                            if(!messagegroup){
                                res.send(200,{error:"messagegroup创建失败"})
                            }else{
                                createflowmodel(flow.id);
                                res.send(200,{id:flow.id,name:flow.name,desc:flow.desc})
                            }
                        })
                    }
                })
            }
        })
    },

    getflow:function (req,res) {
        //进入创建或者编辑时候，根据flowid找当前flowid下的flow和flowview
        // 列出所有id或者maindivid等于传入id的流程，有maindivid的都是子流程，主流程无此字段
        var id = req.param("flowid");

        Flow.find({
            or:[
                {id:id},
                {mainflowid:id}
            ]
        }).exec(function (err,flow) {
            if(!flow){
                res.send(200,{error:"未找到flow"})
            }else{
                Flowview.find({
                    or:[
                        {id:id},
                        {mainflowid:id}
                    ]
                }).exec(function (err,flowview) {
                    if(!flowview){
                        res.send(200,{error:"未找到flowview"})
                    }else{
                        res.send(200,{flow:flow,flowview:flowview})
                    }
                })
            }
        })
    },

    // 列出所有流程
    listflow:function (req,res) {
        //列出所有的flow和flowview信息
        Flow.find({

        }).exec(function (err,flows) {
            if(!flows){
                res.send(200,{error:"未找到flows"})
            }else{
                Flowview.find({

                }).exec(function (err,flowviews) {
                    if(!flowviews){
                        res.send(200,{error:"未找到flowviews"})
                    }else{
                        for(var i = 0 ; i < flows.length;i++){
                            // 有mainflowid字段的是子流程，子流程名称为主流程name + '--' + 子流程name
                            if(flows[i].mainflowid){
                              flows[i].name = flows[i].name + "(" + getmainflowname(flows[i].id,flows) + ")";
                            }
                        }
                        res.send(200,{flows:flows,flowviews:flowviews})
                    }
                })
            }
        })
    },

    // 列出主流程,在页面Flow中展示，所有的主流程
    listmainflow:function (req,res) {
        Flow.find({})
            .exec(function (err,flows) {
                if(!flows){
                    res.send(200,{error:'未找到flow'})
                }else{
                    Flowview.find({})
                        .exec(function (err,flowviews) {
                            if(!flowviews){
                                res.send(200,{error:'未找到flowviews'})
                            }else {
                                var _tempFlowArr = [];
                                var _tempFlowviewArr = [];
                                for(var i = 0 ; i < flows.length;i++){
                                    // 没有这个字段的，是主流程，子流程有mainflowid这个字段
                                    if(!flows[i].mainflowid || flows[i].mainflowid == ""){
                                        _tempFlowArr.push(flows[i])
                                    }
                                }
                                for(var j = 0 ; j < flowviews.length;j++){
                                    // 没有这个字段的，是主流程，子流程有mainflowid这个字段
                                    if(!flowviews[j].mainflowid){
                                        _tempFlowviewArr.push(flowviews[j])
                                    }
                                }
                                res.send(200,{flows:_tempFlowArr,flowviews:_tempFlowviewArr})
                            }
                        })
                }
            })
    },

    updateflow: function (req, res) {
        //更新的时候，将页面数据存到flowview中，将流程元素存到flow中。
        //flows保存的是流程节点之间的连线
        //nodes保存的是流程的节点
        var id = req.param('flowid');
        var nodes = req.param('nodes');
        var flows = req.param('flows');
        var flowview = req.param('flowview');

        // todo: 这里需要做个判断，某些情况下，这里flowview是是个对象，需要转为数组
        // 判断flowview.flowList的格式，如果不是数组格式，需要转为数组格式
        if(!Array.isArray(flowview.flowList)){
            var tempFlowArr = [];
            for(var flowKey in flowview.flowList){
                tempFlowArr.push(flowview.flowList[flowKey])
            }
            flowview.flowList = tempFlowArr;
        }

        // 判断flowview.nodeList的格式，如果不是数组格式，需要转为数组格式
        if(!Array.isArray(flowview.nodeList)){
            var tempNodeArr = [];
            for(var nodeKey in flowview.nodeList){
                tempNodeArr.push(flowview.nodeList[nodeKey])
            }
            flowview.nodeList = tempNodeArr;
        }

        //判断
        if(!Array.isArray(nodes)){
            var tempNodeAr = [];
            for(var nodeskey in nodes){
                tempNodeAr.push(nodes[nodeskey])
            }
          nodes = tempNodeAr
        }

        if(!Array.isArray(flows)){
            var tempFlowAr = [];
            for(var tempFlowAr in flows){
                tempFlowAr.push(flows[tempFlowAr])
            }
            flows = tempFlowAr
        }

        Flow.update(
            { id:id },
            {
                nodes:nodes,
                flows:flows
            }
        ).exec(function (err,flow) {
            if(!flow){
                res.send(200,{error:'保存flow失败'})
            }else{
                Flowview.update(
                    {id:id},
                    {flowui:flowview}
                ).exec(function (err,flowview) {
                    if(!flowview){
                        res.send(200,{error:'保存flowview失败'})
                    }else{
                        res.send(200,{id:flowview[0].id})
                    }
                })
            }
        })
    },

    // 修改流程名称及描述
    reeditflownameanddesc:function (req,res) {
        var flowid = req.param("flowid");
        var name = req.param("name");
        var desc = req.param("desc");
        Flow.update(
            {id:flowid},
            {
                name:name,
                desc:desc
            }
        ).exec(function (err,upflow) {
            if(!upflow){
                res.send(200,{error:'修改失败'})
            }else{
                res.send(200,{id:upflow[0].id})
            }
        })
    },


  // 子流程使用这个，主流程都走update
    createorupdateflow:function (req,res) {
        var flowid = req.param("flowid");//子流程的id
        var flowname = req.param("name");
        var flowdesc = req.param("desc");
        var flowview = req.param("flowview");
        var nodes = req.param("nodes");
        var flows = req.param("flows");
        var mainflowid = req.param("mainflowid");//主流程的id

        Flow.findOne({
            id: flowid
        }).exec(function (err, flow) {
            if (!flow) {
                //创建
                Flow.create({
                    name: flowname,
                    desc: flowdesc,
                    nodes: nodes,
                    flows: flows,
                    mainflowid: mainflowid
                }).exec(function (err, flow) {
                    if (!flow) {
                        res.send(200, {error: '保存flow失败'})
                    } else {
                        Flowview.create({
                            id: flow.id,
                            flowui: flowview,
                            mainflowid: mainflowid
                        }).exec(function (err, flowview) {
                            if (!flowview) {
                                res.send(200, {error: '保存flowview失败'})
                            } else {
                                createflowmodel(flow.id);
                                res.send(200, {id: flow.id})
                            }
                        })
                    }
                })
            } else {
                //更新时候，不更新name和desc
                Flow.update(
                    {id: flowid},
                    {
                        nodes: nodes,
                        flows: flows
                    }
                ).exec(function (err, flow) {
                    if (!flow) {
                        res.send(200, {error: "保存flow失败"})
                    } else {
                        Flowview.update(
                            {id: flowid},
                            {flowui: flowview}
                        ).exec(function (err, flowview) {
                            if (!flowview) {
                                res.send(200, {error: '保存flowview失败'})
                            } else {
                                res.send(200, {id: flowview[0].id})
                            }
                        })
                    }
                })
            }
        })
    },

    deleteflow: function (req, res) {
        //删除的时候，不是删除整个flow，而是加一个“不用”的标记，模拟放到垃圾箱的操作。
    },



  	setdefaultpage:function(req,res){
	    var flowid = req.param("flowid");
	    var nodeid = req.param("nodeid");
	    var page = req.param("page");
	    Flow.findOne({
	        id:flowid
	    }).exec(function (err,flow) {
	        if(!flow){
	            res.send(200,{error:"未找到flow"})
	        }else{
	            //TODO，这个代码有明显的逻辑错误，在回调型的调用里，不要用break.
	            var _nodes = flow.nodes;
	            for(var i = 0;i < _nodes.length; i++){
	                if(_nodes[i].nodeid == nodeid){
                      _nodes[i].page=page;
	                }
	            }
	            Flowview.findOne({
	                id:flowid
              }).exec(function (err,flowview) {
                  if(!flowview){
                      res.send(200,{error:"未找到flowview"})
                  }else{
                      var _flowui =  flowview.flowui;
                      var _nodeList =  _flowui.nodeList;
                      for(var i = 0 ; i < _nodeList.length;i++){
                          if(_nodeList[i].nodeid == nodeid){
                             _nodeList[i].page = page;
                          }
                      }
                      Flow.update({
                          id:flowid
                      },{
                          nodes:_nodes
                      }).exec(function (err,flowSave) {
                          if(!flowSave){
                              res.send(200,{error:"保存页面错误"})
                          }else{
                            Flowview.update({
                              id:flowid
                            },{
                                flowui:_flowui
                            }).exec(function (err,flowviewSave) {
                                if(!flowviewSave){
                                  res.send(200,{error:"保存页面错误"})
                                }else{
                                  res.send(200,{flowSave:flowSave})
                                }
                            })
                          }
                      })
                  }
              })

	        }
	    })
	},

	getdefaultpage:function(req,res){
		  var flowid = req.param("flowid");
	    var nodeid = req.param("nodeid");
	    Flow.findOne({
	    	  id:flowid
	    }).exec(function(err,flow){
          if(err){
            res.send(500,{error:'网络错误'});
          }else if(!flow){
            res.send(200,{error:"无页面"})
          }else　if(flow){
              for(var i=0;i<flow.nodes.length;i++){
                  if(flow.nodes[i].nodeid == nodeid && flow.nodes[i].page){
                      res.send(200,{page:flow.nodes[i].page});
                  }
              }
          }
	    })
	}
};


function createflowmodel(flowid){
    filelocation = process.cwd() + '/template/apitemplete/modeltemplete.js' ;

    var fs = require("fs");
    var modelfile = fs.readFileSync(filelocation, 'utf8');
    modelfile = modelfile.replace("tableName: 'data-needtobereplace'", "tableName: 'data-"+flowid+"'")

    var path = require('path');
    var pathstr = path.resolve(path.resolve(process.cwd(), '../../'),"services//framework//api//models//" + 'n'+ flowid +'.js');
    fs.writeFileSync(pathstr, modelfile);
}


function getmainflowname(id,flows) {
    for(var i = 0 ; i < flows.length;i++){
        if(flows[i].id == id){
            return flows[i].name;
        }
    }
}
