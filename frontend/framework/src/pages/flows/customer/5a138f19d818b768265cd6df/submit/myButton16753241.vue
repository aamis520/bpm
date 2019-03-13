
<template>
    <section>
    	<Button type="info" opentype="page"  @click="onclick"><span>新建</span></Button>
    	<Modal
    		width = "1200"
	        v-model="showpage"
			:transfer=false
	        @on-cancel="cancel">
          	<p slot="header">
    			<span>新建</span>
          	</p>
			        
	        <div id="pagetobeadd">
<tijiao></tijiao></div>
			<div slot="footer"></div>
        </Modal>
    </section>
</template>

<script>
	let importstart;
import tijiao from '../../5a138f19d818b768265cd6df/submit/tijiao.vue'

	
	let ownflowid = "5a138f19d818b768265cd6df"
	let ownnodeid = "submit"
	let ownpageid = "5a16371272c81ad02bd72766"
	
	let showatmodal = "true"
	let showmodaltitle = "去去去"
    export default {
    	components:{
tijiao, },
    	data (){
    		return {
    			querydata:{},
    			showpage:false,
    			dialogindex: -1,
    			showmodaltitle:'模态框设置',
				modalwatch:this.globalconfig
    		}
    	},
    	watch:{
			"modalwatch.showingpagedlgqueue":function(){   //这个监听只负责在提交后关闭模态框
				let me = this;
				let data = me.globalconfig.showingpagedlgqueue;
				let modalisshow  = false;
				if(data.length>0){
					for(let i=0;i<data.length;i++){
						if(data[i][ownpageid] !== undefined){
							modalisshow = data[i][ownpageid];
						}
					}
				} else {
					modalisshow = false;
				}
				if(modalisshow === false){
					me.showpage = modalisshow;
				}
			},
			showpage(){
				if(this.dialogindex == -1){
					return false;
				}else if(!this.globalconfig.showingpagedlgqueue[this.dialogindex-1]){
					return false;
				}else{
					return this.globalconfig.showingpagedlgqueue[this.dialogindex-1][ownpageid]
				}
			}
		},
        methods:{
            onclick(){
            	//将当前的itemid取出来
            	var itemid = ""
            	if(this.querydata.itemid){
            		itemid = this.querydata.itemid 
            	}else{
            		var len=this.globalconfig.showingpagedlgqueue.length
				
					if(len>0){
						for(var i=0,len=this.globalconfig.showingpagedlgqueue.length;i<len;i++){
		            		//遍历对象
		            		for(var k in this.globalconfig.showingpagedlgqueue[i]){
		            			if(this.globalconfig.showingpagedlgqueue[i][k] == true){
		            				if(this.globalconfig.showingpagedlgqueue[i].itemid){
		            					itemid = this.globalconfig.showingpagedlgqueue[i].itemid
		            				}
		            			}
		            		}
		            	}
					}
            	}
            	if(itemid != ""){
            		this.globalconfig.parentid = itemid
            	}
                if(showatmodal == "" || showatmodal == "false"){
                	//path是需要被转成新值的。
                	this.$router.push({ path:'./5a138f19d818b768265cd6df|submit|tijiao'})
                }else if(showatmodal == "true"){
                	//显示modal
                	this.showmodaltitle = showmodaltitle
                	this.showpage = true
                	var newObj = {}
                	newObj[ownpageid] = true
                	newObj.flowid = ownflowid
                	newObj.nodeid = ownnodeid
					newObj.showatmodal = true;
                	this.dialogindex = this.globalconfig.showingpagedlgqueue.push(newObj)
                }
            },
            cancel(){
            	this.globalconfig.showingpagedlgqueue[this.dialogindex-1][ownpageid] = false
            	this.globalconfig.showingpagedlgqueue.pop()
            	this.dialogindex--
            }
        },
        mounted:function(){
        	if(this.$router.currentRoute.query){
    			this.querydata = this.$router.currentRoute.query
    		}
        }
    }
</script>
