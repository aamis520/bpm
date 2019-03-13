/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//add
    addjobposition:function(req,res){
    	//TODO，参数不要过长，已经有action名的情况下，参数里可以不显示action名了。
    	var jobpositionName = req.param('jobpositionName');
    	var jobpositiontCode = req.param('jobpositionCode');
		var jobpositionDesc = req.param('jobpositionDesc');
		var jobpositionType = req.param('jobpositionType');		
			Jobposition.create({
	    		jobpositionName:jobpositionName,
	    		jobpositionCode:jobpositiontCode,
	    		jobpositionDesc:jobpositionDesc,
	    		jobpositionType:jobpositionType,
			}).exec(function(err,org){
	    		if(err){
	    			
	    				res.send(200,{error:"未知错误"})
	    			}else{
							res.send(200,{org:org})
	    				}
	    
			})
	    },			
	//	listall
	listjobposition:function(req,res){
    	Jobposition.find({
    		
    	}).exec(function(err,jobposition){
    			
    		if(!jobposition){
    			
    			res.send(200,{error:"没有找到相关的jobposition"})
    		}else{				
				res.send(200,{jobposition:jobposition})
			}

    		}
  		 )},
  		 
  	//listone
	 updatejobposition:function(req,res){
    	var jobpositionName = req.param('jobpositionName');
    	var jobpositionCode = req.param('jobpositionCode');
		var jobpositionDesc = req.param('jobpositionDesc');
		var jobpositionType = req.param('jobpositionType');
		var id = req.param('id');
		
    	Jobposition.findOne({
    		id:id
    	}).exec(function(err,jobposition){
    		if(err){
    			
    			res.send(500,{error:"net error"})
    		}else if(jobposition){
    			
    			Jobposition.update(
    				{
    					id:id
    				},
    				{
    					id:id,
    					jobpositionName:jobpositionName,
    					jobpositionCode:jobpositionCode,
    					jobpositionDesc:jobpositionDesc,
    					jobpositionType:jobpositionType,
    					
    					
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
    
    
    deletejobposition:function(req,res){
    	var positionId = req.param('positionId');
    	Person.find({
    		positionId:positionId
    	}).exec(function(err,finn){

    		if(err){
    			res.send(500,{error:'内部错误'})
    		}else{
	    		if(finn && finn.length > 0){
	    			res.send(200,{isDestoryed:0})
	    		}else{
	    			Jobposition.destroy({
	    				id:positionId
	    			})
	    			.exec(function(err,jobposition){

	    				if(!jobposition){
	    					res.send(200,{error:err});
	    				}else{
	    					res.send(200,{isDestoryed:1});
	    				}
	    			})
	    		}
    		}
    			
    			
    		})
    	
    },
 		

};

