<style>
	
	.ivu-row .ivu-input,.ivu-row .ivu-date-picker,.ivu-row .ivu-select.ivu-select-single{
		width: 60%;
	}
	.ivu-input-icon-normal+.ivu-input{
		width: 100%;
	}
</style>

<template>

    <div class="tabform">
        <i-form ref:form-validate :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Row><Col span="24"><Form-item label="收入"><i-input v-model.trim="formInline.shouru" placeholder="请输入..."></i-input></Form-item>
</Col></Row></div>
            
            <Form-item>
                <i-button type="primary" @click.native="handleSubmit('formValidate')">提交</i-button>
            </Form-item>

        </i-form>

    </div>

</template>

<script>
	let importstart;
	
	let selectwords=[];
	
	let inputsettings = []; 
	
	let ownflowid = "598c06c9d8c099d44493319c"
	let ownnodeid = "tijiao"
	let ownpageid = "59a8d15b215275382d7a26af"
	
	let pagefromview = false  //是否为查看按钮跳转过来的
    export default {
    	components:{},
        data() {
            return {
                formInline: generateDatamodel(),
                ruleValidate: {
                },
                querydata:{
                	
                },
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
        	handleQuery(){
        		for(var k in this.formInline){
        			this.ruleValidate[k] = []
        			this.ruleValidate[k].push({
        				required:true,
                		message:"请输入...",
                		trigger:'blur'
        			})
        		}
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
								inputs[i].setAttribute("disabled","disabled")
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
        			if(selectwords instanceof Array){
        				var len = selectwords.length
        				if(len >0){
        					for(let i=0;i<len;i++){
								this.$http.get(this.globalconfig.querybysk,
					            {
					                params: {
					                    usrid: window.localStorage.getItem("usrid"),
					                    flowid:selectwords[i].setInputflowid,
					                    skid:selectwords[i].setInputword
					                }
					            }, {emulateJSON: true})
					            .then((response) => {
					            	var sk = response.data.sk
					            	var datas = response.data.info
					            	var k = sk.key
					            	var key = selectwords[i].elabel+"s"
					            	console.log(key)
					            	console.log(datas)
					            	for(var m=0,ld=datas.length;m<ld;m++){
					            		this[key].push({
					            			id:datas[m][k],
					            			value:datas[m][k]
					            		})
					            	}
					            	
						        }, () => {
					                this.$Message.success('这是一条失败的提示');
					            });
        					}
        				}
        			}
        		}
        	},
            handleSubmit(data) {
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
            			console.log(this.formInline[key].getTime())
            			this.formInline[key] = this.formInline[key].getTime()
            		}
            	}
            	//这里可以通过 全局变量找到 从哪里点击的按钮让提交页面展示
            	var len=this.globalconfig.showingpagedlgqueue.length
				if(len>0){
					this.querydata.itemid = this.globalconfig.showingpagedlgqueue[len-1].itemid
					
					for(var i=0,len=this.globalconfig.showingpagedlgqueue.length;i<len;i++){
	            		//遍历对象
	            		for(var k in this.globalconfig.showingpagedlgqueue[i]){
	            			if(this.globalconfig.showingpagedlgqueue[i][k] == true){
	            				this.formInline.parentId = k
	            				this.querydata.flowid = this.globalconfig.showingpagedlgqueue[i].flowid
	            				this.querydata.nodeid = this.globalconfig.showingpagedlgqueue[i].nodeid
	            				if(this.globalconfig.showingpagedlgqueue[i].itemid){
	            					this.querydata.itemid = this.globalconfig.showingpagedlgqueue[i].itemid
	            				}
	            			}
	            		}
	            	}
				}
            	//表单验证后 提交数据 并处理全局变量
                if(!this.querydata.itemid){
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
            		    this.$Message.success('这是一条成功的提示');
            		    let showinmodalorjump = false
		            	for(let i=0,len=this.globalconfig.showingpagedlgqueue.length;i<len;i++){
		            		for(var k in this.globalconfig.showingpagedlgqueue[i]){
		            			if(this.globalconfig.showingpagedlgqueue[i][k] == true){
		            				showinmodalorjump = true
		            				this.globalconfig.showingpagedlgqueue[i][k] = false
		            				this.globalconfig.showingpagedlgqueue.pop()
		            				this.$router.go(0)
		            				break
		            			}
		            			
		            		}
		            	}
		            	if(!showinmodalorjump){
		            		this.$router.go(-1)
		            	}
            		}, () => {
            		    this.$Message.success('这是一条失败的提示');
            		});
            	}else{
            		this.$http.get(this.globalconfig.updatedataapi,
            		{
            		    params:{
            		        usrid:window.localStorage.getItem("usrid"),
            		        flowid: ownflowid,//目前的url中，基本都是flowid.
            		        nodeid:ownnodeid,
            		        itemid:this.querydata.itemid,
            		        submitinfo:JSON.stringify(this.formInline),
            		    }
            		},  {emulateJSON: true})
            		.then((response) => {
            		    let showinmodalorjump = false
						for(let i=0,len=this.globalconfig.showingpagedlgqueue.length;i<len;i++){
		            		for(var k in this.globalconfig.showingpagedlgqueue[i]){
		            			if(this.globalconfig.showingpagedlgqueue[i][k] == true){
		            				this.globalconfig.showingpagedlgqueue[i][k] = false
		            				this.globalconfig.showingpagedlgqueue.pop()
		            				showinmodalorjump = true
		            				this.$router.go(0)
		            				break
		            			}
		            			
		            		}
		            	}
		            	if(!showinmodalorjump){
		            		this.$router.go(-1)
		            	}
            		}, () => {
            		    this.$Message.success('这是一条失败的提示');
            		});
            	}
            },
            handleReset(data) {
                this.$Message.warning('这是一条警告的提示');
            }
        },
        created:function(){
        	this.handleQuery()
        }
    }

    function generateDatamodel () {
            var item = {"shouru":" "};
            return item;
    }
    
	function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }

</script>
