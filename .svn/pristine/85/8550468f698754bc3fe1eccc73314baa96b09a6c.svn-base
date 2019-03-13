/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//TODO，不应该有这样的存在。
module.exports = {
//  adddepartment:function(req,res){
//  	var departmentName = req.param('departmentName');
//  	var departmentCode = req.param('departmentCode');
//  	var departmentSuperior = req.param('departmentSuperior');
//  	var departmentDirector = req.param('departmentDirector');
//		var departmentDesc = req.param('departmentDesc')
//  	AddDepartment.findOne({
//  		departmentName:departmentName
//  	}).exec(function(err,department){
//  		if(err){
//  			console.log(1)
//  			res.send(500,{error:"net error"})
//  		}else if(department){
//  			console.log(2)
//  			
//  			res.send(200,{department:"名字已存在"})
//  		}else{
//  			console.log(3)
//  			
//  			AddDepartment.create({
//  				departmentName:departmentName,
//  				departmentCode:departmentCode,
//  				departmentSuperior:departmentSuperior,
//  				departmentDirector:departmentDirector,
//  				departmentDesc:departmentDesc
//  			}).exec(function(err,org){
//  				if(err){
//  			console.log(4)
//  					
//  					res.send(200,{error:"未知错误"})
//  				}else{
//  			console.log(5)
//  					
//  					res.send(200,{org:org})
//  				}
//  			})
//  		}
//  	})
//  },
	
	
    showdepartment:function(req,res){
    	AddDepartment.find({
    		
    	}).exec(function(err,department){
    		if(!department){
    			res.send(200,{error:"没有找到相关的department"})
    		}else{
    			var temp = [];
				for(var i = 0;i < 100;i++){
					if(department[i].parentId == ''){
						temp[i] = department[i];
						var tem = department[i].id;
					}
				}
				
				
				
				res.send(200,{department:department})
				}
				
    			
    		}
    	)}

//  update:function(req,res){
//  	var apartname = "运营";
//  	Userprofile.findOne({
//  		id:'593114031d0856f402ec718d'
//  	}).exec(function(err,apart){
//  		if(err){
//  			res.send(500,{error:"net error"})
//  		}else if(apart){
//  			Userprofile.update(
//  				{
//  					id:'593114031d0856f402ec718d'
//  				},
//  				{
//  					id:'593114031d0856f402ec718d',
//  					apartname:apartname
//  					
//  				}
//				).exec(function(err,org){
//		    		if(err){
//		    			res.send(200,{error:"net error"})
//		    		}else{
//		    			res.send(200,{org:"success"})
//		    		}
//		    	})
//  		}
//  	})
//  }
};

