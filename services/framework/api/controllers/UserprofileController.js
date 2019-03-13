/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

//TODO， person里存了很多，为什么还有这样一个类。
module.exports = {
    create:function(req,res){
    	var apartname = req.param('apartname');
    	var apartdesc = req.param('apartdesc');
    	var apartcode = req.param('apartcode');
    	var apartsuperior = req.param('apartsuperior');
    	Userprofile.findOne({
    		apartname:apartname
    	}).exec(function(err,apart){
    		if(err){
    			console.log(2)
    			res.send(500,{error:"net error"})
    		}else if(apart){
    			console.log(3)
    			
    			res.send(200,{apart:"名字已存在"})
    		}else{
    			console.log(4)
    			
    			Userprofile.create({
    				apartname:apartname,
    				apartdesc:apartdesc,
    				apartcode:apartcode,
    				apartsuperior:apartsuperior
    			}).exec(function(err,org){
    				if(err){
    			console.log(5)
    					
    					res.send(200,{error:"未知错误"})
    				}else{
    			console.log(6)
    					
    					res.send(200,{org:org})
    				}
    			})
    		}
    	})
    },
    getall:function(req,res){
    	Userprofile.find({
    		
    	}).exec(function(err,apart){
    		if(err){
    			console.log(2)
    			res.send(500,{error:"net error"})
    		}else if(apart){
    			console.log(3)
    			res.send(200,{apart:apart})
    		}
    	})
    },
    update:function(req,res){
    	var apartname = "运营";
    	Userprofile.findOne({
    		id:'593114031d0856f402ec718d'
    	}).exec(function(err,apart){
    		if(err){
    			res.send(500,{error:"net error"})
    		}else if(apart){
    			Userprofile.update(
    				{
    					id:'593114031d0856f402ec718d'
    				},
    				{
    					id:'593114031d0856f402ec718d',
    					apartname:apartname
    					
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
    }
};

