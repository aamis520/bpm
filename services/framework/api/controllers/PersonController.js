/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req, res) {
		var personName = req.param("personName");
		var loginName = req.param("loginName");
		var userStatus = req.param("userStatus");
		var sex = req.param("sex");
		var avatarUrl = req.param("avatarUrl");
		var personBirthday = req.param("personBirthday");
		var departmentId = req.param("departmentId");
		var departmentName = req.param("departmentName");
		var positionId = req.param("positionId");
		var officePhone = req.param("officePhone");
		var telPhone = req.param("telPhone");
		var email = req.param("email");
		var personType = req.param("personType");
		var personStatus = req.param("personStatus");
		var workPlace = req.param('workPlace');
		var inductionTime = req.param("inductionTime");
		var personDesc = req.param("personDesc");
		Users.findOne({
			loginName: loginName
		}).exec(function(err, usr) {
			if(err) {
				res.send(500, { error: "服务器发生异常" });
			} else {
				if(usr) {
					res.send(400, { error: "用户名已存在" });
				} else {
					Person.create({
						personName:personName,
						userStatus:userStatus,
            loginname:loginName,
						sex:sex,
						personBirthday:personBirthday,
						departmentId:departmentId,
						departmentName:departmentName,
						positionId:positionId,
						officePhone:officePhone,
						telPhone:telPhone,
						email:email,
						personType:personType,
						personStatus:personStatus,
						workPlace:workPlace,
						inductionTime:inductionTime,
						personDesc:personDesc
					}).exec(function(err,user){
						if(err){
							res.send(500,{err:"创建失败"})
						}else{
							Users.create({
								personId:user.id,
								loginname:loginName,
								password:'111111',
                realname:personName,
                avatarUrl:avatarUrl
							}).exec(function(err,success){
								if(err){
									res.send(200,"创建失败")
								}else{
									res.send(200,{success:'创建成功'})
								}
							})
						}
					})
				}
			}
		});

	},

  listonepersoninfo:function (req,res) {
    var pid = req.param('id');
    Person.findOne({
      id:pid
    }).exec(function (err,personinfo) {
        if(!personinfo){
          res.send(200,{error:'未找到person'})
        }else{
          Users.findOne({
            personId:pid
          }).exec(function (err,usrinfo) {
            if(err){
              res.send(200,{error:'未找到user'})
            }else{
              if(usrinfo){
                res.send(200,{usrinfo:usrinfo,personinfo:personinfo})
              }
            }
          })
        }
    })
  },

//	listall
	//TODO，不应该有showperson这样的名字存在。
		listperson:function(req,res){
			var userStatus = req.param("userStatus");
    	Person.find({
    		userStatus:userStatus
    	}).exec(function(err,person){
    		if(!person){
    			res.send(200,{error:"没有找到相关的person"})
    		}else{
    		  Users.find({

          }).exec(function (err,usrs) {
              if(!usrs){
                  res.send(200,{error:'没有找到相关的users'})
              }else{
                  for(var i = 0 ; i < person.length;i++){
                      var _id =  getloginIdByPersonId(person[i].id,usrs);
                      person[i].loginId = _id ? _id : '';
                  }
                  res.send(200,{person:person})
              }
          })
			  }
      })
	  },


//		listone
	updateperson:function(req,res){
    var personName = req.param("personName");
		var loginname = req.param("loginname");
		var userStatus = req.param("userStatus");
		var sex = req.param("sex");
		var avatarUrl = req.param("avatarUrl");
		var personBirthday = req.param("personBirthday");
		var departmentId = req.param("departmentId");
		var departmentName = req.param("departmentName");
		var positionId = req.param("positionId");
		var officePhone = req.param("officePhone");
		var telPhone = req.param("telPhone");
		var email = req.param("email");
		var personType = req.param("personType");
		var personStatus = req.param("personStatus");
		var workPlace = req.param('workPlace');
		var inductionTime = req.param("inductionTime");
		var personDesc = req.param("personDesc");
		var id = req.param('id');
		var pwd = req.param('pwd')
    	Person.findOne({
    		id:id
    	}).exec(function(err,person){
    		if(err){
    			res.send(500,{error:"net error"})
    		}else if(person){
    			Person.update(
    				{
              id:id
    				},
    				{
    					personName:personName,
    					loginname:loginname,
    					userStatus:userStatus,
    					sex:sex,
    					avatarUrl:avatarUrl,
    					personBirthday:personBirthday,
    					departmentId:departmentId,
						departmentName:departmentName,
    					positionId:positionId,
    					officePhone:officePhone,
    					telPhone:telPhone,
    					email:email,
    					personType:personType,
    					personStatus:personStatus,
    					workPlace:workPlace,
    					inductionTime:inductionTime,
    					personDesc:personDesc
    				}
				).exec(function(err,org){
		    		if(err){
		    			res.send(200,{error:"net error"})
		    		}else{
		    		  console.log(org)
						Users.update({
							personId:org[0].id
						},{
							loginname:loginname,
							realname:personName,
              password:pwd
						}).exec(function(err,user){
							if(err){
								res.send(200,{error:"net error"})
							} else {
								res.send(200,{org:"success"})
							}
						});
		    		}
		    	})
    		}
    	})
    },
    findperson:function(req,res) {    //查询是否有重复的登陆名
      var loginname = req.param('loginname');
      Users.find({
        loginname : loginname
      }).exec(function(err,data){
        if(data.length>0){
          res.send(200,{error:"repeat"});
        } else {
          res.send(200,{success:"noRepeat"});
        }
      });
    },

	 deleteperson: function(req, res) {
	 	var loginname = req.param('loginname');
		Person.findOne({//两个条件查询，避免删除之后，创建其他人员时，再用次登录名
			loginname:loginname,
			userStatus:"1"
		}).exec(function(err,finn){
			if(err){
				res.send(200, { error: "服务器发生异常" });
			}else if(finn){
				Person.update({
					loginname:loginname,
					userStatus:"1"
				},{
					loginname:loginname,
					userStatus:'0'
				})
				.exec(function(err,org){
					if(err){
						res.send(200, { error: "服务器发生异常" });
					}else{
						Users.destroy({
							loginname:loginname
						}).exec(function(err){
							if(err){
								res.send(200, { error: "服务器发生异常" });
							}else{
								res.send(200, { sucess: "true" });
							}
						});
					}
				})
			}
		})
	},

};
function getloginIdByPersonId(pid,users) {
    for(var i = 0 ; i < users.length;i++){
        if(users[i].personId == pid){
            return users[i].id
        }
    }
}
