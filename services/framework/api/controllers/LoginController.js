/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";

module.exports = {
	login: function(req, res) {
		var loginname = req.param("loginname");
		var password = req.param("password");
		var openid = req.param("openid");
		var ismobile = true;
		if(ismobile) {
			Users.findOne({
				loginname: loginname,
				password: password
			}).exec(function(err, user) {
				if(!user) {
					//如果是小程序，第一次会上传账号、密码、openid，第二次只传账号和openid
					if(openid){
						Users.findOne({
							loginname : loginname,
							openid :openid
						}).exec(function(err,user){
							if(user){
								res.send(200, {
									usrid: user.id
								});
							} else{
								res.send(401,{error:"用户不存在或密码错误"});
							}
						});
					} else {
						res.send(200,{error:"没有匹配到"});
					}

				} else {
					//更新openid---
					//判断一下是否有openid
          if(openid){//如果没有openid，就不更新，避免pc登陆时把openid清空
            Users.update({
              loginname : loginname,
              password : password
            },{
              loginname : loginname,
              password : password,
              openid:openid
            }).exec(function(err,user){

            });
          }
					//登录成功，开始找菜单。
					this.Page.find().exec(function(err, pages) {
						Flow.find().exec(function(err, flows) {
			              Department.find().exec(function (err,departments) {
			                Person.findOne({
			                  id:user.personId
			                }).exec(function (err,persons) {
			                  var _isadmin = false;
			                  if(user.isadmin){
			                    _isadmin = true;
			                  }
			                  res.send(200, {
			                    usrid: user.id,
			                    usrname:user.realname,
			                    isadmin:user.isadmin,
			                    adminmenus:admingeneratemenuitem(flows,_isadmin),
			                    menus: generatemenuitem(user.id, flows, persons.departmentId, departments),
			                    pages: generateallpagesrouter(user.id, flows, pages)
			                  });
			                })
			              })
						});
					})
				}
			});
		} else {
			Users.findOne({
				loginname: loginname,
				password: password
			}).exec(function(err, user) {
				if(!user) {
					res.send(200, {
						error: "用户不存在或密码错误"
					});
				} else {
					Person.findOne({
						id: user.personId,
					}).exec(function(err, person) {
						if(err) {
							res.send(200, {
								err: '该人员未创建档案'
							})
						} else {
							Department.findOne({
								id: person.departmentId,
							}).exec(function(err, department) {
								if(err) {
									res.send(200, {
										err: "该人员没有添加部门"
									})
								} else {
									//登录成功，开始找菜单。
									this.Page.find().exec(function(err, pages) {
										Flow.find().exec(function(err, flows) {
                        var menus = generatemenuitem(user.id, flows,person.departmentId,department);
                        var applications = {}
                        applications.needtoshow = []
                        applications.moretoshow = []
                        if(menus.length >= 7) {
                          for(var i = 0; i <= 6; i++) {
                            if(menus[i].child.length > 1) {
                              var childs = []
                              for(var m = 0; m < menus[i].child.length; m++) {
                                childs.push({
                                  icon: '',
                                  name: menus[i].child[m].name,
                                  url: '/' + menus[i].id + '|' + menus[i].child[m].node + '|' + menus[i].child[m].page
                                })
                              }
                              applications.needtoshow.push({
                                name: menus[i].name,
                                icon: '',
                                childs: childs
                              })

                            } else if(menus[i].child.length == 1) {
                              applications.needtoshow.push({
                                name: menus[i].name,
                                icon: '',
                                url: '/' + menus[i].id + '|' + menus[i].child[0].node + '|' + menus[i].child[0].page
                              })
                            }
                          }
                          for(var i = 7; i < menus.length; i++) {
                            if(menus[i].child.length > 1) {
                              var childs = []
                              for(var m = 0; m < menus[i].child.length; m++) {
                                childs.push({
                                  icon: '',
                                  name: menus[i].child[m].name,
                                  url: '/' + menus[i].id + '|' + menus[i].child[m].node + '|' + menus[i].child[m].page
                                })
                              }
                              applications.moretoshow.push({
                                name: menus[i].name,
                                icon: '',
                                childs: childs
                              })

                            } else if(menus[i].child.length == 1) {
                              if(menus[i].child.length != 0) {
                                applications.moretoshow.push({
                                  name: menus[i].name,
                                  icon: '',
                                  url: '/' + menus[i].id + '|' + menus[i].child[0].node + '|' + menus[i].child[0].page
                                })
                              }
                            }
                          }
                        } else {
                          for(var i = 0; i < menus.length; i++) {
                            if(menus[i].child.length > 1) {
                              var childs = []
                              for(var m = 0; m < menus[i].child.length; m++) {
                                childs.push({
                                  icon: '',
                                  name: menus[i].child[m].name,
                                  url: '/' + menus[i].id + '|' + menus[i].child[m].node + '|' + menus[i].child[m].page
                                })
                              }
                              applications.needtoshow.push({
                                name: menus[i].name,
                                icon: '',
                                childs: childs
                              })

                            } else {
                              if(menus[i].child.length != 0) {
                                applications.moretoshow.push({
                                  name: menus[i].name,
                                  icon: '',
                                  url: '/' + menus[i].id + '|' + menus[i].child[0].node + '|' + menus[i].child[0].page
                                })
                              }
                            }
                          }
                        }
                        res.send(200, {
                          usrid: user.id,
                          username: person.personName,
                          companyname: department.departmentName,
                          avartar: '',
                          applications: applications,
                          menus: generatemenuitem(user.id, flows,person.departmentId,department),
                          pages: generateallpagesrouter(pages)
                        });
                      })
									})
								}
							})
						}
					})
				}
			});
		}
	},
  applogin:function(req,res){
		var loginname = req.param("loginname");
		var password = req.param("password");
		Users.findOne({
				loginname: loginname,
				password: password
		}).exec(function (err,user) {
				if(!user){
						res.send(200,{error:"没有匹配到"});
				} else {
					Uploadfile.findOne({ //查找公司名
							foldertype:"companyname"
					}).exec(function(err,result){
							var companyname = "";
							if(result.companyname){
									companyname = result.companyname;
							}
							console.log(companyname);
							res.send(200,{
									usrid:user.id,
									username:user.realname,
									companyname:result.companyname,
									avartar:"",
									applications:{}
							});
					});
				}
    });



	},
	//小程序登陆接口
	wechatlogin:function(req,res){
		var loginname = req.param('loginname');
		var password = req.param('password');
		var openid = req.param('openid');

    Person.find().exec(function (err,person) {
      res.send(200,{success:"success"})
    });
    //这些个数据都得到的话，在哪里查询



		/*var jscode = false
		if(jscode){
			finduserhasjscode(jscode,loginname,password)
				.then(getopenid)
				.then(saveopenid)
				.then(function(data){

					res.send(200,{})
				})
		}else{
			finduserhasopenid(openid,loginname,password)
				.then(writeopenindatabase)
				.then(function(userid){
					if(!userid){
						res.send(200,{error:'登陆失败'})
					}else{
						res.send(200,{userid:userid})
					}
				})
		}*/
	}


};
function writeopenindatabase(data){
	return new Promise(function(resolve,reject){
		var _openid = data.openid;
		var _userInfo = data.userInfo;
		var _id = data.userInfo.id;
		if(_userInfo.openid){
			resolve(_id);
		}else{
			Users.update(
				{
					id:_id
				},
				{
					openid:_openid
				}
			).exec(function(err,user){
				if(!user){
					reject('更新openid失败')
				}else{
					var userid = user[0].id;
					console.log(userid);
					resolve(userid)
				}
			})
		}
	})
}


function finduserhasopenid(openid,loginname,password){
	return new Promise(function(resolve,reject){
		Users.findOne({
				loginname:loginname,
				or:[
					{password:password},
					{openid:openid}
				]
		}).exec(function(err,userInfo){
			if(!userInfo){
				reject('未找到对应用户')
			}else{
				var data = {};
				data.userInfo = userInfo;
				data.openid = openid;
				resolve(data)
			}
		})
	})
}


function finduserhasjscode(jscode,username,password){
	return new Promise(function(resolve,reject){
		Users.findOne({
			username:username,
			password:password
		}).exec(function(err,user){
			if(!user){
				reject('user未找到')
			}else{
				var data = {};
				data.jscode = jscode;
				data.userInfo = user;
				resolve(data)
			}
		})
	})
}
//getoppenid
function getoppenid(data){
	return new Promise(function(resolve,reject){
		var _jscode = data.jscode;
		var _userInfo = data.userInfo;
	})
}

function saveopenid(data){
	return new Promise(function(resolve,reject){
		var _jscode = data.jscode;
		var _userInfo = data.userInfo;

	})

}

//普通用户找到的items
function generatemenuitem(usrid, flows, departmentid,departments) {
	var parentmenus = [];
	for(var i = 0; i < flows.length; i++) {
		var parenttemp = {};
		parenttemp.name = flows[i].name;
		parenttemp.id = flows[i].id;
    parenttemp.child = [];
		var childmenus = [];
		if(flows[i].nodes) {
      for (var j = 0; j < flows[i].nodes.length; j++) {
        var childtemp = {};
        childtemp.flowid = flows[i].id;
        childtemp.node = flows[i].nodes[j].nodeid;
        childtemp.name = flows[i].nodes[j].name;
        childtemp.page = flows[i].nodes[j].page;
        childtemp.isstay = 0;
        // 先判断是不是主流程
        if (!flows[i].mainflowid || flows.mainflowid == "") {
          if (typeof flows[i].nodes[j].usrid == "string") {
            if(flows[i].nodes[j].usrid == usrid){
              childtemp.isstay = 1;
            }else{
              childtemp.isstay = 0;
            }
          } else if (flows[i].nodes[j].usrid && flows[i].nodes[j].usrid.length > 0 && typeof flows[i].nodes[j].usrid == "object") {
            if (flows[i].nodes[j].usrid.indexOf(usrid) != -1) {
              childtemp.isstay = 1;
            }else{
              childtemp.isstay = 0;
            }
          } else if (flows[i].nodes[j].apartmentid && flows[i].nodes[j].apartmentid.length > 0 && typeof flows[i].nodes[j].apartmentid == "object") {
            var departmentidarr = getdepartments(departmentid, departments);
            // 这里是对节点下的部门数组和人员所在的部门数组进行合并，去重，比较去重之前和之后的长度，相等，没交集，不等，有交集
            var _dataApartmentidArr = flows[i].nodes[j].apartmentid;
            var newArr = departmentidarr.concat(_dataApartmentidArr);
            var newArrUnique = uniqueArr(newArr);
            // 长度不相等，则为数组有交集
            if (newArr.length != newArrUnique.length) {
              childtemp.isstay = 1;
            }else{
              childtemp.isstay = 0;
            }
          }
          if(childtemp.isstay == 1 && childtemp.flowid &&  childtemp.node && childtemp.name && childtemp.page){
            childmenus.push(childtemp);
            parenttemp.child = childmenus;
          }
        } else {
          // 这里的是子流程的
          if (typeof flows[i].nodes[j].usrid == "string") {
            if(flows[i].nodes[j].usrid == usrid){
              childtemp.isstay = 1;
            }else{
              childtemp.isstay = 0;
            }
          } else if (flows[i].nodes[j].usrid && flows[i].nodes[j].usrid.length > 0 && typeof flows[i].nodes[j].usrid == "object") {
            if (flows[i].nodes[j].usrid.indexOf(usrid) != -1) {
              childtemp.isstay = 1;
            }else{
              childtemp.isstay = 0;
            }
          } else if (flows[i].nodes[j].apartmentid && flows[i].nodes[j].apartmentid.length > 0 && typeof flows[i].nodes[j].apartmentid == "object") {
            var departmentidarr = getdepartments(departmentid, departments);
            // 这里是对节点下的部门数组和人员所在的部门数组进行合并，去重，比较去重之前和之后的长度，相等，没交集，不等，有交集
            var _dataApartmentidArr = flows[i].nodes[j].apartmentid;
            var newArr = departmentidarr.concat(_dataApartmentidArr);
            var newArrUnique = uniqueArr(newArr);
            // 长度不相等，则为数组有交集
            if (newArr.length != newArrUnique.length) {
              childtemp.isstay = 1;
            }else{
              childtemp.isstay = 0;
            }
          }
            for(var k = 0;k < parentmenus.length;k++){
            if(parentmenus[k].id == flows[i].mainflowid){
              if(!parentmenus[k].child){
                parentmenus[k].child = [];
              }
              if(childtemp.isstay == 1 && childtemp.flowid &&  childtemp.node && childtemp.name && childtemp.page){
                parentmenus[k].child.push(childtemp)
              }
            }
          }
        }
      }
    }
    // 流程的名字是‘主页’的，放置在第一个
    if (flows[i].name == "主页") {
      parentmenus.unshift(parenttemp);
    }else{
      parentmenus.push(parenttemp);
    }
	}

  var ret = []
	for(var i=0;i<parentmenus.length;i++){
    if(parentmenus[i].child && parentmenus[i].child.length > 0){
     ret.push(parentmenus[i])
    }
	}
	return ret;
}

// 只有admin可看到的items
function admingeneratemenuitem(flows,isadmin){
  //flows是流程的集合，
  var treeData = [];//最终返回的树结构
  var childflow = [];//子流程的集合
  if(!isadmin){
    return [];
  } else {
    for(let i =0;i<flows.length;i++){
      if(flows[i].mainflowid){  //如果是子流程，先把它放到childflow中，一会统一处理'
        childflow.push(flows[i]);
      } else { //都是主流程
        if(flows[i].nodes){  // 如果有nodes，那么不是空的流程，
          var flowobj = {  //确定flow的数据
            id : flows[i].id,
            name : flows[i].name,
            child :[]
          };
          for(let j=0;j<flows[i].nodes.length;j++){  //遍历nodes
            if(flows[i].nodes[j].isAdmin == "true" && flows[i].nodes[j].page){ //是管理员权限,且有子页面
              flowobj.child.push({
                flowid : flows[i].id,
                name:flows[i].nodes[j].name,
                node:flows[i].nodes[j].nodeid,
                page:flows[i].nodes[j].page
              });
            }
          }
          treeData.push(flowobj);
          flowobj = null;
        } else { //空的流程也要放进来，防止子流程有nodes
          var flowobj = {  //确定flow的数据
            id : flows[i].id,
            name : flows[i].name,
            child :[]
          };
          treeData.push(flowobj);
          flowobj = null;
        }
      }
    }
    //这里处理子流程
    for(let i=0;i<childflow.length;i++){
      if(childflow[i].nodes.length > 0){  //子流程中nodes ，没有的话，没必要遍历了
        for(let j=0;j<treeData.length;j++){ //在主流程中遍历
          if(childflow[i].mainflowid == treeData[j].id){  //找到对应的主流程
            for(let k=0;k<childflow[i].nodes.length;k++){ //遍历子流程的nodes，并把管理员权限的node放到主流程的child中
              if(childflow[i].nodes[k].isAdmin == "true" && childflow[i].nodes[k].page){  //是管理员权限,且有子页面
                treeData[j].child.push({
                  flowid : childflow[i].id,
                  name:childflow[i].nodes[k].name,
                  node:childflow[i].nodes[k].nodeid,
                  page:childflow[i].nodes[k].page
                });
              }
            }
          }
        }
      }
    }
    //去除空的主流程（没有节点的）
    for(let i=0;i<treeData.length;i++){
      if(treeData[i].child.length < 1){
        treeData.splice(i,1);
        i--;
      }
    }
  }
  return treeData;
}

// 获取部门下所有的人员以及子部门的人员
function getdepartments(departmentid,departments) {
  var relArr = [];
  return _getdepartments(departmentid,departments);
  function _getdepartments(departmentid,departments) {
      for (var i = 0; i < departments.length; i++) {
          if (departments[i].id == departmentid) {
              relArr.push(departments[i].id);
              _getdepartments(departments[i].parentId, departments);
          }
      }
      return relArr;
  }
}

function generateallpagesrouter(usrid,flows,pages) {
	var flowidsAndNodeids = [];
	//把所有的flowid  和 node id 取出来
	for(var i = 0, pageLen = pages.length; i < pageLen; i++) {
		flowidsAndNodeids.push({
			flowid: pages[i].flowid,
			nodeid: pages[i].nodeid,
			pages: []
		})
	}
	//对 flowidsAndNodeids 去重
	var res = []
	var newarr = new Set(flowidsAndNodeids);
	for(let item of newarr.keys()) {
		res.push(item)
	}
	// 把所有的页面名放进res 中
	for(var k = 0; k < pageLen; k++) {
		for(var n = 0, resLen = res.length; n < resLen; n++) {
			if(pages[k].flowid == res[n].flowid && pages[k].nodeid == res[n].nodeid) {
				res[n].pages.push({
					filename: pages[k].filename
				})
			}
		}
	}
	var ret = []
	for(var m = 0; m < resLen; m++) {
		var parenttemp = {}
		parenttemp.id = res[m].flowid
		var childmenus = [];
		var childtemp = {};
		for(var h = 0, rPagesLen = res[m].pages.length; h < rPagesLen; h++) {
			var childtemp = {};
			childtemp.node = res[m].nodeid
			childtemp.filename = res[m].pages[h].filename
			childmenus.push(childtemp)
		}
		parenttemp.child = childmenus
		ret.push(parenttemp)
	}
	return ret
}

// 数组去重
function uniqueArr(arr) {
  var newArr=[];
  for(var i=0;i<arr.length;i++){
    if(newArr.indexOf(arr[i])===-1){
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
