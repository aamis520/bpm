module.exports = {
	listOne:function(req,res){
		var flowid = req.param('flowid');
        var pageid = req.param('pageid');
        Page.findOne({
        	flowid:flowid,
        	pageid:pageid,
        	isactive:true
        }).exec(function(err,page){
        	if(err){
        		res.send(err,{err:"网络错误"})
        	}else{
        		res.send(200,{page:page})
        	}
        })
	}
}