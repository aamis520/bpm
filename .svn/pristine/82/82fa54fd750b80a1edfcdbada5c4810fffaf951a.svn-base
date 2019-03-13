//TODO，要注意我们的注释也是代码的一部分，如果写，就要求是对的和有用的。
/**
 * PageController
 *
 * @description :: Server-side logic for managing Page
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 * @param:flowid
 * @param:nodeid
 * @param:tempid
 * @param:filename
 * @param:pagename
 * @param:pageid
 * @param:pagecontent
 * @boolen:isactive
 */

module.exports = {
	getall:	function (req, res) {
        //如果参数中包括了flowid和nodeid，就是列出对应的数据，否则，就是列出所有的。
        Page.find({
        	isactive:true
        }).exec(function(err,pages){
        	if(err){
        		res.send(err,{err:"网络错误"})
        	}else{
        		res.send(200,{pages:pages})
        	}
        })
    },

    getpages: function (req, res) {
        //如果参数中包括了flowid和nodeid，就是列出对应的数据，否则，就是列出所有的。
        var flowid = req.param('flowid');
        var nodeid = req.param('nodeid');
        Page.find({
        	flowid:flowid,
        	nodeid:nodeid,
        	isactive:true
        }).exec(function(err,finn){
        	if(err){
        		res.send(err,{err:"网络错误"})
        	}else{
        		res.send(200,{finn:finn})
        	}
        })
    },
    
    getone: function (req, res) {
        //如果参数中包括了flowid和nodeid，就是列出对应的数据，否则，就是列出所有的。
        var pageid = req.param('pageid');
        Page.findOne({
        	pageid:pageid
        }).exec(function(err,page){
        	if(err){
        		res.send(err,{err:"网络错误"})
        	}else{
        		res.send(200,{page:page})
        	}
        })
    },

	//TODO,未来复杂的逻辑使用promise来调用，可读性强。
    createpage: function (req, res) {
    	var flowid = req.param('flowid');
    	var nodeid = req.param('nodeid');
    	var tempid = req.param('tempid');
    	var filename = req.param('filename');
    	var pagename = req.param('pagename');
    	Page.findOne({
    		flowid:flowid,
    		nodeid:flowid,
    		filename:filename,
    	}).exec(function(err,page){
    		if(err){
    			res.send(500,{error:'网络错误'});
    		}else if(page){
    			res.send(200,{error:'创建错误'});
    		}else if(!page){
    			//获取模板UI存储到Pageview中
    			Template.findOne({
    				id:tempid
    			}).exec(function(err,templete){
    				if(err){
    					res.send(500,{error:'网络错误'});
    				}else if(templete){
		                Page.create({
		                	flowid:flowid,
		                	nodeid:nodeid,
		                	tempid:tempid,
		                	filename:filename,
		                	pagename:pagename,
		                	isactive:true
		                }).exec(function(err,created){
		                	if(err){
		                		res.send(500,{error:"网络错误"});
		                	}else{
                				Page.update(
                					{
                						flowid:flowid,
					                	nodeid:nodeid,
					                	tempid:tempid,
					                	filename:filename,
					                	pagename:pagename,
                					},
                					{
                						pageid:created.id,
                						flowid:flowid,
					                	nodeid:nodeid,
					                	tempid:tempid,
					                	filename:filename,
					                	pagename:pagename
                					}
            					).exec(function(err,page){
            						if(err){
            							res.send(200,{error:"lost"})
            						}else{
            							res.send(200,{page:page})
            						}
            					})
                			}
		                })
    				}
    			})
    		}
    	})
    },

    updatepage: function (req, res) {
        var flowid = req.param('flowid');
    	var nodeid = req.param('nodeid');
        var pageid = req.param('pageid');
        var dropindexsstr = req.param('dropindexsstr');
        var pageui = req.param('pageui');
        var selectwords = req.param('selectwords');
        var tabsstr = req.param('tabsstr');
        var inputsetting = req.param("inputsetting")
        var items = req.param('items');
        var dropinputindexsstr = req.param("dropinputindexsstr")
        var inputsui = req.param("inputsui")
        var isshowchilddata = req.param("isshowchilddata")
        Page.findOne({
        	flowid:flowid,
        	nodeid:nodeid,
        	pageid:pageid
        }).exec(function(err,page){
        	if(err){
        		res.send(500,{error:'网络错误'});
        	}else if(!page){
        		res.send(200,{error:"你要更新的页面不存在"})
        	}else{
        		Page.update(
        			{
        				flowid:flowid,
		        		nodeid:nodeid,
		        		pageid:pageid
        			},
        			{
        				flowid:flowid,
		        		nodeid:nodeid,
		        		pageid:pageid,
		        		pageui:pageui,
		        		inputsetting:inputsetting,
		        		dropindexsstr:dropindexsstr,
		        		tabsstr:tabsstr,
		        		isshowchilddata:isshowchilddata,
		        		selectwords:selectwords,
		        		inputsui:inputsui,
		        		dropinputindexsstr:dropinputindexsstr,
		        		items:items
        			}
        		).exec(function(err,org){
        			if(err){
        				res.send(200,{error:'更新失败'});
        			}else{
                		res.send(200,{org:'success'});
        			}
        		})
        	}
        })
    },

    deletepage: function (req, res) {
        var pageid = req.param('pageid');
        Page.destroy(
        		{
        			pageid:pageid,
        		}
        ).exec(function(err,org){
        	if(err){
        		res.send(500,{error:"网络错误"})
        	}else if(!org){
        		res.send(200,{success:"请查看你的页面是否存在"})
        	}else{
				res.send(200,{success:"success"});
        	}
        })
    },
};
