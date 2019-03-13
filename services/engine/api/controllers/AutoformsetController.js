

module.exports = {
	create:function (req, res) {
		var pageid = req.param("pageid")
		var autoformsetdatas = req.param("autoformsetdatas")
		Autoformset.findOne({
			pageid:pageid
		}).exec(function(err,autoformset){
			if(err){
				res.send(500,{error:"网络错误"})
			}else if(autoformset){
				console.log(autoformset)
				Autoformset.update(
					{pageid,pageid},
					{
						pageid:pageid,
						autoformsetdatas:autoformsetdatas
					}
				).exec(function(err,org){
					if(err){
						res.send(200,{error:err})
					}else{
						res.send(200,{id:autoformset.id})
					}
				})
			}else if(!autoformset){
				Autoformset.create(
					{
						pageid:pageid,
						autoformsetdatas:autoformsetdatas
					}
				).exec(function(err,newautoformset){
					if(err){
						res.send(200,{error:err})
					}else{
						res.send(200,{id:newautoformset.id})
					}
				})
			}
		})
	},
	get:function (req, res) {
		var pageid = req.param("pageid")
		Autoformset.findOne({
			pageid:pageid
		}).exec(function(err,autoformset){
			if(err){
				res.send(500,{error:"网络错误"})
			}else if(autoformset){
				res.send(200,{autoformset:autoformset})
			}else{
				res.send(200,{error:"此页面无智能提交设置"})
			}
		})
	},
	delete:function (req, res) {
		var id = req.param("id")
		Autoformset.destory({
			id:id
		}).exec(function(err,org){
			if(err){
				res.send(500,{error:"网络错误"})
			}else{
				res.send(200,{id:id})
			}
		})
	}
	
}