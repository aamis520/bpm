/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
"use strict";

module.exports = {

    pageupdate: function (req, res) {
        /*
        服务器传输格式示例如下：
             {
                 "templateid": "id",
                 "templateinfo": "Form-item...",
                 "layoutinfo": "data",
                 "scriptinfo": {
                     "key": "value"
                    },
                 "setting": {
                     "key": "value"
                    },
                 "importpages": {
                     "pagename": "id"
                    }
             }
         工作方式：
             1. 通过模板ID找到对应的vue文件和同文件的计算表达式。（因为JS不支持后向正则，所以用正则表达式，有点麻烦）
             2. 计算表达式中包含了对scriptinfo, setting和importpages如何来替换对应vue的规则。
             3. 替换好vue文件后，传给framework放到对应的目录下。
             4. 如果需要，重启framework 服务器
         */


        var flowid = req.param("flowid");
        var nodeid = req.param("nodeid");
        var filename = req.param("filename");
		var pageid = req.param("pageid");
        var tempid = req.param("tempid");
        var sks = req.param("sks");
        var selectwords = req.param("selectwords")
        var choosepersons = req.param("choosepersons")
        var newlayout = req.param("newlayout");
        var tabsubmitlayout = req.param("tabsubmitlayout");
        var settings = req.param("settings");
        var inputsetting = req.param("inputsetting");
        var autoformsetdatas = req.param("autoformsetdatas")
        var isshowchilddata = req.param("isshowchilddata")
        var ischildflow = false;//是否是子流程
        /*
        logic
        1. read templete file.
        2. read json confile.
        3. replace layout based on "relayout"
        4. replace script based on "rescript"
        4. do action based on "action"
         */

        Flow.findOne({
          id:flowid
        }).exec(function (err,flow) {
          if(!flow){
            res.send(200,{error:'未找到flows'})
          }else {
                ischildflow = flow.mainflowid; 
                Template.findOne({
                    id:tempid
                }).exec(function (err, templete){
                    //根据当前的flowid来做一下查询，看看这个流程是不是有    
                    if(!templete){
                        res.send(200,{error:"你没有选择正确的模版，请重新检查或联系软件提供商"});
                    }else{
                        var filelocation = process.cwd() + '/template/' + templete.filename;  //当前路径下的模板文件
                        var vuefile = readfile(filelocation + '.vue')   //读取文件
                        var config = {}
                        var configstr = readfile(filelocation + '.json')
                        var config = JSON.parse(readfile(filelocation + '.json'))  //读取同名的json文件
                        if(newlayout){
                            //替换layout
                            vuefile = replacedatas(vuefile, config.newlayout.start + newlayout, config.newlayout.start, config.newlayout.end)
                        }
                        //带提交表单的页签模板 
                        if(tabsubmitlayout){
                            vuefile = replacedatas(vuefile, config.tabsubmitlayout.form.start + tabsubmitlayout.submitStr, config.tabsubmitlayout.form.start, config.tabsubmitlayout.form.end)
                            vuefile = replacedatas(vuefile, tabsubmitlayout.tabStr, config.tabsubmitlayout.tabs.start, config.tabsubmitlayout.tabs.end)
                            vuefile = replacedatas(vuefile, config.tabsubmitlayout.strs.start + tabsubmitlayout.newstr, config.tabsubmitlayout.strs.start, config.tabsubmitlayout.strs.end)
                        }
                        //将pageid flowid nodeid 替换进模板中 start +++  把 设置输入框为下拉框的skids 存进模板中
                        
                        
                        var replacepageidstart = "let ownpageid = \""
                        var replaceflowidstart = "let ownflowid = \""
                        var replacenodeidstart = "let ownnodeid = \""
                        var replaceischildflow = "let ischildflow = \""
                        //增加一个 let childflodid 
                        var end = "\""
                        vuefile = replacedatas(vuefile,replacepageidstart+pageid,replacepageidstart,end)
                        vuefile = replacedatas(vuefile,replaceflowidstart+flowid,replaceflowidstart,end)
                        vuefile = replacedatas(vuefile,replacenodeidstart+nodeid,replacenodeidstart,end)
                        vuefile = replacedatas(vuefile,replaceischildflow+ischildflow,replaceischildflow,end)
                        //如果有inputsetting 把inputsetting替换进提交模板中
                        if(inputsetting){
                            var replaceinputsettingstart = "let inputsettings" 
                            var replaceinputsettingend = ";"
                            vuefile = replacedatas(vuefile,replaceinputsettingstart + " = " + inputsetting,replaceinputsettingstart,replaceinputsettingend)
                            var inputsets = JSON.parse(inputsetting)
                            var n = 1
                            for(var f=0,lis=inputsets.length;f<lis;f++){
                                var valstr = "val"
                                var tp = f
                                var retarr = []
                                if(inputsets[tp].setInputValueFromcount && inputsets[tp].setInputValueFromcount == true){
                                    if(inputsets[tp].keyofsetinputvalue)
                                    retarr =  JSON.parse(inputsets[tp].keyofsetinputvalue)
                                    var str = ''
                                    var lrt=retarr.length
                                    if(lrt > 0){
                                        for(var k=0;k<lrt;k++){
                                            var tmp = k
                                            var computemode = retarr[tmp].computemode
                                            var realcomputemode = ''
                                            if(computemode == "加"){
                                                realcomputemode = "+"
                                            }else if(computemode == "减"){
                                                realcomputemode = "-"
                                            }
                                            if(tmp == lrt -1){
                                                str += "Number(this.formInline." + retarr[tmp].sk +")"
                                            }else{
                                                str += "Number(this.formInline." + retarr[tmp].sk+ ")" + realcomputemode
                                            }
                                        }
                                        if(str != ""){
                                            valstr = inputsets[tp].elabel + valstr
                                            str =valstr+ n+"(){\n"+ "this.formInline."+ inputsets[tp].elabel + "=" + str +"},\n"
                                            var computedstart = "computed:{"
                                            vuefile = insertimport(vuefile,str,computedstart)
                                            //同时要把触发条件加上 valstr + n 即查找替换
                                            var replacevalstr = "{{" + valstr + n + "}},\n"
                                            var valstrstart = '<div style="display: none;">'
                                            vuefile = insertimport(vuefile,replacevalstr,valstrstart)
                                        }
                                    }
                                }
                                n++
                            }
                        }
                        
                        if(autoformsetdatas){
                            var replaceautoformsetdatastart = "let autoformsetdata" 
                            var replaceinputsettingend = ";"
                            vuefile = replacedatas(vuefile,replaceautoformsetdatastart + " = " + autoformsetdatas,replaceautoformsetdatastart,replaceinputsettingend)
                            //将带有class=warning的div的替换进模板中
                            var autoformsetdatasobj = JSON.parse(autoformsetdatas)
                            var str = ""
                            for(var z=0,alen=autoformsetdatasobj.length;z<alen;z++){
                                if(autoformsetdatasobj[z].conditions.length != 0){
                                    str +='<div class="warning" v-show="warninglabels.'+ autoformsetdatasobj[z].warningkey +'">' + autoformsetdatasobj[z].warningcontent + "</div>"
                                }
                            }
                            var replacewarningstart = '<div id="warningdivs">'
                            var replacewarningend = "</div>"
                            vuefile = replacedatas(vuefile,replacewarningstart+str,replacewarningstart,replacewarningend)
                            
                        }
                        if(isshowchilddata){
                            //将表单模板是否有子数据配置替换进模板中 replacedatas
                            var repalceisshowchilddatastart = "let showchilddata"
                            var repalceisshowchilddataend = ";"
                            vuefile = replacedatas(vuefile,repalceisshowchilddatastart + "=" + isshowchilddata,repalceisshowchilddatastart,repalceisshowchilddataend)
                        }
                        //将pageid flowid nodeid 替换进模板中 end
                        //把 设置输入框为下拉框的skids 替换进模板中 start
                        if(selectwords){
                            var wordsArr = JSON.parse(selectwords)
                            var wordsstr = selectwords             
                            var replaceSelectIdsStart = "let selectwords"
                            var insertSelectDataStart = "selectdatas:\"\","
                            var replaceSelectIdsEnd = ";"
                            vuefile = replacedatas(vuefile,replaceSelectIdsStart+'='+wordsstr,replaceSelectIdsStart,replaceSelectIdsEnd)
                            
                            var insertSelectData = ''
                            for(var x=0,lw=wordsArr.length;x<lw;x++){
                                insertSelectData = wordsArr[x].elabel +'s:\[\],' 
                                vuefile = insertimport(vuefile,insertSelectData,insertSelectDataStart)
                            }
                        }
                        if(choosepersons){
                            var replacechoosestart = "let choosepersonsets"
                            var replacechooseend = ";"
                            vuefile = replacedatas(vuefile,replacechoosestart+'='+choosepersons,replacechoosestart,replacechooseend)
                            
                        }
                        //把 设置输入框为下拉框的skids 替换进模板中 end
                        var commonaction = require('./CommonActionHandler.js') // 引入js文件
                        commonaction.handlecommonaction(vuefile,flowid,nodeid,pageid,tempid)
                            .then(function(data){
                                vuefile = data.vuecontent.vuecontent
                                if(settings){
                                    //配置相关setting
                                    vuefile = configbysetting(vuefile, settings, config)
                                }

                                if(config.action){
                                    for(var i=0; i<config.action.length; i++){
                                        vuefile = doconfigactions(vuefile,config.action[i])
                                    }
                                }
                                if(data.components.length != 0){
                                    for(var j=0;j<data.components.length;j++){
                                        var temp = j
                                        var fname = data.components[temp].newname;
                                        var file = data.components[temp].vue;
                                        writetoframework(flowid, nodeid, fname,file);
                                    }
                                }
                                setTimeout(function(){
                                    writetoframework(flowid, nodeid, filename,vuefile);
                                },1500)

                                if(sks){
                                    async.map(sks, function(data, cb) {
                                            Simplekeywords.findOrCreate({flowid: data.flowid,pageid: data.pageid, name: data.name, key: data.key}).exec(cb);
                                        },
                                        function done(err, sks) {
                                            res.send(200, {success:200});
                                        });

                                }else {
                                    res.send(200, {success:200});
                                }

                        });

                    }
                });
          }
        });
    },
    
    
    getall:function(req,res){
    	Template.find().exec(function(err,templete){
    		if(err){
    			res.send(500,{error:'网络错误'})
    		}else if(!templete){
    			res.send(200,{error:'没有模板'})
    		}else{
    			res.send(200,{templete:templete});
    		}
    	})
    },

    //TODO，什么是getui，命名上我们需要注意，合理的名字未来可读性才强。

};

function readfile(templetename){
    var fs = require("fs");
    var data = fs.readFileSync(templetename, 'utf8');
    return data;
}

function writetoframework(flowid, nodeid, filename, content){
    var path = require('path');
    var pathstr = path.resolve(path.resolve(process.cwd(), '../../'),"frontend//framework//src//pages//flows//customer//" + flowid + "//" + nodeid + "//" + filename + '.vue');
    var pathnodestr = path.resolve(path.resolve(process.cwd(), '../../'),"frontend//framework//src//pages//flows//customer//" + flowid + "//" + nodeid);
    var pathflowstr = path.resolve(path.resolve(process.cwd(), '../../'),"frontend//framework//src//pages//flows//customer//" + flowid);
    var fs = require("fs");
    //判断目录是否存在
    fs.exists(pathflowstr, function(exists){
    	if(exists){
    		//flow文件夹存在
    		fs.exists(pathnodestr,function(exists){
    			if(exists){
    				//node文件夹存在
    				fs.writeFileSync(pathstr, content);
    			}else{
    				//node文件夹不存在 创建 写内容
    				fs.mkdir(pathnodestr,function(err){
    					if(err){
                            fs.writeFileSync(pathstr, content);
		    				console.log(err);
		    			}else{
		    				fs.writeFileSync(pathstr, content);
		    			}
	    			})
    			}
    		})
    	}else{
    		//flow文件夹不存在
    		fs.mkdir(pathflowstr,function(err){
    			if(err){
                    fs.writeFileSync(pathstr, content);
    				console.log(err);
    			}else{
    				//node文件夹不存在 创建 写内容
    				fs.mkdir(pathnodestr,function(err){
    					if(err){
                            fs.writeFileSync(pathstr, content);
		    				console.log(err);
		    			}else{
		    				fs.writeFileSync(pathstr, content);
		    			}
	    			})
    			}
    		})
    	}
    });
}

function doconfigactions(source, action){
    /* 主要就是从源文件得到action的from, 然后写入to中*/
    var data = getdataswithoutfrom(source, action.from.start, action.from.end, action.totype)
    var replacesource = action.to.start + JSON.stringify(data);
    return replacedatas(source, replacesource, action.to.start,action.to.end);
}

function getdataswithoutfrom(source, from, to, outputtype){
    var ret = []
    if(outputtype == 'json'){
        ret = {};
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
    	        ret[temp] = '';
    	    }else{
    	        ret.push(temp);
    	    }
    	}
    }
    return ret;
}

/*全局匹配 替换所有*/
function replacedatas(source, needtoreplace, from, to){
    var regstr = from + "(.*?)(?="+ to + ")"
    var reg= new RegExp(regstr, 'g');
    var result = source.replace(reg, needtoreplace);
    return result;
}

/*匹配第一个*/
function replacedataOnce(source, needtoreplace, from, to){
    var regstr = from + "(.*?)(?="+ to + ")"
    var reg= new RegExp(regstr, 't');
    var result = source.replace(reg, needtoreplace);
    return result;
}

function configbysetting(source, settings, config){
	if (typeof settings === 'string') {
    	settings = JSON.parse(settings)
    }
//  settings = JSON.parse(settings)
    for(var i=0; i<settings.length; i++) {
    	
        try {
           var start = eval('config.setting.' + settings[i].key+ '.start')
           var end = eval('config.setting.' + settings[i].key+ '.end')
           source = replacedatas(source, start.replace("\\[", "\[") + JSON.stringify(settings[i].value), start, end)
        }
        
        catch(err) {
        }
        try {
           var start = eval('config.setting.' + settings[i].countkey+ '.start')
           var end = eval('config.setting.' + settings[i].countkey+ '.end')
           source = replacedatas(source, start.replace("\\[", "\[") + JSON.stringify(settings[i].count), start, end)
        }
        catch(err) {
        }
        try {
           var start = eval('config.setting.' + settings[i].editkey+ '.start')
           var end = eval('config.setting.' + settings[i].editkey+ '.end')
           source = replacedatas(source, start.replace("\\[", "\[") + JSON.stringify(settings[i].editpage), start, end)
        }
        catch(err) {
        }
        try {
           var start = eval('config.setting.' + settings[i].viewkey+ '.start')
           var end = eval('config.setting.' + settings[i].viewkey+ '.end')
           source = replacedatas(source, start.replace("\\[", "\[") + JSON.stringify(settings[i].viewpage), start, end)
        }
        catch(err) {
        }
        try {
           var start = eval('config.setting.' + settings[i].showviewinmodalkey+ '.start')
           var end = eval('config.setting.' + settings[i].showviewinmodalkey+ '.end')
           source = replacedatas(source, start.replace("\\[", "\[") + JSON.stringify(settings[i].showviewinmodal), start, end)
        }
        catch(err) {
        }
        try {
           var start = eval('config.setting.' + settings[i].showeditinmodalkey+ '.start')
           var end = eval('config.setting.' + settings[i].showeditinmodalkey+ '.end')
           source = replacedatas(source, start.replace("\\[", "\[") + JSON.stringify(settings[i].showeditinmodal), start, end)
        }
        catch(err) {
        }
    }

    return source;
}

function insertimport(source,needtoinsert,flg){
	var reg = new RegExp(flg,'g')
	var insert =  flg + '\n' +  needtoinsert
	var result = source.replace(reg, insert)
    return result;
}

