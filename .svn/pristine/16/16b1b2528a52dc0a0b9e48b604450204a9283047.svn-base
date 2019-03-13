/**
 * Created by demo on 2017/5/25.
 */

//注：本controler为内部使用，不应该有对外暴露的api.
module.exports = {
	handlecommonaction:function(vuecontent,flowid,nodeid,pageid,tempid){
	    return new Promise(function (resolve, reject) {
	        parsebycommonaction({vuecontent: vuecontent,flowid:flowid,nodeid:nodeid,pageid:pageid,tempid:tempid})
	            .then(generatecomponents)
	            .then(delfirstlinefromcomponents)
	            .then(readimportcardpage)
	            .then(calctransferinfo)
	            .then(showinmodalifneeded)
	            .then(donconfigbtninlist)
	            .then(replacecomponent)
	            .then(readpagesifneeded)
	            .then(replacepages)
	            .then(function (data) {
	                //components为返回值为所有用到的组件的信息，包括更改后的名字，和更改后的vue内容。
	                //vuecontent为新的vue文件的内容。
	                resolve(data);
	            })
	    })
	}
}

/*

    主数据结构：
        {
        vuecontent:
        components:
        pages
        }


    components 和 pages的数据结构

        components：
             {
                 "componentname": "对应的component名",
                 "referplace": "引用的位置",
                 "newname": "新的component名称",
                 "vue": "对应的vue内容",
                 "json": "对应的json配置文件的内容"
             }

          pages:
             {
                 "pageid": "对应的page id, 输入部分",
                 "pagename": "文件名，通过page读出"
             }

 */

/////////////////////////////////////////////////////////////////////////////////////
//主要函数

function calctransferinfo(data){
	var transferfunctions = [];
	var components = data.components
	return new Promise(function(resolve,reject){
		var start = ""
		var end = ""
		if(components.length !=0){
			for(var i=0;i<components.length;i++){
	   			(function(){
	   				var start = "PAGEIDTOROUTER"
	   				var end = "KUOHAO"
	   				var retstr = getdataswithoutfrom(components[i].vue,start,end)
	   				var pageid = retstr[0]
					var PAGEIDTOROUTER = function (callback){
						if(pageid){
							if(pageid == 'undefined'){
								callback(null,'')
							}else{
						    	this.Page.findOne({
									pageid:pageid
						    	}).exec(function(err,page){
						    		if(err){
						    			console.log('未找到对应的页面')
						    			callback(null,'')
						    		}else{
						    			console.log('路由转换成功')
						    			var path = './'+ page.flowid + '|'+ page.nodeid + '|' + page.filename
						    			var filename = page.filename
						    			var flowid = page.flowid
						    			var nodeid = page.nodeid
						    			var result = {}
						    			result.path = path
						    			result.filename = filename
						    			result.flowid = flowid
						    			result.nodeid = nodeid
						    			result.pageid = pageid
						    			callback(null,result)
						    		}
						    	})
							}
						}else{
							callback(null,'')
						}
					
					}
					transferfunctions.push(PAGEIDTOROUTER)
	   			}())
			}
			async.series(transferfunctions,function(err,result){
				//把路由替换进components
				if(result){
					for(var j=0;j<components.length;j++){
						var start = "PAGEIDTOROUTER"
		   				var end = "KUOHAO"
		   				components[j].vue = replacedatas(components[j].vue,result[j].path,start,end)
		   				components[j].btnCorpration = result[j]
					}
					data.components = components
					resolve(data)
				}else{
					reject(err)
				}
			})
		}else{
			resolve(data)
		}
		
	})

}

function showinmodalifneeded(data){
	var components = data.components;
	return new Promise(function (resolve, reject) {
 		var from = "showinmodal=\""
 		var to = "\""
 		var importFrom = "let importstart;" 
 		var exportFrom = "components:{"
 		var insertFrom = '<div id="pagetobeadd">'
 		var importContent = ""
 		var exportContent = ""
 		var insertContent = ""
 		for(var j=0,len=components.length;j<len;j++){
 			var ret = false
 			var name = components[j].btnCorpration.filename
 			var flowid = components[j].btnCorpration.flowid
 			var nodeid = components[j].btnCorpration.nodeid
 			if(components[j].templetefile == "myButton"){
 				ret = getdataswithoutfrom(components[j].refer,from,to,"json")[0]
 				if(ret){
 					var stripscriptname = stripscript(name)
 					importContent = "import " + stripscriptname + " from '../../"+flowid+'/'+nodeid+'/' + name + ".vue'\n"
 					exportContent = stripscriptname + ', '
 					insertContent = "<" + stripscriptname + "></" + stripscriptname + ">"
 					components[j].vue = insertimport(components[j].vue,importContent,importFrom)
 					components[j].vue = insertimport(components[j].vue,exportContent,exportFrom)
 					components[j].vue = insertimport(components[j].vue,insertContent,insertFrom)
 				}
 			}
 		}
 		data.components = components
 		resolve(data)
	 	
	})
}

function parsebycommonaction(vuecontent){
    //通过common action中的配置，找出传入的vue中的components与pages.
    var components, pages;
    return new Promise(function (resolve, reject) {
        //通过common action来读取vue文件中的components和pages.
        var componentsandpages = readcomponentsandpages(vuecontent);
        components = componentsandpages[0]
        pages = componentsandpages[1]
//      [components, pages] = readcomponentsandpages(vuecontent);
        resolve({vuecontent:vuecontent, components:components, pages:pages});
    });
}

/*
    函数用于找出并生成对应的component的信息。
 */
function generatecomponents(data){
    var components = data.components;
    return new Promise(function (resolve, reject) {
    	if(components.length == 0){
    		resolve(data)
    	}else{
    		var replacepageidstart = "let ownpageid = \""
            var replaceflowidstart = "let ownflowid = \""
            var replacenodeidstart = "let ownnodeid = \""
            var end = "\""
            var pageid = data.vuecontent.pageid
            var flowid = data.vuecontent.flowid
            var nodeid = data.vuecontent.nodeid
	        for(var i=0;i<components.length;i++){
	        	//读出组件模板VUE文件和json文件
	        	//替换openID
	            components[i].vue = readcomponentvue(components[i].templetefile);
	            components[i].json = readcomponetjson(components[i].templetefile);
            	components[i].vue = insertcomponenttotempletetop(components[i].vue, components[i].refer)
	            //把flowid nodeid pageid 写进组件中
	            components[i].vue = replacedatas(components[i].vue,replacepageidstart+pageid+end,replacepageidstart,end)
	            components[i].vue = replacedatas(components[i].vue,replaceflowidstart+flowid+end,replaceflowidstart,end)
	            components[i].vue = replacedatas(components[i].vue,replacenodeidstart+nodeid+end,replacenodeidstart,end)
	            ret = handlecomponentaction(components[i].vue, components[i].json)
	            components[i].vue = ret[ret.length-1]
	        }
	        data.components = components;
	        resolve(data);
    	}
    });
}
/****card中导入页面****/
function readimportcardpage(data){
	var components = data.components;
	return new Promise(function (resolve, reject) {
	 	getcardpageids(data)
	 	.then(getcardpagenames)
	 	.then(docardimport)
	 	.then(function(data){
	 		resolve(data)
	 	})
	 	
	})
}

function getcardpageids(data){
	return new Promise(function (resolve, reject) {
		var components = data.components;
		var from = "importcardpageid=\"" 
		var to = "\""
		var cardpageids = []
		for(var i=0,len=components.length;i<len;i++){
			var id = ''
			if(components[i].templetefile == "myCard"){
				id =  getdataswithoutfrom(components[i].refer,from,to,"json")[0]
				components[i].cardpageid = id
				cardpageids.push(id)
			}
		}
		data.components = components
		data.cardpageids = cardpageids
		resolve(data)
	})
}

function getcardpagenames(data){
	return new Promise(function (resolve, reject) {
		var ret = data.cardpageids
		this.Page.find({
            id:ret
        }).exec(function(error, page){
        	var filenames =[]
        	for(var i=0,len=page.length;i<len;i++){
        		filenames.push({
        			id:page[i].id,
        			flowid:page[i].flowid,
        			nodeid:page[i].nodeid,
        			filename:page[i].filename
        		})
        	}
        	data.cardpages = filenames
            resolve(data)
        })
	})
}

function docardimport(data){
	var cardpages = data.cardpages
	var components = data.components;
	var importFrom = 'let importstart;'
	var exportFrom = 'components:{'
	var inserPageFrom = '<div id = "layouttobeadd">'
	var needtoimport = ""
	var needtoexport = ""
	var inserPage = ""
	return new Promise(function (resolve, reject) {
		for(var i=0,len=cardpages.length;i<len;i++){
			for(var j=0,l=components.length;j<l;j++){
				if(cardpages[i].id == components[j].cardpageid){
					var stripscriptname = stripscript(cardpages[i].filename)
					needtoimport = "import " +  stripscriptname + " from '../../" +cardpages[i].flowid +'/'+ cardpages[i].nodeid +'/' + cardpages[i].filename + ".vue'\n"
					needtoexport = stripscriptname + ","
					inserPage = "<" + stripscriptname  + "></" + stripscriptname  + ">\n"
					components[j].vue = insertimport(components[j].vue,needtoimport,importFrom)
					components[j].vue = insertimport(components[j].vue,needtoexport,exportFrom)
					components[j].vue = insertimport(components[j].vue,inserPage,inserPageFrom)
				}
			}
		}
		data.components = components
		resolve(data)
	})
}

/****card中导入页面****/

function delfirstlinefromcomponents(data){
	var components = data.components;
    return new Promise(function (resolve, reject) {
    	if(components.length == 0){
    		resolve(data)
    	}else{
	        for(i=0;i<components.length;i++){
	            components[i].vue = deletefirstlinefromcomponent(components[i].vue,components[i].refer)
	        }
	        data.components = components;
	        resolve(data);
    	}
    });
}

function donconfigbtninlist(data){
    return new Promise(function (resolve, reject) {
        readpageidsbylist(data)
	        .then(readpageidinfobylist)
	        .then(dolistimport)
	        .then(function(data){
	        	resolve(data)
	        })
    	
    });
}

function readpageidsbylist(data){
	var components = data.components
	return new Promise(function (resolve, reject) {
		var len = components.length 
		if(len == 0){
			resolve(data)
		}else{
			var ret = []
			for(var i=0;i<len;i++){
				if(components[i].templetefile == "myStrongList" ||components[i].templetefile == "myList"){
					var temp = []
					var viewfrom = "viewpage=\""
					var editfrom = "editpage=\""
					var to = "\""
					var viewpageid = getdataswithoutfrom(components[i].refer,viewfrom,to,"json")[0]
					var editpageid = getdataswithoutfrom(components[i].refer,editfrom,to,"json")[0]
					temp .push({"id":viewpageid,type:"view"},{"id":editpageid,type:"edit"})
					components[i].listinfo = temp
					ret.push(viewpageid,editpageid)
				}
			}
			data.listCorpration = ret
			data.components = components
			resolve(data);
		}
	})
}

function readpageidinfobylist(data){
	var components = data.components
	var ids = data.listCorpration
	return new Promise(function (resolve, reject) {
		if(components.length == 0){
			resolve(data)
		}else{
			this.Page.find({
				id:ids
			}).exec(function(err,page){
				var filenames =[]
	        	for(var i=0,len=page.length;i<len;i++){
	        		filenames.push({
	        			id:page[i].id,
	        			flowid:page[i].flowid,
	        			nodeid:page[i].nodeid,
	        			filename:page[i].filename
	        		})
	        	}
	        	data.listimportpages = filenames
	        	resolve(data);
			})
		}
	})
}

function dolistimport(data){
	var components = data.components
	var lc = components.length
	var ret = data.listimportpages
	return new Promise(function (resolve, reject) {
		if(lc == 0){
			resolve(data)
		}else{
			var len = ret.length
			var importfrom ="let importstart;"
			var exportfrom = "components:{"
			var importcontent = ''
			var exportcontent = ''
			var replacecontent =''
			var replaceviewpagestart ='<div id="viewpagetobeadd">'
			var replaceeditpagestart ='<div id="editpagetobeadd">'
			var replacepageend = "</div>"
			
			for(var j=0;j<lc;j++){
				if(components[j].templetefile == "myStrongList" || components[j].templetefile == "myList"){
					var stripscriptnames = []
					for(var m=0;m<components[j].listinfo.length;m++){
						if(components[j].listinfo[m].id !=""){
							for(var i=0;i<len;i++){
								if(components[j].listinfo[m].id == ret[i].id){
									var stripscriptname = stripscript(ret[i].filename)
									stripscriptnames.push(stripscriptname)
									importcontent = "import "+stripscriptname+" from '../../"+ret[i].flowid+'/'+ret[i].nodeid+'/'+ret[i].filename+".vue';\n"
									exportcontent = stripscriptname+',\n'
									replacecontent = "<"+stripscriptname+"></"+stripscriptname+">"+replacepageend
									if(components[j].listinfo[m].type == "view"){
										replacecontent = replaceviewpagestart + replacecontent
										//components[j].vue = insertimport(components[j].vue,importcontent,importfrom)
										//components[j].vue = insertimport(components[j].vue,exportcontent,exportfrom)
										components[j].vue = replacedatas(components[j].vue,replacecontent,replaceviewpagestart,replacepageend)
									}else if(components[j].listinfo[m].type == "edit"){
										replacecontent = replaceeditpagestart + replacecontent
										//components[j].vue = insertimport(components[j].vue,importcontent,importfrom)
										//components[j].vue = insertimport(components[j].vue,exportcontent,exportfrom)
										components[j].vue = replacedatas(components[j].vue,replacecontent,replaceeditpagestart,replacepageend)
									}
								}
							}
							
						}
					}
					//这里需要对import 和export 去重处理 stripscriptnames 去重
					stripscriptnames = uniqueArray(stripscriptnames)
					for(var x=0,lst=stripscriptnames.length;x<lst;x++){
						var tmp = x
						var stripscriptname = stripscriptnames[tmp]
						var flowid = ""
						var nodeid = ""
						for(var c=0;c<ret.length;c++){
							if(stripscriptname == stripscript(ret[c].filename))
							flowid = ret[c].flowid
							nodeid = ret[c].nodeid
						}
						if(flowid == "" || nodeid == ""){
							continue
						}else{
							importcontent = "import "+stripscriptname+" from '../../"+flowid+'/'+nodeid+'/'+stripscriptname+".vue';\n"
							exportcontent = stripscriptname+',\n'
							var partt1 = new RegExp(importcontent)
							var partt2 = new RegExp(exportcontent)
							if(!(partt1.test(components[j].vue))){
								components[j].vue = insertimport(components[j].vue,importcontent,importfrom)
							}
							if(!(partt2.test(components[j].vue))){
								components[j].vue = insertimport(components[j].vue,exportcontent,exportfrom)
							}
						}
					}
					
					
					for(var m=0;m<components[j].listinfo.length;m++){
						if(components[j].listinfo[m].id !=""){
							for(var i=0;i<len;i++){
								if(components[j].listinfo[m].id == ret[i].id){
									
								}
							}
							
						}
					}
				}
			}
			
			
			data.components = components
			resolve(data);
		}
	})
}

/*数组去重*/
function uniqueArray(arr){
	var res = [];
	var json = {};
	for(var i = 0; i < arr.length; i++){
		if(!json[arr[i]]){
			res.push(arr[i]);
			json[arr[i]] = 1;
		}
	}
	return res;
}

/*
通过component数据，特别是新的名字，替换原有的vue文件。
 */
function replacecomponent(data){
	var components = data.components
    return new Promise(function (resolve, reject) {
    	if(components.length == 0){
    		resolve(data);
    	}else{
            replacevuebycomponents(data)
	            .then(generateexportbycomponents)
	            .then(function(data){
	            	resolve(data);
	            })
    	}
    });
}

function readpagesifneeded(data){
	//判断 如果是tab页面的话走这个函数
    return new Promise(function (resolve, reject) {
        //通过page的id来读取page name和对应的目录。
        getpagenamesbyid(data)
        	.then(getfilenamesbyid)
            .then(function(data){
                resolve(data);
            });
    });
}

function replacepages(data){
    return new Promise(function (resolve, reject) {
        dopageimportaction(data)
        dopageexportaction(data)
        replacevuewithpages(data)
    	//在原vue中替换pages.
    	resolve(data);
    });
}

function insertcomponenttotempletetop(vue, insertcontent){
	vue  = insertcontent + '\n'+ vue
    return vue
}

function deletefirstlinefromcomponent(vue,regstr){
	var from = regstr
	from = escapeExprSpecialWord(from)
	var needtoreplace = ''
	vue = replacedataOnce(vue,needtoreplace,from)
	return vue
}

function handlecomponentaction(vuefile, config ){
	config = JSON.parse(config)
	var ret = []
    if(config.action){
        if(config.action.length > 0){
        	for(var i=0; i<config.action.length; i++){
	            var temp = i
	        	vuefile = doconfigactions(vuefile,config.action[temp])
	            ret.push(vuefile)
	        }
        }else{
        	ret .push(vuefile)
        }
    }
    return ret
}

function doconfigactions(source, action){
    //TODO，注释信息需要能被看懂。
	var data = getdataswithoutfrom(source, action.from.start, action.from.end, action.totype)
	//通过传递的pageid转换路由
	var pageid = data[0]
	if(action.from.Trannsfer){
		pageid = 'PAGEIDTOROUTER'+pageid +'KUOHAO'
	}
	replacesource = action.to.start + pageid + action.to.end;
    return replacedatas(source, replacesource, action.to.start,action.to.end);

}


//这里的替换   是替换模板的
function replacevuebycomponents(data){
	return new Promise(function (resolve, reject) {
		var components = data.components
	    for (var i=0;i<components.length;i++) {
	        var newname = components[i].templetefile + daterandom()
	        components[i].newname = newname;
	        newname = stripscript(newname)
	        
	        //如果字符中含有需要的转义的字符 找到该字符 并在其前边加一个转义符号
	        components[i].refer = escapeExprSpecialWord(components[i].refer)
	        var from  = '<'+ components[i].templetefile+ components[i].refer + '>'
	        var to = '</'+ components[i].templetefile+ '>'
	        var needtoreplace = '<'+'R'+ newname +'></' +'R'+ newname +'>'
	        if(data.tempid == "591e6a3c8c9082580984ceee" || data.tempid == "5981429f8c9082580984cf0f"){
	        	if(/myUpload/.test(components[i].templetefile) || /fileListWithSubmit/.test(components[i].templetefile)){
	        		needtoreplace = '<'+'R'+ newname + ' :parentid="parentid" '+ '></' +'R'+ newname +'>'
	        	}
	        }
	        data.vuecontent.vuecontent = replacedatas(data.vuecontent.vuecontent, needtoreplace, from,to)
	    }
		resolve(data)
	})
}

function escapeExprSpecialWord(str){
	var fbsarr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "{", "}", "^", "|"]
	var arr = []
	for(var i=0,l=fbsarr.length;i<l;i++){
		for(var j=0,len=str.length;j<len;j++){
			if(str[j] == fbsarr[i]){
				arr.push(parseInt(j))
			}
		}
	}
	//排序
	arr = bubbleSort(arr)
	arr = arr.reverse()
	var newstr = str
	for(var n=0,m=arr.length;n<m;n++){
		var temp = parseInt(arr[n])
		newstr = newstr.split('')
		newstr.splice(temp,1,("\\"+newstr[temp]))
		newstr = newstr.join('')
	}
	str = newstr
	return str
}


//数组排序 冒泡
function bubbleSort(array){
	var i = 0, len = array.length, j, d; 
	for(; i<len; i++){
		for(j=0; j<len; j++){ 
			if(array[i] < array[j]){ 
				d = array[j]; 
				array[j] = array[i]; 
				array[i] = d;
			} 
		} 
	}
	return array;
}



function generateexportbycomponents(data){
//保留之前的东西，插入新的数据。
	return new Promise(function (resolve, reject) {
		var flowid = data.vuecontent.flowid
		var nodeid = data.vuecontent.nodeid
	    var importstart = "let importstart;"
	    var exportstart = "components:{"
		var components = data.components
		var importneedtoinsert = ''
		var exportneedtoinsert = ''
	    for (i=0;i<components.length;i++) {
	    	var stripscriptname = stripscript(components[i].newname)
	    	var importneedtoinsert = " import " + 'R'+ stripscriptname + " from '../../"+flowid+'/'+nodeid+'/' +components[i].newname + ".vue'"
	    	var exportneedtoinsert = 'R'+stripscriptname + ','
	        data.vuecontent.vuecontent =  insertimport(data.vuecontent.vuecontent,importneedtoinsert, importstart)
	        data.vuecontent.vuecontent =  insertimport(data.vuecontent.vuecontent,exportneedtoinsert, exportstart)
	    }
		resolve(data)
	})
}


function daterandom() {
    //根据当前时间，生成随机数
    var date = new Date().getTime()
    //从后面取四位
    var str = new String(date)
    str =str.substr(-4)
    //生成四位随机数
    str += RndNum(4)
    return str;
}
//生成n位随机数
function RndNum(n){
	var rnd = "";
	for(var i=0;i<n; i++){
		rnd += Math.floor(Math.random()*10);
	}
	return rnd;
}

function getpagenamesbyid(data){
	return new Promise(function (resolve, reject) {
	    var pages = data.pages
	    if(pages.length != 0){
	    	var start = 'importpageid="'
	    	var end = '"'
	    	var ret = []
	    	var pageid = []
	    	for(var i=0;i<pages.length;i++){
	    		pageid = getdataswithoutfrom(pages[i],start,end)
				ret.push(pageid[0])
				pageid = []
			}
	    }
	    data.pages = ret
		resolve(data)
	})
}
function getfilenamesbyid(data){
	var ret = data.pages
	return new Promise(function (resolve, reject) {
        this.Page.find({
            id:ret
        }).exec(function(error, page){
        	var filenames =[]
        	for(var i=0;i<page.length;i++){
        		filenames.push({
        			id:page[i].id,
        			flowid:page[i].flowid,
        			nodeid:page[i].nodeid,
        			filename:page[i].filename
        		})
        	}
        	data.filenames = filenames
            resolve(data)
        })
		
    })
	
}

function readPageid(pages){
	var ret = []
	for(var i=0;i<pages.length;i++){
		
	}
}
function dopageimportaction(data){
	var filenames = data.filenames
    var from = 'let importstart;'
	
    if(filenames.length != 0){
    	for(var i=0; i<filenames.length;i++){
    		var stripscriptname = stripscript(filenames[i].filename)
    		var importneedtoinsert = ''
    		var importneedtoinsert = " import " + stripscriptname + " from '../../"+filenames[i].flowid+'/'+filenames[i].nodeid+'/' + filenames[i].filename + ".vue'"
    	    data.vuecontent.vuecontent = insertimport(data.vuecontent.vuecontent, importneedtoinsert, from)
    	}
    }

}

function dopageexportaction(data){
	var filenames = data.filenames
    var from = 'components:{'
    if(filenames.length != 0){
    	for(var i=0; i<filenames.length;i++){
    		var stripscriptname = stripscript(filenames[i].filename)
    		var exportneedtoinsert = ''
    	    var exportneedtoinsert = stripscriptname + ','
    	    data.vuecontent.vuecontent = insertimport(data.vuecontent.vuecontent, exportneedtoinsert, from)
    	}
    }

}


function replacevuewithpages(data){
	var filenames = data.filenames
	if(filenames.length != 0){
		for(var i=0; i<filenames.length;i++){
			var stripscriptname = stripscript(filenames[i].filename)
			var replacesource = ''
		    var from = '<importpages importpageid="'+ filenames[i].id
		    var to = '"></importpages>'
		    var replacesource = "<" + stripscriptname + "></" + stripscriptname + ">"
		    data.vuecontent.vuecontent = deleteoldandreplacenew(data.vuecontent.vuecontent, replacesource, from, to)
		}
	}

}


/////////////////////////////////////////////////////////////////////////////////////
//action中transfer部分可能出现的函数。



function PAGEIDTOROUTER(pageid){
    var router = ""
    return router;
}

function SKIDTOSKKEY(skid){
    var key = ""
    return key;
}





//读出组件信息 和导入页面信息
function readcomponentsandpages(vuefile){
	var arr = []
    var commonactionconfig = JSON.parse(readfile(process.cwd()+'/template/commonaction/commonaction.json'));
    var components = [];
    var pages = [];
    for (var i=0; i< commonactionconfig.importcomponentaction.length; i++) {
        var ret = getdataswithoutfrom(vuefile.vuecontent, commonactionconfig.importcomponentaction[i].identify.start, commonactionconfig.importcomponentaction[i].identify.end)
        if(ret != null || ret != undefined){
        	for(j=0;j<ret.length;j++){
        	    var componet = {templetefile:commonactionconfig.importcomponentaction[i].templetefile, refer:ret[j]}
        	    components.push(componet)
        	}
        }else{
        	
        }
    }
    arr.push(components)
    pages = getdataswithoutfrom(vuefile.vuecontent, commonactionconfig.importpageaction.identify.start, commonactionconfig.importpageaction.identify.end)
    arr.push(pages)
    return arr;
}


function readcomponentvue(component){
    return readfile(process.cwd()+'/template/components/'+component +'.vue')
}

function readcomponetjson(component){
    return readfile(process.cwd()+'/template/components/'+component +'.json')
}

/////////////////////////////////////////////////////////////////////////////////////
//utils function bottom
function replacedatas(source, needtoreplace, from, to){
    var regstr = from+"(.*?)"+ to
    var reg= new RegExp(regstr, 'g');
    var result = source.replace(reg, needtoreplace);
    return result;
}

/*匹配第一个*/
function replacedataOnce(source, needtoreplace, from){
    var regstr = from + "(.*?)(?=)"
    var reg= new RegExp(regstr);
    var result = source.replace(reg, needtoreplace);
    return result;
}

 
function deleteoldandreplacenew(source, needtoreplace, from, to){
    var regstr = from + to 
    var reg= new RegExp(regstr, 'g');
    var result = source.replace(reg, needtoreplace)
    return result;
}

function insertdatas(source, needtoreinsert, from, to){
    var regstr = from + "(.*?)(?="+ to + ")"
    var reg= new RegExp(regstr, 'g');
    var result = source.search(reg, needtoreinsert);
    //charu
    var insert = result + needtoreinsert;
    result = source.replace(reg, insert)
    return result;
}

function insertimport(source,needtoinsert,flg){
	var reg = new RegExp(flg,'g')
	var insert =  flg + '\n' +  needtoinsert
	var result = source.replace(reg, insert)
    return result;
}

function getdataswithoutfrom(source, from, to, outputtype){
	var ret = null
    if(outputtype == 'json'){
		ret = []
    }else{
        ret =[];
    }
    var regstr = from + "(.*?)(?="+ to + ")"
    var reg= new RegExp(regstr, 'g');
    var result = source.match(reg);
    if(result != null){
	    for(var i=0;i<result.length;i++){
	        var temp = result[i].replace(from, '');
	        if(outputtype == 'json'){
				ret.push(temp);
	        }else{
	            ret.push(temp);
	        }
	    }
    }
    return ret;
}


function readfile(templetename){
    var fs = require("fs");
    var data = fs.readFileSync(templetename, 'utf8');
    return data;
}

//过滤特殊字符
function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？-]")
        var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
