<style scoped>


</style>

<template>

    <div class="form">
        <div id = "addtubiao1"> </div>
        <i-form ref:form-validate :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Row><Col span="6"><RmyLabel40594913></RmyLabel40594913></Col><Col span="6"><RmyLabel40590723></RmyLabel40590723></Col><Col span="6"><RmyLabel40600636></RmyLabel40600636></Col><Col span="6"><RmyLabel40608812></RmyLabel40608812></Col></Row><Row><Col span="6"><RmyLabel40607958></RmyLabel40607958></Col><Col span="6"><RmyLabel40600343></RmyLabel40600343></Col><Col span="6"><RmyLabel40606029></RmyLabel40606029></Col><Col span="6"><RmyLabel40600543></RmyLabel40600543></Col></Row><Row><Col span="24"><RApprovehistory40601383></RApprovehistory40601383></Col></Row></div>
            
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
 import RApprovehistory40601383 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/Approvehistory40601383.vue'
 import RmyLabel40600543 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40600543.vue'
 import RmyLabel40606029 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40606029.vue'
 import RmyLabel40600343 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40600343.vue'
 import RmyLabel40607958 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40607958.vue'
 import RmyLabel40608812 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40608812.vue'
 import RmyLabel40600636 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40600636.vue'
 import RmyLabel40590723 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40590723.vue'
 import RmyLabel40594913 from '../../59a4d8e174f130944caa22fa/shenpibiaodan/myLabel40594913.vue'
	
	let ownflowid = "59a4d8e174f130944caa22fa"
	let ownnodeid = "shenpibiaodan"
	let ownpageid = "59a4d9f474f130944caa2301"
	
	export default {
    	components:{
RApprovehistory40601383,
RmyLabel40600543,
RmyLabel40606029,
RmyLabel40600343,
RmyLabel40607958,
RmyLabel40608812,
RmyLabel40600636,
RmyLabel40590723,
RmyLabel40594913,},
        data() {
            return {
                formInline: {
                	shenpicomments:'',
                	shenpistatus:''
                },
                ruleValidate: {
                },
                querydata:{
                	
                },
                pageishowwinthinmodal:this.globalconfig.showingpagedlgqueue
            }
        },
        watch:{
			pageishowwinthinmodal(){
				this.handleQuery()	
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
                            flowid: ownflowid,//目前的url中，基本都是flowid.
                            nodeid:ownnodeid,
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
                
            },
            handleQuery(){
            	if(this.$router.currentRoute.query){
        			this.querydata = this.$router.currentRoute.query
        		}
            	if(this.querydata.itemid == undefined){
        			this.querydata.itemid = ''
        		}
        		//从全局变量里面取itemid
				for(var i=0,ls=this.globalconfig.showingpagedlgqueue.length;i<ls;i++){
					for(var k in this.globalconfig.showingpagedlgqueue[i]){
						if(k == "flowid" || k == "nodeid" || k== "itemid"){
							continue
						}else{
							if(this.globalconfig.showingpagedlgqueue[i][k] == true){
								this.querydata.itemid = this.globalconfig.showingpagedlgqueue[i].itemid
							}
						}
					}
				}
            }
        },
        created:function(){
        	this.handleQuery()
        }
    }
</script>
