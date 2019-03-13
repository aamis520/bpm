<style scoped>

</style>

<template>

    <div class="form">
        <i-form ref:form-validate :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Form-item label="姓名"><i-input v-model.trim="formInline.xingming" placeholder="请输入..."></i-input></Form-item>
<Form-item label="收入"><i-input v-model.trim="formInline.shouru" placeholder="请输入..."></i-input></Form-item>
<Form-item label="事由"><i-input v-model.trim="formInline.shiyou" placeholder="请输入..."></i-input></Form-item>
</div>
            
            <Form-item>
                <i-button type="primary" @click.native="handleSubmit('formValidate')">提交</i-button>
            </Form-item>

        </i-form>

    </div>

</template>

<script>
	let importstart;
	
	let selectwords;
	
	let ownflowid = "599120d7a277a0f82795a143"
	let ownnodeid = "tijiao"
	let ownpageid = "59913aa91fe929800ab4cad5"
	
    export default {
    	components:{},
        data() {
            return {
                formInline: generateDatamodel(),
                ruleValidate: {
                },
                querydata:{
                	
                },
                selectdatas:"",
                pageid:''
            }
        },
        methods: {
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
        		if(this.querydata.itemid){
        			this.$http.get(this.globalconfig.listbyitemid,
		            {
		                params: {
		                    usrid: window.localStorage.getItem("usrid"),
		                    flowid:this.querydata.flowid,
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
        		//循环给下拉框赋值
        		var ids = []
        		if(selectwords){
        			if(selectwords instanceof Array){
        				var len = selectwords.length
        				if(len >0){
        					for(let i=0;i<len;i++){
        						ids.push(selectwords[i].setInputword)	
        					}
        					//发起请求
        					this.$http.get(this.globalconfig.querybyskids,
					            {
					                params: {
					                    usrid: window.localStorage.getItem("usrid"),
					                    flowid:this.querydata.flowid,
					                    ids:ids
					                }
					            }, {emulateJSON: true})
					            .then((response) => {
					            	var datas = response.data.datas
					            	var sks = response.data.sks
					            	for(let j=0,ld=datas.length;j<ld;j++){
					            		for(let m=0,ls=sks.length;m<ls;m++){
					            			var k = sks[m].key
					            			for(var n=0;n<len;n++){
					            				if(sks[m].id == selectwords[n].setInputword){
					            					var key = selectwords[n].elabel+'s'
					            					this[key].push({id:datas[j][k],value:datas[j][k]})
					            				}
					            			}
					            		}
					            	}
					            	
						        }, () => {
					                this.$Message.success('这是一条失败的提示');
					            });
        				}
        			}
        		}
        	},
            handleSubmit(data) {
            	//这里可以通过 全局变量找到 从哪里点击的按钮让提交页面展示
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
            	//表单验证后 提交数据 并处理全局变量
                if(!this.querydata.itemid){
            		this.$http.get(this.globalconfig.submitdataapi,
            		{
            		    params:{
            		        usrid:window.localStorage.getItem("usrid"),
            		        flowid: this.querydata.flowid,//目前的url中，基本都是flowid.
            		        nodeid:this.querydata.nodeid,
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
            		        flowid: this.querydata.flowid,//目前的url中，基本都是flowid.
            		        nodeid:this.querydata.nodeid,
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
            var item = {"xingming":" ","shouru":" ","shiyou":" "};
            return item;
    }
    
	function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }

</script>
