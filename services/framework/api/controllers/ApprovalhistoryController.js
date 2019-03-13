/**
 * Created by demo on 2017/7/20.
 */
module.exports = {
    // 列出一条数据的审批记录
    listcurnodehistories:function (req,res) {
        var flowid = req.param("flowid");
        var itemid = req.param("itemid");
        if(!itemid || !flowid){
          res.send(200,{error:'参数不够'})
        }else{
          gethistories(flowid,itemid)
            .then(getuserlogininfo)
            .then(buildinfos)
            .then(function (ret) {
              res.send(200,{histories:ret})
            })
        }

    },
    // 查看状态
    listallapprovalbyids:function (req,res) {
    	var flowid = req.param("flowid");
    	var itemids = req.param("ids")
    	Approvalhistory.find({
    		flowid:flowid,
    		itemid:itemids
    	}).exec(function(err,histoies){
    		res.send(200,{histories:histoies})
    	})
    },
    //列出已经审批的节点 和 下一节点
    listapprovalnodeandnextnode:function(req,res){
//  	var itemidsandnodeids = [{flowid: "59b8f542a0f5664825bec2ed", nodeid: "tijiaoshuju1", itemid: "59b9f5aa0ae76bf41bb0b644"}]
    	var itemidsandnodeids = req.param("itemidsandnodeids")
		//先从审批记录里面查询
		var itemids=[]
		var flowid = ""
		var len = 0
		if(itemidsandnodeids){
			flowid = itemidsandnodeids[0].flowid
			len = itemidsandnodeids.length

			for(var i=0;i<len;i++){
				itemidsandnodeids[i].nodes = []
				itemids.push(itemidsandnodeids[i].itemid)
			}
			Approvalhistory.find({
	    		flowid:flowid,
	    		itemid:itemids
	    	}).exec(function(err,histories){
	    		if(err){
					res.send(200,{error:err})
				}else{
		    		if(histories.length>0){
		    			for(j=0;j<histories.length;j++){
		    				for(var k=0;k<len;k++){
		    					if(histories[j].itemid == itemidsandnodeids[k].itemid){
		    						itemidsandnodeids[k].nodes.push(histories[j].nodeid)
		    					}
		    				}
		    			}
		    		}
		    		var flowdb = eval("n" + flowid);
					flowdb.find({
						id: itemids
					}).exec(function(err, nexts) {
						if(nexts.length>0) {
							for(m=0;m<nexts.length;m++){
			    				for(var n=0;n<len;n++){
			    					if(nexts[m].id == itemidsandnodeids[n].itemid){
			    						itemidsandnodeids[n].nodes.push(nexts[m].nextnodeid)
			    					}
			    				}
			    			}

							res.send(200, {
								nodes: itemidsandnodeids
							})
						}
						if(err){
							res.send(200,{error:err})
						}
					})
				}
	    	})
    	}else{
    		res.send(200,{org:"没有查询条件"})
    	}
    }
};

// 取历史信息
function gethistories(flowid,itemid){
    return new Promise(function (resolve,reject) {
        Approvalhistory.find({
            where:{
              flowid:flowid,
              itemid:itemid
            },
            sort:'updatedAt DESC'
        }).exec(function (err,histories) {
            if(!histories){
                reject("未找到histories");
            }else{
                var data = {};
                data.histories = histories;
                resolve(data)
            }
        })
    })
}

function getuserlogininfo(data) {
    return new Promise(function (resolve,reject) {
        Users.find({

        }).exec(function (err,users) {
            if(!users){
                reject("未找到users");
            }else{
                data.users = users;
                resolve(data);
            }
        })
    })
}

function buildinfos(data) {
    return new Promise(function (resolve,reject) {
        var _histories = data.histories;
        var _users = data.users;
        var _retarr = [];
        for(var i = 0 ; i < _histories.length;i++){
            var tempObj=  {};
            tempObj.username = getusernamebyid(_histories[i].shenpiuserid,data);
            tempObj.shenpistatus = formatshenpistatus(_histories[i].shenpistatus);
            tempObj.shenpicomments = _histories[i].shenpicomments;
            tempObj.time = formatTime(_histories[i].updatedAt,'yyyy-MM-dd hh:mm');
            _retarr.push(tempObj);
        }
        resolve(_retarr);
    })
}

function getusernamebyid(usrid,data){
    if(usrid == "0"){
        return "智能审批";
    }
    // 只有新提交的数据，审批人员为"";
    if(usrid == ""){
        return "我自己";
    }
    var _users = data.users;
    for(var i = 0 ; i < _users.length;i++){
        if(_users[i].id == usrid){
            if(_users[i].realname){
                return _users[i].realname
            }else{
                return _users[i].loginname;
            }
        }
    }
}

function formatshenpistatus(value){
    if(value == "deny"){
        return "审批被拒绝";
    }else if(value == "approve"){
        return "审批中";
    }else if(value == "submit"){
        return "已提交";
    }else if(value == "finished"){
      return "已通过";
    }else{
        return "";
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
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}