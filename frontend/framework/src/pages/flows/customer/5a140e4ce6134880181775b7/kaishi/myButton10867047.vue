
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
<ziliuchengtijiaobiaodan></ziliuchengtijiaobiaodan></div>
			<div slot="footer"></div>
        </Modal>
    </section>
</template>

<script>
	let importstart;
import ziliuchengtijiaobiaodan from '../../5a141043e6134880181775c1/ziliucheng/ziliuchengtijiaobiaodan.vue'

	
	let ownflowid = "5a140e4ce6134880181775b7"
	let ownnodeid = "kaishi"
	let ownpageid = "5a141062e6134880181775c2"
	
	let showatmodal = "true"
	let showmodaltitle = "MOdal"
    export default {
    	components:{
ziliuchengtijiaobiaodan, },
    	data (){
    		return {
    			querydata:{},
    			showpage:false,
    			dialogindex: -1,
    			showmodaltitle:'模态框设置'
    		}
    	},
    	watch:{
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
                	this.$router.push({ path:'./5a141043e6134880181775c1|ziliucheng|ziliuchengtijiaobiaodan'})
                }else if(showatmodal == "true"){
                	//显示modal
                	this.showmodaltitle = showmodaltitle
                	this.showpage = true
                	var newObj = {}
                	newObj[ownpageid] = true
                	newObj.flowid = ownflowid
                	newObj.nodeid = ownnodeid
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
