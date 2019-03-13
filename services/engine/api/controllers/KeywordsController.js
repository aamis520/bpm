/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	//提交表单下拉框可以选择所有simplekeyword
	getallsks:function (req, res) {
        //simple key words, 可以用在列表，显示详情等地方。
        Simplekeywords.find({
        }).exec(function (err, sks){
            if(err){
                res.send(200,{error:"未知错误"})
            }else{
                res.send(200,{sks:sks});
            }
        });
    },

    getsks: function (req, res) {
        //simple key words, 可以用在列表，显示详情等地方。
        var flowid = req.param("flowid");
        var customerid = req.param("usrid");
        Simplekeywords.find({
            flowid:flowid
        }).exec(function (err, sks){
            if(err){
                res.send(200,{error:"未知错误"})
            }else{
                res.send(200,{simplekeywords:sks});
            }
        });
    },

    updatesk: function (req, res) {
        var flowid = req.param("flowid");
        var name = req.param("skname");
        var key = req.param("skkey");

        Simplekeywords.findOne({
            key:key
        }).exec(function (err, sk){
            if(!sk){
                Simplekeywords.create(
                    {
                        flowid:flowid,
                        name:name,
                        key:key
                    }
                ).exec(function (err,org){
                    if(err){
                        res.send(200,{error:"未知错误"})
                    }else{
                    	res.send(200,{id:sk.id});
                    }
                })

            }else{
                Simplekeywords.update(
                    {
                        key:key
                    },
                    {
                        flowid:flowid,
                        name:name,
                        key:key
                    }
                ).exec(function(err,sk){
                    if(err){
                        res.send(200,{error:"未知错误"})
                    }else{
                        res.send(200,{id:sk.id});
                    }
                })
            }
        });
    },

    //列出所有的sks
    listsks:function (req,res) {
        Simplekeywords.find({

        }).exec(function (err,sks) {
            if(!sks){
                res.send(200,{error:'未找到sks'})
            }else{
                res.send(200,{sks:sks})
            }
        })
    },

    // 获取一个ck
    getck: function (req, res) {
        var id = req.param('ckid');
        Complexkeywords.findOne({
            id:id
        }).exec(function (err,ck) {
            if(!ck){
                res.send(200,{error:'未找到ck'})
            }else{
                res.send(200,{ck:ck})
            }
        })
    },

    //更新ck,有就更新，没有就创建
    updateck: function (req, res) {
        var id = req.param('ckid');
        var name = req.param('name');
        var desc = req.param('desc');
        var operations = req.param('operations');
        Complexkeywords.findOne({
            id:id
        }).exec(function (err,ck) {
            if(!ck){
                Complexkeywords.create({
                    name:name,
                    desc:desc,
                    operations:operations
                }).exec(function (err,createck) {
                    if(!createck){
                        res.send(200,{error:'创建ck失败'})
                    }else{
                        res.send(200,{id:createck.id})
                    }
                })
            }else{
                Complexkeywords.update(
                    {id:id},
                    {
                        name:name,
                        desc:desc,
                        operations:operations
                    }
                ).exec(function (err,updateck) {
                      if(!updateck){
                          res.send(200,{error:'更新ck失败'})
                      }else{
                          res.send(200,{id:updateck[0].id})
                      }
                })
            }
        })
    },

    //列出所有的ck
    listcks:function (req,res) {
        Complexkeywords.find({

        }).exec(function (err,cks) {
            if(!cks){
                res.send(200,{error:'获取所有的ck失败'})
            }else{
                res.send(200,{cks:cks})
            }
        })
    },
    deletepagesks: function (req, res) {
        var pageid = req.param('pageid');
        Simplekeywords.destroy({
            pageid:pageid
        }).exec(function (err,org) {
            if(err){
        		res.send(500,{error:"网络错误"})
        	}else if(!org){
        		res.send(200,{success:"请查看你的页面是否存在"})
        	}else{
				res.send(200,{success:"success"});
        	}
        });
    }
};
