<style scoped>


</style>

<template>

    <div class="form">
        <div id = "addtubiao1"> </div>
        <i-form ref:form-validate :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><RmyList52735828></RmyList52735828></div>
            
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
 import RmyList52735828 from '../../598c06c9d8c099d44493319c/shenpi/myList52735828.vue'
	
	let ownflowid = "598c06c9d8c099d44493319c"
	let ownnodeid = "shenpi"
	let ownpageid = "598c07a4d8c099d4449331a3"
	
	export default {
    	components:{
RmyList52735828,},
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
                this.$http.get(this.globalconfig.submitapprove,
                    {
                        params:{
                            usrid:window.localStorage.getItem("usrid"),
                            flowid: flowid,//目前的url中，基本都是flowid.
                            nodeid:nodeid,
                            approveinfo:JSON.stringify(this.formInline),
                            itemid:''
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
</script>
