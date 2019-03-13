<style scoped>
	.ivu-row .ivu-input,
	.ivu-row .ivu-date-picker,
	.ivu-row .ivu-select.ivu-select-single {
		width: 60% !important;
	}
	
	.ivu-input-icon-normal+.ivu-input {
		width: 100% !important;
	}
	.quillWrapper{
		background: #fff;
	}
	.warning{
		text-align: center;
		font-size: 22px;
		margin: 10px 0;
		color: orangered;
		padding: 5px;
		background: #fff;
	}
</style>

<template>

    <div class="tabform">
    	<div id="warningdivs"></div>
        <i-form ref="formInline" :model="formInline" :rules="ruleValidate" :label-width="80">
            <Tabs v-model="tabName" v-on:on-click="changetabname">
    			<!--默认提交tab页-->
				<div id="formtobeaddstart"></div><div id="formtobeaddend"></div>
    			<!--其他导入页面tabs-->
            	<div id="tabstobeadd"></div></Tabs>
            <div style="width: 100%;height: 20px;">
            	
            </div>
        	<div id = "layouttobeadd"></div>
            <FormItem v-show="showformInline.submitbtn" style="text-align: right;">
				<Button type="primary" :disabled="disabledformInline.submitbtn" @click.native="handleSubmit('formInline')">{{btnname}}</Button>
			</FormItem>
			<FormItem v-show="showformInline.backbtn" style="text-align: right;">
				<Button type="success" :disabled="disabledformInline.backbtn" @click.native="backprevpage">返回</Button>
			</FormItem>
        </i-form>
		<div style="display: none;"></div>
		<!--选择人员对话框-->
		<selectOnePersonModal :toSelectOnePersonModal="toSelectOnePersonModal" @fromSelectOnePersonModal="getSelectOnePersonModalMsg"></selectOnePersonModal>
    </div>

</template>

<script>
	import { VueEditor } from 'vue2-editor'
	//引入人员选择对话框
	import selectOnePersonModal from "../../../../framework/selectOnePersonModal.vue";
	
	let importstart;
	
	let selectwords;
	let choosepersonsets;
	
	let inputsettings ;
	let autoformsetdata ;
	
	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
	let pagefromview = false  //是否为查看按钮跳转过来的
	let flowdatas = []
	let newitemid = null
	let parentid = ""
	let showchilddata;
    export default {
    	components:{VueEditor,selectOnePersonModal},
        data() {
            return {
            	//人员选择相关
            	choosepersonkey:'',
				personSelected:'',
                toSelectOnePersonModal:{
                    isModalShow:false
                },
                
                formInline: generateDatamodel(),
                showformInline:generateDataIfShowmodel(),
                warninglabels:generatewarning(),
                disabledformInline:genwratedisabled(),
                ruleValidate: generateruleValidate(),
                customToolbar:[
					['bold', 'italic', 'underline', 'strike'],
				  	['blockquote'],
				  	[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				 	[{ 'indent': '-1'}, { 'indent': '+1' }],
				  	[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				  	[{ 'color': [] }, { 'background': [] }],
				  	[{ 'font': [] }],
				  	[{ 'align': [] }],
				  	['clean']   //清除样式
				],
                querydata:{
                	
                },
                parentid:'',
                pageishowwinthinmodal:this.globalconfig.showingpagedlgqueue,
                selectdatas:"",
                pageid:'',
                parentid:"",
                btnname:'下一步',
                tabName:"form"
            }
        },
        watch:{
			pageishowwinthinmodal(){
				//从全局变量里面取itemid
				if(this.globalconfig.showingpagedlgqueue.length >0){
					for(var i = 0, ls = this.globalconfig.showingpagedlgqueue.length; i < ls; i++) {
						for(var k in this.globalconfig.showingpagedlgqueue[i]) {
							if(k == "flowid" || k == "nodeid" || k == "itemid" || k == "vieworedit") {
								continue
							} else {
								if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
									//这个k 是点击查看进入表单的页面id
									this.querydata.itemid = this.globalconfig.showingpagedlgqueue[i].itemid
									if(this.globalconfig.showingpagedlgqueue[i].vieworedit) {
										if(this.globalconfig.showingpagedlgqueue[i].vieworedit == "view") {
											pagefromview = true
										}
									}
								}
							}
						}
					}
	
					if(pagefromview == true) {
						if(this.querydata.vieworedit == "view" || pagefromview == true) {
							//将所有的input 设置为不可用状态
							for(var kk in this.disabledformInline){
								this.disabledformInline[kk] = true
							}
						}
					}
					if(this.querydata.itemid) {
						this.$http.get(this.globalconfig.listbyitemid, {
							params: {
								usrid: window.localStorage.getItem("usrid"),
								flowid: ownflowid,
								itemid: this.querydata.itemid
							}
						}, {
							emulateJSON: true
						})
						.then((response) => {
							var info = response.data.info
							
							for(var k in info) {
								for(var key in this.formInline) {
									if(k == key) {
										this.formInline[key] = info[k]
									}
								}
							}
						}, () => {
							this.$Message.success('这是一条失败的提示');
						});
					}
					
				}else{
					for(var kk in this.disabledformInline){
						this.disabledformInline[kk] = false
						pagefromview = false
						this.querydata.itemid = null
						for(var key in this.formInline) {
							this.formInline[key] = ""
						}
						this.handleQuery()
					}
				}
			}
		},
        methods: {
        	showPersonSelectModalFn(key){
			 	this.choosepersonkey = key
                this.toSelectOnePersonModal.isModalShow = true;
            },
            getSelectOnePersonModalMsg(data){
				this.toSelectOnePersonModal.isModalShow = false;
				var personinfo = data.personinfo
				this.formInline[this.choosepersonkey] = personinfo.personName
				var len = choosepersonsets.length
				if(len>0)
				for(var i=0;i<len;i++){
					if(choosepersonsets[i].elabel == this.choosepersonkey){
						if(choosepersonsets[i].choosepersonset){
							
							if(typeof(choosepersonsets[i].choosepersonset) == "string"){
								choosepersonsets[i].choosepersonset = JSON.parse(choosepersonsets[i].choosepersonset)
							}
							var programs = choosepersonsets[i].choosepersonset.programs
							if(programs.length>0){
								for(var j=0;j<programs.length;j++){
									this.formInline[programs[j].inputkey] = personinfo[programs[j].personinfokey]
								}
							}
						}
					}
				}
			},
        	generatedataid(){
        		//生成当前页面的数据id
        		//先判断是否为设置显示子数据
        		//再获取cookie 看看cookie中是否存在id
        		//设置cookie
//      		var showchilddata = showchilddata
    			//获取cookie
    			//if cookie none 
    			//set cookie
    			//并且设置全局变量  if showchilddata
    			//if cookie exist 
    			//set 全局变量 if showchilddata
    			//设置cookie
//    			delCookie("parent")
    			var parent = getCookie('parent')
    			console.log(parent)
    			if(parent){
    				//设置当前提交表单的数据的id 为cookie
    				//设置全局变量的dataid  为
    				var parenttemp = {}
    				if(typeof(parent) == 'string'){
    					parenttemp = JSON.parse(parent)
    					var pageid = parenttemp.pageid
    					var dataid = parenttemp.dataid
    					if(pageid == ownpageid){
    						generatedataid = dataid
		            		this.globalconfig.dataid = dataid
    					}else{
    						//生成一个id
    						parentid = dataid
		    				this.$http.get(this.globalconfig.generatedataidapi,
				            {
				                params: {
				                    flowid:ownflowid
				                }
				            }, {emulateJSON: true})
				            .then((response) => {
				            	var dataid = response.data.id
				            	generatedataid = dataid
				            	this.globalconfig.dataid = dataid
					        }, () => {
				                this.$Message.success('这是一条失败的提示');
				            });
    					}
    				}
    			}else{
    				//生成一个id
    				this.$http.get(this.globalconfig.generatedataidapi,
		            {
		                params: {
		                    flowid:ownflowid
		                }
		            }, {emulateJSON: true})
		            .then((response) => {
		            	var dataid = response.data.id
						if(showchilddata == true){
	    					//设置cookie
	    					var objtemp = {}
	    					objtemp.pageid = ownpageid
	    					objtemp.dataid = dataid
	    					var objstr = JSON.stringify(objtemp)
	    					setCookie('parent',objstr)
	    				}		            	
		            	generatedataid = dataid
		            	this.globalconfig.dataid = dataid
			        }, () => {
		                this.$Message.success('这是一条失败的提示');
		            });
    			}
        	},
        	backprevpage(){
				let showinmodalorjump = false
				for(let i = 0, len = this.globalconfig.showingpagedlgqueue.length; i < len; i++) {
					for(var k in this.globalconfig.showingpagedlgqueue[i]) {
						if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
							showinmodalorjump = true
							this.globalconfig.showingpagedlgqueue[i][k] = false
							this.globalconfig.showingpagedlgqueue.pop()
							this.$router.go(0)
							break
						}

					}
				}
				if(!showinmodalorjump) {
					this.$router.go(-1)
				}
			},
        	changetabname(name){
        		this.tabName = name
				var tabcount = document.querySelectorAll("div[class='ivu-tabs-nav']")[0].children.length-2;//减去一个form，减去一个蓝色下划线
        		if(tabcount == 0){
        			this.btnname = "提交"
        		}else{
        			var lasttabname = 'tab'+ tabcount
        			if(this.tabName != lasttabname){
        				this.btnname = "下一步"
        			}else{
        				this.btnname = "提交"
        			}
        		}
        	},
        	handleQuery(){
        		if(this.$router.currentRoute.query){
        			this.querydata = this.$router.currentRoute.query
        		}
        		if(this.querydata.flowid == undefined){
        			this.querydata.flowid = getflowid(this.$router.currentRoute.path)
        		}
        		if(this.querydata.nodeid == undefined){
        			this.querydata.nodeid = getnodeid(this.$router.currentRoute.path)
        		}
        		if(this.querydata.itemid) {
					//输入框不可用
					if(this.querydata.vieworedit == "view"){
						for(var kk in this.disabledformInline){
							this.disabledformInline[kk] = true
							this.disabledformInline.backbtn = false
							this.showformInline.backbtn = true
						}
					}else{
						for(var kk in this.disabledformInline){
							this.disabledformInline[kk] = false
							this.disabledformInline.backbtn = true
							this.showformInline.backbtn = false
						}
					}
					//数据回显
					
					this.$http.get(this.globalconfig.listbyitemid, {
							params: {
								usrid: window.localStorage.getItem("usrid"),
								flowid: ownflowid,
								itemid: this.querydata.itemid
							}
						}, {
							emulateJSON: true
						})
						.then((response) => {
							var info = response.data.info
							
							for(var k in info) {
								for(var key in this.formInline) {
									if(k == key) {
										this.formInline[key] = info[k]
									}
								}
							}
						}, () => {
							this.$Message.success('这是一条失败的提示');
						});
				}
				
				
				
        		//设置文本框
        		var queryinputvaluebysystem = []
        		var queryinputvaluebyck = []
        		if(inputsettings instanceof Array){
        			if(inputsettings.length>0){
        				for(var x=0,li=inputsettings.length;x<li;x++){
        					if(inputsettings[x].issetInput){
        						if(inputsettings[x].setvaluebysystem){
        							queryinputvaluebysystem.push(inputsettings[x])
        						}else{
        							queryinputvaluebyck.push(inputsettings[x])
        						}
        					}
        				}
        			}
        		}
        		//查询出我自己  我的上级
        		if(queryinputvaluebysystem.length >0){
        			this.$http.get(this.globalconfig.querymyselfandmyboss,
		            {
		                params: {
		                    usrid: window.localStorage.getItem("usrid"),
		                }
		            }, {emulateJSON: true})
		            .then((response) => {
		            	var myselfandmyboss = response.data
		            	var myslef = myselfandmyboss.myself
		            	var myboss = myselfandmyboss.myboss
		            	for(var i=0,len=queryinputvaluebysystem.length;i<len;i++){
		            		if(queryinputvaluebysystem[i].keyofsetinputvalue == "system-myself"){
		            			this.formInline[queryinputvaluebysystem[i].elabel] = myslef
		            		}else if(queryinputvaluebysystem[i].keyofsetinputvalue == "system-myboss"){
		            			this.formInline[queryinputvaluebysystem[i].elabel] = myboss
		            		}
		            	}
			        }, () => {
		                this.$Message.success('这是一条失败的提示');
		            });
        		}
        		//查询复杂关键字(多个复杂关键字)
        		if(queryinputvaluebyck.length>0){
        			var id = ""
        			for(var j=0,l=queryinputvaluebyck.length;j<l;j++){
        				var temp = j
        				id = queryinputvaluebyck[temp].keyofsetinputvalue
	        			this.$http.get(this.globalconfig.querybyck,
			            {
			                params: {
			                    usrid: window.localStorage.getItem("usrid"),
			                    keywordid:id
			                }
			            }, {emulateJSON: true})
			            .then((response) => {
			            	var value = response.data.data
			            	if(typeof(value) == "string"){
			            		this.formInline[queryinputvaluebyck[temp].elabel] = value
			            	}
				        }, () => {
			                this.$Message.success('这是一条失败的提示');
			            });
        			}
        		}
        		//循环给下拉框赋值
        		if(selectwords){
					if(selectwords instanceof Array) {
						var len = selectwords.length
						if(len > 0) {
							var _self = this
							for(let i = 0; i < len; i++) {
								var ttmp = i
								var cccc = (function(sss){
									_self.$http.get(_self.globalconfig.querybysk, {
										params: {
											usrid: window.localStorage.getItem("usrid"),
											flowid: selectwords[sss].setInputflowid,
											skid: selectwords[sss].setInputword
										}
									}, {
										emulateJSON: true
									})
									.then((response) => {
										var sk = response.data.sk
										var datas = response.data.info
										var k = sk.key
										var key = selectwords[sss].elabel + "s"
										_self[key] = []
										var temparr = []
										for(var m = 0, ld = datas.length; m < ld; m++) {
											temparr.push(datas[m][k])
										}
										temparr = uniqueArray(temparr)
										for(var n=0;n<temparr.length;n++){
											_self[key].push({
												id: temparr[n],
												value: temparr[n]
											})
										}
										//获取这个流程的所有数据  所有自己新建的数据
										_self.$http.get(_self.globalconfig.queryalldatabyflowid, {
												params: {
													usrid: window.localStorage.getItem("usrid"),
													flowid: selectwords[sss].setInputflowid
												}
											}, {
												emulateJSON: true
											})
											.then((response) => {
												var flowdata = response.data.flowdatas
												flowdatas.push(flowdata)
											}, () => {
												_self.$Message.success('这是一条失败的提示');
											});
									}, () => {
										_self.$Message.success('这是一条失败的提示');
									});
								})(ttmp)
								
							}
						}
					}
				}
        		this.$nextTick(function () {
				    var tabstobeaddcount = document.querySelectorAll("div[class='ivu-tabs-nav']")[0].children.length-2;//减去一个form，减去一个蓝色下划线

        			if(tabstobeaddcount < 1){
        				this.btnname = "提交"
        			}else{
        				this.btnname = "下一步"
        			}
				})
        	},
            handleSubmit(data) {
            	//先获取 tab的数量   除去提交有提交表单的tab
            	var tabcount = document.querySelectorAll("div[class='ivu-tabs-nav']")[0].children.length-2;//减去一个form，减去一个蓝色下划线
            	if(tabcount == 0){
            		this.submitformdata(data)
            	}else{
            		//由此可知 最后一个tab的name
	            	var lasttabname = 'tab'+ tabcount
	            	
	            	if(this.tabName == "form"){
	            		this.tabName = "tab1"
	            		if(this.tabName == lasttabname){
	            			this.btnname = "提交"
	            		}
	            		return false
	            	}else if(this.tabName != lasttabname){
	            		var nowname = this.tabName
	            		//去重 name里面的数字
	            		this.btnname = "下一步"
	            		var nownum =  nowname.replace(/[^0-9]/ig,"")
	            		nownum = parseInt(nownum)
	            		nownum  = nownum +1
	            		this.tabName = "tab" + nownum
	            		if(this.tabName == lasttabname){
	            			this.btnname = "提交"
	            		}
	            	}else if(this.tabName == lasttabname){
	            		this.submitformdata(data)
	            	}
            	}
            },
             submitformdata(name){
             	this.$refs[name].validate((valid) => {
					if(valid) {
		             	//从列表的查看按钮查看原表单 点击提交 为关闭对话框 或者返回上一页
		            	if(this.querydata.vieworedit){
		        			if(this.querydata.vieworedit == "view"){
								this.$router.go(-1)
								return false;
		        			}
		        		}else if(pagefromview == true){
		        			for(let i=0,len=this.globalconfig.showingpagedlgqueue.length;i<len;i++){
			            		for(var k in this.globalconfig.showingpagedlgqueue[i]){
			            			if(this.globalconfig.showingpagedlgqueue[i][k] == true){
			            				this.globalconfig.showingpagedlgqueue[i][k] = false
			            				this.globalconfig.showingpagedlgqueue.pop()
			            				this.$router.go(0)
			            				break
			            			}
			            			
			            		}
			            	}
		        			return false;
		        		}
		             	
		             	
		             	for(var key in this.formInline){
		            		if(typeof(this.formInline[key]) == "object"){
		            			this.formInline[key] = this.formInline[key].getTime()
		            		}
		            	}
		            	//这里可以通过 全局变量找到 从哪里点击的按钮让提交页面展示
						var len = this.globalconfig.showingpagedlgqueue.length
						if(len > 0) {
							this.querydata.itemid = this.globalconfig.showingpagedlgqueue[len - 1].itemid

							for(var i = 0, len = this.globalconfig.showingpagedlgqueue.length; i < len; i++) {
								//遍历对象
								for(var k in this.globalconfig.showingpagedlgqueue[i]) {
									if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
										if(this.globalconfig.showingpagedlgqueue[i].itemid) {
											this.querydata.itemid = this.globalconfig.showingpagedlgqueue[i].itemid
										}
									}
								}
							}
						}
						
						if(parentid != ""){
							this.formInline.parentid = parentid
						}else if(this.globalconfig.parentid !=""){
							this.formInline.parentid = this.globalconfig.parentid
						}
		            	if(generatedataid == "") {
							//不能提交数据
						} else {
							var parentstr = getCookie('parent')
							var parentobj = {}
							if(parentstr){
								parentobj = JSON.parse(parentstr)
							}
							if(this.querydata.itemid){
								this.$http.get(this.globalconfig.updatedataapi, {
										params: {
											usrid: window.localStorage.getItem("usrid"),
											flowid: ownflowid, //目前的url中，基本都是flowid.
											nodeid: ownnodeid,
											itemid:this.querydata.itemid,
											submitinfo: JSON.stringify(this.formInline),
										}
									}, {
										emulateJSON: true
									})
									.then((response) => {
										if(response.data.error){
												//当前的itemid 不是这个流程里的数据的id，所以要给这个流程提交一次数据
												this.$http.get(this.globalconfig.submitdataapi, {
													params: {
														usrid: window.localStorage.getItem("usrid"),
														flowid: ownflowid, //目前的url中，基本都是flowid.
														nodeid: ownnodeid,
														id: generatedataid,
														submitinfo: JSON.stringify(this.formInline),
													}
												}, {
													emulateJSON: true
												})
												.then((response) => {
													parentid = ""
													let showinmodalorjump = false
													if(parentobj.pageid){
														var pageid = parentobj.pageid
														if(pageid == ownpageid){
															delCookie("parent")
														}
													}
													for(let i = 0, len = this.globalconfig.showingpagedlgqueue.length; i < len; i++) {
														for(var k in this.globalconfig.showingpagedlgqueue[i]) {
															if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
																this.globalconfig.showingpagedlgqueue[i][k] = false
																this.globalconfig.showingpagedlgqueue.pop()
																showinmodalorjump = true
																this.$router.go(0)
																break
															}
						
														}
													}
													if(!showinmodalorjump) {
														this.$router.go(-1)
													}
												}, () => {
													this.$Message.success('这是一条失败的提示');
												});										
										}else if(response.data.org){
											//更新数据成功
											parentid = ""
											let showinmodalorjump = false
											if(parentobj.pageid){
												var pageid = parentobj.pageid
												if(pageid == ownpageid){
													delCookie("parent")
												}
											}
											for(let i = 0, len = this.globalconfig.showingpagedlgqueue.length; i < len; i++) {
												for(var k in this.globalconfig.showingpagedlgqueue[i]) {
													if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
														this.globalconfig.showingpagedlgqueue[i][k] = false
														this.globalconfig.showingpagedlgqueue.pop()
														showinmodalorjump = true
														this.$router.go(0)
														break
													}
			
												}
											}
											if(!showinmodalorjump) {
												this.$router.go(-1)
											}
										}
									}, () => {
										this.$Message.success('这是一条失败的提示');
									});
							}else{
								//提交数据
								this.$http.get(this.globalconfig.submitdataapi, {
										params: {
											usrid: window.localStorage.getItem("usrid"),
											flowid: ownflowid, //目前的url中，基本都是flowid.
											nodeid: ownnodeid,
											id: generatedataid,
											submitinfo: JSON.stringify(this.formInline),
										}
									}, {
										emulateJSON: true
									})
									.then((response) => {
										parentid = ""
										let showinmodalorjump = false
										if(parentobj.pageid){
											var pageid = parentobj.pageid
											if(pageid == ownpageid){
												console.log("删除cookie成功")
												delCookie("parent")
											}
										}
										for(let i = 0, len = this.globalconfig.showingpagedlgqueue.length; i < len; i++) {
											for(var k in this.globalconfig.showingpagedlgqueue[i]) {
												if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
													this.globalconfig.showingpagedlgqueue[i][k] = false
													this.globalconfig.showingpagedlgqueue.pop()
													showinmodalorjump = true
													this.$router.go(0)
													break
												}
			
											}
										}
										if(!showinmodalorjump) {
											this.$router.go(-1)
										}
									}, () => {
										this.$Message.success('这是一条失败的提示');
									});
							}
						}
	            	} else {
						this.$Message.error('表单验证失败!');
					}
				})
            },
            changeselect(key,str){
				var flowid = ""
				var flowidIndex = 0
				//通过str找到对应的flowid
				for(var i = 0; i < selectwords.length; i++) {
					if(selectwords[i].elabel == str) {
						flowid = selectwords[i].setInputflowid
						flowidIndex = i
					}
				}
				if(flowid == "") {
					return false
				}
				var flowdata = []
				if(flowdatas.length > 0){
					for(var j = 0; j < flowdatas.length; j++) {
						if(flowdatas[j].length > 0){
							if(flowdatas[j][0].flowid == flowid) {
								flowdata = flowdatas[j]
							}
						}
					}
				}
				if(flowdata.length == 0) {
					return false
				}
				//这里新增 下拉框联动
				
				var flowdataOnly = null
				var flowdataselects = []
				for(var z = 0; z < flowdata.length; z++) {
					for(var k in flowdata[z]) {
						if(key == flowdata[z][k]) {
							flowdataOnly = flowdata[z]
							flowdataselects.push(flowdata[z])
						}
					}
				}
				//联动 key
				var inputlinkkeydata = JSON.parse(selectwords[flowidIndex].inputlinkages)
				for(var x = 0; x < inputlinkkeydata.length; x++) {
					var ownkey = inputlinkkeydata[x].ownflowkey
					var otherkey = inputlinkkeydata[x].otherflowkey
					this.formInline[ownkey] = flowdataOnly[otherkey]
					var ownkeys = ownkey + 's'
					if(this[ownkeys]){
						this[ownkeys] = []
						for(var x=0,lfse=flowdataselects.length;x<lfse;x++){
							this[ownkeys].push({
								id:flowdataselects[x][otherkey],
								value:flowdataselects[x][otherkey]
							})
						}
					}
				}

			},
			smarthandler(){
				for(var i=0,alen=autoformsetdata.length;i<alen;i++){
					var atmp = i
					if(autoformsetdata[atmp].actions.length != 0){
						var flag = true
						for(var j=0,clen=autoformsetdata[atmp].conditions.length;j<clen;j++){
							var ctmp = j
							if(autoformsetdata[atmp].conditions[ctmp].type == "time"){
								//获取当前时间 当前月份
								//获取月底5天 或者 月初五天后 与当前时间比较 
								var date=new Date;
								var nowtimestamp = Date.parse(new Date());
								var year=date.getFullYear(); 
								var month=date.getMonth()+1;
								var nextmonth = month - 1;
							    var firstdate = '01'; //获取当前月第一天
							    month =(month<10 ? "0"+month:month); 
		 						var nowmonthstart = (year.toString()+"-"+month.toString()+"-"+firstdate);
							    var nowmonthstartstamp = Date.parse(new Date(nowmonthstart))
							    var day = new Date(year,month,0);
							    var lastdate = day.getDate();//获取当月最后一天日期
							    var nowmonthend = (year.toString()+"-"+month.toString()+"-"+lastdate)
							    var nowmonthendstamp = Date.parse(new Date(nowmonthend))
							    if(autoformsetdata[atmp].conditions[ctmp].key == "monthend"){
							    	//是月底
							    	var calcday = lastdate + Number(autoformsetdata[atmp].conditions[ctmp].value)
							    	//获取xx时间戳
							    	var calcdate = (year.toString()+"-"+month.toString()+"-"+calcday)
							    	var calcdatestamp = Date.parse(new Date(calcdate))
							    	if(autoformsetdata[atmp].conditions[ctmp].calc == ">"){
							    		//xx天到月底
							    		//获取xx天
							    		if(calcdatestamp < nowtimestamp  && nowtimestamp < nowmonthendstamp){
							    			flag = true
							    		}else{
							    			flag = false
							    		}
							    	}else{
							    		//月初到xx天
							    		if(nowmonthstartstamp < nowtimestamp  && nowtimestamp < calcdatestamp){
							    			flag = true
							    		}else{
							    			flag = false
							    		}
							    	}
							    }else if(autoformsetdata[atmp].conditions[ctmp].key == "month"){
							    	//月初
							    	var calcday = 1 + Number(autoformsetdata[atmp].conditions[ctmp].value)
							    	//获取xx时间戳
							    	var calcdate = (year.toString()+"-"+month.toString()+"-"+calcday)
							    	var calcdatestamp = Date.parse(new Date(calcdate))
							    	if(autoformsetdata[atmp].conditions[ctmp].calc == ">"){
							    		
							    		//月初到xx天
						    			if(nowmonthstartstamp < nowtimestamp  && nowtimestamp < calcdatestamp){
							    			flag = true
							    		}else{
							    			flag = false
							    		}
							    	}else{
							    		//xx天到月底
										if(calcdatestamp < nowtimestamp  && nowtimestamp < nowmonthendstamp){							    		
							    			flag = true
							    		}else{
							    			flag = false
							    		}
							    	}
							    }
							}else if(autoformsetdata[atmp].conditions[ctmp].type == "who"){
								//先只判断是不是自己
								if(autoformsetdata[atmp].conditions[ctmp].value == window.localStorage.getItem("usrid")){
									flag = true
								}else{
									flag = false
								}
							}
						}
						if(flag == true){
							//doaction
							for(var x=0,aclen=autoformsetdata[atmp].actions.length;x<aclen;x++){
								var actmp = x
								this.warninglabels[autoformsetdata[atmp].warningkey] = true
								if(autoformsetdata[atmp].actions[actmp].action == "hide"){
									this.showformInline[autoformsetdata[atmp].actions[actmp].type] = false
								}
								if(autoformsetdata[atmp].actions[actmp].action == "show"){
									this.showformInline[autoformsetdata[atmp].actions[actmp].type] = true
								}
							}
						}
					}
				}
			}
        },
        beforeCreate:function(){
        	this.$http.get(this.globalconfig.getpageapi,
			{
			    params:{
			        flowid: ownflowid,//目前的url中，基本都是flowid.
			        nodeid:ownnodeid,
			        pageid:ownpageid
			    }
			},  {emulateJSON: true})
			.then((response) => {
			    var inputsui = JSON.parse(response.data.page.inputsui)
			    var ret = {}
				if(inputsui){
					for(var i=0;i<inputsui.length;i++){
				    	if(inputsui[i].child){
				    		for(var j=0;j<inputsui[i].child.length;j++){
				    			for(var k in this.ruleValidate){
				    				if(k == inputsui[i].child[j].elabel){
				    					if(inputsui[i].child[j].eltype != "input"){
				    						this.ruleValidate[k] = []
				    					}
				    				}
				    			}
				    		}
				    	}
				    }
				}
			}, () => {
			    this.$Message.success('这是一条失败的提示');
			});
        },
        mounted:function(){
        	this.generatedataid()
        	this.handleQuery()
			this.smarthandler()
        },
    }

    function generateDatamodel () {
        var item = {};
        return item;
    }
    
    function generateruleValidate(){
		var rules = generateDatamodel()
		var ret = {}
		for(var k in rules){
			ret[k] = []
			ret[k].push({
				required: true, 
				message: '不能为空', 
				trigger: 'blur'
			})
		}
		return ret
	}
    
    function generateDataIfShowmodel () {
            var itemshow = {};
            for(var k in itemshow){
            	itemshow[k] = true
            }
            itemshow.backbtn = false
            return itemshow;
    }
    
    function generatewarning(){
			var warningitem = {};
			for(var k in warningitem){
	        	warningitem[k] = false
	        }
	        return warningitem;
	}
    
    function genwratedisabled(){
		var disableditem = generateDatamodel()
		for(var k in disableditem) {
			disableditem[k] = false
		}
		return disableditem;
	}
    
	function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }
	
	//数组去重
	function uniqueArray(ar) {
	    var ret = [];
	
	    ar.forEach(function(e, i, ar) {
	        if (ar.indexOf(e) === i) {
	            ret.push(e);
	        }
	    });
	
	    return ret;
	}
	
	//设置cookie
	function setCookie(name,value){
		var Days = 1;  //过期时间设置为一天
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	
	//删除cookie
	function delCookie(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null)
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
	
	//获取cookie
	function getCookie(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return null;
		}
	}
</script>
