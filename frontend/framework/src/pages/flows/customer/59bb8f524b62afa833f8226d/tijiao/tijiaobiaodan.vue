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
		font-size: 14px;
		margin: 10px 0;
		color: orangered;
		padding: 5px;
		background: #fff;
	}
</style>

<template>

    <div class="tabform">
    	<div id="warningdivs"></div>
        <Form ref="formInline" :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Row><Col span="24"><Form-item v-show="showformInline.shenqingren" prop="shenqingren" label="申请人"><i-input v-model.trim="formInline.shenqingren" disabled  placeholder="请输入..."></i-input></Form-item>
</Col></Row><Row><Col span="24"><Form-item v-show="showformInline.shenqingjine" prop="shenqingjine" label="申请金额"><i-input v-model.trim="formInline.shenqingjine" placeholder="请输入..."></i-input></Form-item>
</Col></Row><Row><Col span="24"><Form-item v-show="showformInline.shenqingliyou" prop="shenqingliyou" label="申请理由"><i-input v-model.trim="formInline.shenqingliyou" placeholder="请输入..."></i-input></Form-item>
</Col></Row><Row><Col span="24"><Form-item v-show="showformInline.shenqingshijian" prop="shenqingshijian" label="申请时间"><Date-picker type="date" placeholder="选择日期" format="yyyy年MM月dd日" v-model.trim="formInline.shenqingshijian" ></Date-picker></Form-item>
</Col></Row></div>
            
            <FormItem v-show="showformInline.submitbtn" style="text-align: right;">
				<Button type="primary" @click.native="handleSubmit('formInline')">提交</Button>
			</FormItem>
			<FormItem v-show="showformInline.backbtn" style="text-align: right;">
				<Button type="success" @click.native="backprevpage">返回上一页</Button>
			</FormItem>

        </Form>
		<div style="display: none;"></div>
		<div style="border: none;display: none;">
    		{{newitemcreate}}
    	</div>
    </div>
	
</template>

<script>
	import { VueEditor } from 'vue2-editor'
	
	let importstart;
	let selectwords=[];
	
	let inputsettings = [{"eltype":"input","label":"申请人","elabel":"shenqingren","live":1,"value":"","index":"0","issetInput":true,"setvaluebysystem":true,"keyofsetinputvalue":"system-myself"}];
	let autoformsetdata = [];
	
	let ownflowid = "59bb8f524b62afa833f8226d"
	let ownnodeid = "tijiao"
	let ownpageid = "59bb90084b62afa833f8226f"
	let newitemid = null
	let pagefromview = false  //是否为查看按钮跳转过来的
	let flowdatas = []
    export default {
    	components:{VueEditor},
        data() {
            return {
                formInline: generateDatamodel(),
                showformInline:generateDataIfShowmodel(),
                warninglabels:generatewarning(),
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
                parentid:"",
                pageishowwinthinmodal:this.globalconfig.showingpagedlgqueue,
                selectdatas:"",
                pageid:''
            }
        },
        watch:{
			pageishowwinthinmodal(){
				this.handleQuery()	
			}
		},
        methods: {
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
        		
        		//从全局变量里面取itemid
				for(var i=0,ls=this.globalconfig.showingpagedlgqueue.length;i<ls;i++){
					for(var k in this.globalconfig.showingpagedlgqueue[i]){
						if(k == "flowid" || k == "nodeid" || k== "itemid" || k== "vieworedit"){
							continue
						}else{
							if(this.globalconfig.showingpagedlgqueue[i][k] == true){
								this.querydata.itemid = this.globalconfig.showingpagedlgqueue[i].itemid
								if(this.globalconfig.showingpagedlgqueue[i].vieworedit){
									if(this.globalconfig.showingpagedlgqueue[i].vieworedit == "view"){
										pagefromview = true
									}
								}
							}
						}
					}
				}
				
				this.$nextTick(function(){
	        		if(this.querydata.vieworedit || pagefromview == true){
	        			if(this.querydata.vieworedit == "view" || pagefromview == true){
	        				//将多有的input 设置为不可用状态
							var inputs = document.getElementsByClassName("ivu-input")
							for(var i=0,linput=inputs.length;i<linput;i++){
								
								if(/layouttobeadd/.test(inputs[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("id"))){
									
									inputs[i].setAttribute("disabled","disabled")
								}
							}
							
	        			}
	        		}
        		})
				
        		if(this.querydata.itemid){
        			this.$http.get(this.globalconfig.listbyitemid,
		            {
		                params: {
		                    usrid: window.localStorage.getItem("usrid"),
		                    flowid:ownflowid,
		                    itemid:this.querydata.itemid
		                }
		            }, {emulateJSON: true})
		            .then((response) => {
		            	var info = response.data.info
		            	var editData = {}
		            	for(var k in info){
		            		for(var key in this.formInline){
		            			if(k == key){
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
					if(inputsettings.length > 0) {
						for(var x = 0, li = inputsettings.length; x < li; x++) {
							if(inputsettings[x].issetInput) {
								if(inputsettings[x].setvaluebysystem) {
									queryinputvaluebysystem.push(inputsettings[x])
								} else if(inputsettings[x].setInputValueFromkeyword){
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
		            	var mybossid = myselfandmyboss.mybossid
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
			            	console.log(value)
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
										//获取这个流程的所有数据
										_self.$http.get(_self.globalconfig.queryalldatabyflowid, {
												params: {
													urid:window.localStorage.getItem("usrid"),
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
        	},
            handleSubmit(name) {
            	this.querydata.itemid = newitemid
//				this.$refs[name].validate((valid) => {
//					if(valid) {
						//从列表的查看按钮查看原表单 点击提交 为关闭对话框 或者返回上一页
						if(this.querydata.vieworedit) {
							if(this.querydata.vieworedit == "view") {
								this.$router.go(-1)
								return false;
							}
						} else if(pagefromview == true) {
							for(let i = 0, len = this.globalconfig.showingpagedlgqueue.length; i < len; i++) {
								for(var k in this.globalconfig.showingpagedlgqueue[i]) {
									if(this.globalconfig.showingpagedlgqueue[i][k] == true) {
										this.globalconfig.showingpagedlgqueue[i][k] = false
										this.globalconfig.showingpagedlgqueue.pop()
										this.$router.go(0)
										break
									}

								}
							}
							return false;
						}

						for(var key in this.formInline) {
							if(typeof(this.formInline[key]) == "object") {
								console.log(this.formInline[key].getTime())
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
										this.formInline.parentId = k
										this.querydata.flowid = this.globalconfig.showingpagedlgqueue[i].flowid
										this.querydata.nodeid = this.globalconfig.showingpagedlgqueue[i].nodeid
										if(this.globalconfig.showingpagedlgqueue[i].itemid) {
											this.querydata.itemid = this.globalconfig.showingpagedlgqueue[i].itemid
										}
									}
								}
							}
						}
						//表单验证后 提交数据 并处理全局变量
						if(newitemid == "") {
							//不能提交数据
						} else {
							this.$http.get(this.globalconfig.updatedataapi, {
									params: {
										usrid: window.localStorage.getItem("usrid"),
										flowid: ownflowid, //目前的url中，基本都是flowid.
										nodeid: ownnodeid,
										itemid: newitemid,
										submitinfo: JSON.stringify(this.formInline),
									}
								}, {
									emulateJSON: true
								})
								.then((response) => {
									let showinmodalorjump = false
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
//					} else {
//						this.$Message.error('表单验证失败!');
//					}
//				})
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
				for(var j = 0; j < flowdatas.length; j++) {
					if(flowdatas[j][0].flowid == flowid) {
						flowdata = flowdatas[j]
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
						console.log("我是下拉框")
						console.log(flowdataselects)
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
							    			console.log(1111)
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
        computed:{
        	newitemcreate(){
        		var vals = generateDatamodel()
        		var key = ""
        		for(var k in vals){
        			key = k
        			break
        		}
        		if(this.formInline[key] !== ""){
        			//这个时候提交空数据
        			
        			//先提交空数据
	        		if(!this.querydata.itemid || this.querydata.itemid == "" ||this.querydata.itemid == undefined || this.querydata.itemid == null){
	        			this.$http.get(this.globalconfig.submitdataapi,
	        			{
	        			    params:{
	        			        usrid:window.localStorage.getItem("usrid"),
	        			        flowid: ownflowid,//目前的url中，基本都是flowid.
	        			        nodeid:ownnodeid,
	        			        submitinfo:JSON.stringify(this.formInline),
	        			    }
	        			},  {emulateJSON: true})
	        			.then((response) => {
	        			    console.log(response)
	        			    var firstdata = response.data
	        			    this.parentid = firstdata.itemid
	        			    console.log(this.parentid)
	        			    this.querydata.itemid = firstdata.itemid
	        			     newitemid = firstdata.itemid
	        			}, () => {
	        			    this.$Message.success('这是一条失败的提示');
	        			});
	        		}
        			
        		}
        		return this.formInline[key]
        		
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
					console.log(this.ruleValidate)
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
        	this.handleQuery()
			this.smarthandler()
        },
    }

    function generateDatamodel () {
            var item = {"shenqingren":"","shenqingjine":"","shenqingliyou":"","shenqingshijian":""};
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
            var itemshow = {"shenqingren":"","shenqingjine":"","shenqingliyou":"","shenqingshijian":"","submitbtn":"","backbtn":""};
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
</script>
