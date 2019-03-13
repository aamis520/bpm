<style scoped>


</style>

<template>

    <div class="form">
        <div id = "addtubiao1"> </div>
        <i-form ref="formInline" :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"><Row><Col span="12"><RmyLabel22748785></RmyLabel22748785></Col><Col span="12"><RmyLabel22741479></RmyLabel22741479></Col></Row><Row><Col span="12"><RmyLabel22757530></RmyLabel22757530></Col><Col span="12"><RmyLabel22774703></RmyLabel22774703></Col></Row><Row><Col span="6"><RmyLabel22777027></RmyLabel22777027></Col><Col span="6"><RmyLabel22779892></RmyLabel22779892></Col><Col span="6"><RmyLabel22786415></RmyLabel22786415></Col><Col span="6"><RmyLabel22787733></RmyLabel22787733></Col></Row><Row><Col span="24"><RApprovestep22797911></RApprovestep22797911></Col></Row></div>
            
            <!--文本域-->
            <Form-item label="审批意见">
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
 import RApprovestep22797911 from '../../599d4a5d52c0aae832e6656a/shenpishuju/Approvestep22797911.vue'
 import RmyLabel22787733 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22787733.vue'
 import RmyLabel22786415 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22786415.vue'
 import RmyLabel22779892 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22779892.vue'
 import RmyLabel22777027 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22777027.vue'
 import RmyLabel22774703 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22774703.vue'
 import RmyLabel22757530 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22757530.vue'
 import RmyLabel22741479 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22741479.vue'
 import RmyLabel22748785 from '../../599d4a5d52c0aae832e6656a/shenpishuju/myLabel22748785.vue'
	
	let ownflowid = "599d4a5d52c0aae832e6656a"
	let ownnodeid = "shenpishuju"
	let ownpageid = "599d4b0b52c0aae832e66571"
	
	export default {
    	components:{
RApprovestep22797911,
RmyLabel22787733,
RmyLabel22786415,
RmyLabel22779892,
RmyLabel22777027,
RmyLabel22774703,
RmyLabel22757530,
RmyLabel22741479,
RmyLabel22748785,},
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
