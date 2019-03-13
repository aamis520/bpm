<style scoped>


</style>

<template>

    <div class="form">
        <div id = "addtubiao1"> </div>
        <i-form ref:form-validate :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Row><Col span="24"><RmyLabel51679650></RmyLabel51679650></Col></Row></div>
            
            <!--文本域-->
            <Form-item label="文本域">
	            <Input v-model="formInline.shenpicomments" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
	        </Form-item>
            <Form-item>
                <i-button type="primary" @click.native="agree('formValidate')">同意</i-button>
                <i-button type="ghost" @click.native="refuse('formValidate')" style="margin-left: 8px">拒绝</i-button>
            </Form-item>
        </i-form>

        <div id = "addtubiao2"> </div>
    </div>

</template>

<script> 
	let importstart;
 import RmyLabel51679650 from '../../59928f778a4a72140e78330d/shenpi/myLabel51679650.vue'
	
	let ownflowid = "59928f778a4a72140e78330d"
	let ownnodeid = "shenpi"
	let ownpageid = "599290108a4a72140e783312"
	
	export default {
    	components:{
RmyLabel51679650,},
        data() {
            return {
                formInline: {
                	shenpicomments:'',
                	shenpistatus:''
                },
                ruleValidate: {
                }
            }
        },
        methods: {
            agree(data) {
            	//审批的API
            	this.submitData(1)
                
            },
            refuse(data) {
                this.submitData(0)
            },
            submitData(x){
            	var flowid = this.$router.currentRoute.path.split('|')[0].split('/')[1];
				var nodeid = this.$router.currentRoute.path.split('|')[1]
				if(x == 1){
					this.formInline.shenpistatus = "approve"
				}else{
					this.formInline.shenpistatus = "deny"
				}
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
            	if(this.querydata.itemid){
            		this.$http.get(this.globalconfig.submitapprove,
                    {
                        params:{
                            usrid:window.localStorage.getItem("usrid"),
                            flowid: flowid,//目前的url中，基本都是flowid.
                            nodeid:nodeid,
                            approveinfo:JSON.stringify(this.formInline),
                            itemid:this.querydata.itemid
                        }
                    },  {emulateJSON: true})
                    .then(() => {
                        this.$Message.success('成功');
                        let showinmodalorjump = false
		            	for(let i=0,len=this.globalconfig.showingpagedlgqueue.length;i<len;i++){
		            		if(this.globalconfig.showingpagedlgqueue[i].show == true){
		            			this.globalconfig.showingpagedlgqueue[len-1].show = false
		            			showinmodalorjump = true
		            			this.$router.go(0)
		            			break
		            		}
		            	}
		            	if(!showinmodalorjump){
		            		this.$router.go(-1)
		            	}
                    }, () => {
                        this.$Message.success('失败');
                    });
            	}
                
            }
        }
    }
</script>
