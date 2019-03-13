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
        <Form ref="formInline" :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Row><Col span="24"><Form-item v-show="showformInline.aihao" prop="aihao" label="爱好"><i-input :disabled="disabledformInline.aihao" v-model.trim="formInline.aihao" placeholder="请输入..."></i-input></Form-item>
</Col></Row><Row><Col span="24"><Form-item v-show="showformInline.xingqu" prop="xingqu" label="兴趣"><i-input :disabled="disabledformInline.xingqu" v-model.trim="formInline.xingqu" placeholder="请输入..."></i-input></Form-item>
</Col></Row></div>

            <FormItem v-show="showformInline.submitbtn" style="text-align: right;">
				<Button type="primary" :disabled="disabledformInline.submitbtn" @click.native="handleSubmit('formInline')">提交</Button>
			</FormItem>
			<FormItem v-show="showformInline.backbtn" style="text-align: right;">
				<Button type="success" :disabled="disabledformInline.backbtn" @click.native="backprevpage">返回</Button>
			</FormItem>

        </Form>
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
	let selectwords=[];//下拉框

	let choosepersonsets=[];//人员选择

	let inputsettings = [];//设置为默认数据的输入框
	let autoformsetdata = [];//只能提交表单

	let generatedataid = ""

	let ownflowid = "5a140e4ce6134880181775b7"
	let ownnodeid = "kaishi"
	let ownpageid = "5a140f52e6134880181775bd"
	let newitemid = null
	let pagefromview = false  //是否为查看按钮跳转过来的
	let flowdatas = []//所有下拉框数据的集合
	let parentid = ""
	let showchilddata=false;//表单基础设置的选择
	let zhubeiObj = {};   //用来存放联动的主被动关系-下拉框的
	let transitArr = {};    //中转联动的原始数据 ---防止数据筛选后丢失(保存数据的字段是关键字后加个s)
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
                //
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
                querydata:{//存储路由得来的数据

                },
                parentid:"",
                pageishowwinthinmodal:this.globalconfig.showingpagedlgqueue,
                selectdatas:"",
                pageid:''
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
							this.showformInline.submitbtn = false;
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
					this.showformInline.submitbtn = true;
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
    				//如果有数据id 则不生成新的id
    				var idtemp = ""
    				if(!this.$router.currentRoute.query.itemid){
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

    				}else{
    					idtemp = this.$router.currentRoute.query.itemid
    					generatedataid = idtemp
		            	this.globalconfig.dataid = idtemp
    				}
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
        	handleQuery(){
        		if(this.$router.currentRoute.query){
        			this.querydata = this.$router.currentRoute.query
        		}
        		if(this.querydata.flowid == undefined){
        			this.querydata.flowid = getparaflowid(this.$router.currentRoute.path)
        		}
        		if(this.querydata.nodeid == undefined){
        			this.querydata.nodeid = getparanodeid(this.$router.currentRoute.path)
        		}

        		if(this.querydata.itemid) {
					//输入框不可用
					if(this.querydata.vieworedit == "view"){
						for(var kk in this.disabledformInline){
							this.disabledformInline[kk] = true
							this.disabledformInline.backbtn = false
							this.showformInline.backbtn = true
						}
						this.showformInline.submitbtn = false;
					}else{
						for(var kk in this.disabledformInline){
							this.disabledformInline[kk] = false
							this.disabledformInline.backbtn = true
							this.showformInline.backbtn = false
						}
						this.showformInline.submitbtn = true;
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
								/*begin by liuguochao 解决下拉款联动的问题*/
								if(selectwords[i].inputlinkages.length > 2){ //设置了数据联动
									var tempinputlinkages =  selectwords[i].inputlinkages;//联动关系的字符串
									tempinputlinkages = JSON.parse(tempinputlinkages)[0];
									//把跟这个下拉框有联动关系的放在全局对象zhubeiObj中
									if(tempinputlinkages.otherflowkey && tempinputlinkages.ownflowkey){
										zhubeiObj[tempinputlinkages.otherflowkey] = tempinputlinkages.ownflowkey;
									}
								}
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
										/*begin by liuguochao 解决下拉款联动的问题*/
										var zhudongxiang = [];
										var isLiandong = "";
										for(var attr in zhubeiObj){  //循环zhubeiObj，看看这个数据是不是有联动关系
											var index = attr;
											var value = zhubeiObj[attr]
											if(datas[0][index] && datas[0][value]){ // 证明这个数据是有联动关系的数据，切实被联动者
												isLiandong = index;
												break;
											}
										}
										if(isLiandong){ //遍历数据，把主联动项的标识放到临时数据中，随后发送给被联动数据
											for(let i=0;i<datas.length;i++){
												zhudongxiang.push(datas[i][isLiandong]);
											}
										}
										/*end by liuguochao 解决下拉款联动的问题*/

										for(var m = 0, ld = datas.length; m < ld; m++) {
											temparr.push(datas[m][k])
										}
										for(var n=0;n<temparr.length;n++){
											if(temparr[n]){
												_self[key].push({
													id: temparr[n],
													value: temparr[n],
													zhudongxiang:zhudongxiang[n]
												})		
											}
										}
										transitArr[key] = _self[key];
											_self[key] = uniqueArray(_self[key]);
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
				this.$refs[name].validate((valid) => {
					if(valid) {
						this.globalconfig.localrefresh++;
						this.$emit("transferUser",false);
						this.generatedataid();
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
										break
									}

								}
							}
							return false;
						}

						for(var key in this.formInline) {
							if(typeof(this.formInline[key]) == "object") {
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
						//表单验证后 提交数据 并处理全局变量
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
											nodeid: getrealnodeid(),
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
														nodeid: getrealnodeid(),
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
											nodeid: getrealnodeid(),
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
				var me = this;
				/*begin by liuguochao 解决下拉款联动的问题*/
				if(zhubeiObj[str]){  //是主联动项
					var tempData = transitArr[zhubeiObj[str]+"s"];
					var dataArr = [];
					for(let i=0;i<tempData.length;i++){
						if(tempData[i].zhudongxiang == key){
							dataArr.push(tempData[i]);
						}
					}
					me[zhubeiObj[str]+"s"] = dataArr;
					dataArr = [];
				}
				//end by liuguochao 解决下拉款联动的问题*/
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
        	//表单验证 待完善
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
            var item = {"aihao":"","xingqu":""};
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
            var itemshow = {"aihao":"","xingqu":"","submitbtn":"","backbtn":""};
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

	function getparaflowid (path) {
        return path.substr(1).split('|')[0]
  }

  function getparanodeid (path) {
      return path.substr(1).split('|')[1]
  }

  function getcookieflowid(){
      var obj = JSON.parse(getCookie('currentUserAction'));
      return obj.flowid;
  }

  function getcookienodeid(){
      var obj = JSON.parse(getCookie('currentUserAction'));
      return obj.nodeid;
  }
  function getrealnodeid(){
      if(ownflowid == getcookieflowid()){
          return getcookienodeid()
      }else{
          return ownnodeid
      }
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
