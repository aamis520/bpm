/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//add
    adddepartment:function(req,res){
    	var departmentName = req.param('departmentName');
    	var departmentCode = req.param('departmentCode');
    	var ownerId = req.param('ownerId');
      var departmentDesc = req.param('departmentDesc');
      var parentId = req.param('parentId');
			Department.create({
				//TODO, 参数与存储最好相符合。
	    		departmentName:departmentName,
	    		departmentCode:departmentCode,
	    		ownerId:ownerId,
	    		departmentDesc:departmentDesc,
	    		parentId:parentId,
			}).exec(function(err,department){
				//TODO, org这样的返回值需要与上面名称一致。
	    		if(err){
	    			//TODO，不要打印这样的log
	    				res.send(200,{error:"未知错误"})
          }else{
              Messagegroup.create({
                  identify:department.id,
                  title:departmentName + "消息组",
                  desc:departmentName + "消息组",
                  icon:""
              }).exec(function (err,messagegroup) {
                  if(!messagegroup){
                      res.send(200,{error:"messagegroup创建失败"})
                  }else{
                      res.send(200,{department:department})
                  }
              })
	    		}
			})
    },
	//	listall
	listdepartment:function(req,res){

		  var departmentName = req.param('departmentName');
    	var departmentCode = req.param('departmentCode');
    	var ownerId = req.param('ownerId');
		  var departmentDesc = req.param('departmentDesc');
		  var parentId = req.param('parentId');
    	Department.find({

    	}).exec(function(err,department){

    		if(!department){

    			res.send(200,{error:"没有找到相关的department"})
    		}else{


				res.send(200,{department:department});

    		}
  		 })
	},







    updatedepartment:function(req,res){
    	var departmentName = req.param('departmentName');
    	var departmentCode = req.param('departmentCode');
      var departmentDesc = req.param('departmentDesc');
      var parentId = req.param('parentId');
      var id = req.param('id');
      var ownerId = req.param('ownerId');

		console.log(id);
    	Department.findOne({
    		id:id
    	}).exec(function(err,apart){
    		if(err){

    			res.send(500,{error:"net error"})
    		}else if(apart){

    			Department.update(
    				{
    					id:id
    				},
    				{
    					id:id,
    					departmentName:departmentName,
    					departmentCode:departmentCode,
    					departmentDesc:departmentDesc,
    					parentId:parentId,
    					ownerId:ownerId,

    				}
				).exec(function(err,org){
		    		if(err){

		    			res.send(200,{error:"net error"})
		    		}else{

		    			res.send(200,{org:"success"})
		    		}
		    	})
    		}
    	})
    },





    deletedepartment:function(req,res){
    	var departmentId = req.param('departmentId');
    	Person.find({
    		departmentId:departmentId
    	}).exec(function(err,finn){

    		if(err){
    			res.send(500,{error:'内部错误'})
    		}else{
	    		if(finn && finn.length > 0){
	    			res.send(200,{isDestoryed:0})
	    		}else{
	    			Department.destroy({
	    				id:departmentId
	    			})
	    			.exec(function(err,department){

	    				if(!department){
	    					res.send(200,{error:err});
	    				}else{
	    					res.send(200,{isDestoryed:1});
	    				}
	    			})
	    		}
    		}


      })

    }
};

