<template>
    <section>
	    <div class="form">
	        <Form ref:form-validate :model="formInline" :rules="ruleValidate" :label-width="80">
            	<div id = "layouttobeadd"></div>
            		
	            
	            
	            <FormItem>
	                <i-button type="primary" @click.native="handleSubmit('formValidate')">提交</i-button>
	                <i-button type="ghost" @click.native="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
	            </FormItem>
	        </Form>
	        <div style="display: none;"></div>
		</div>
    </section>
</template>

<script>
    let importstart;
    
    let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
    
    export default {
		components:{},
        data() {
            return {
                formInline: generateDatamodel(),
                ruleValidate: {
                },
                pageishowwinthinmodal:this.globalconfig.showingpagedlgqueue,
                querydata:{
                	
                },
                pageid:''
            }
        },
        watch:{
			pageishowwinthinmodal(){
				this.handleQuery()	
			}
		},
        computed:{},
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
        		if(!this.querydata.itemid){
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
        	},
            handleSubmit(data) {
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
            		.then(() => {
            		    this.$Message.success('这是一条成功的提示');
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
            		.then(() => {
            		    this.$Message.success('这是一条成功的提示');
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
            var item = {};
            return item;
    }
    
	function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }
</script>