<template>
    <section>
    	<Button type="info" opentype="page"  @click="onclick"><span>信息按钮</span></Button>
    	<Modal
    		width = "1200"
	        v-model="showpage"
			:transfer=false
	        @on-cancel="cancel">
          	<p slot="header">
    			<span>{{showmodaltitle}}</span>
          	</p>
			        
	        <div id="pagetobeadd"></div>
			<div slot="footer"></div>
        </Modal>
    </section>
</template>

<script>
	let importstart;
	
	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
	
	let showatmodal = ""
	let showmodaltitle = ""
    export default {
    	components:{},
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
				//如果有cookie("parent"),证明这个是子数据的新建 -- 2017-12-1
				var parentData = JSON.parse(getCookie("parent"));//得到cookie--parent
				if(parentData == null){ //这个是主数据的新建--cookie中有dataid：自己生成的id，并作为子数据的parentid
					this.$http.get(this.globalconfig.generatedataidapi,
					{
						params: {
							flowid:ownflowid
						}
					}, {emulateJSON: true})
					.then((response) => {
						var objtemp = {};
						objtemp.dataid = response.body.id;
						objtemp.type = "new";
						var objstr = JSON.stringify(objtemp);
						setCookie('parent', objstr);
					}, () => {
						this.$Message.success('这是一条失败的提示');
					});
				}
                if(showatmodal == "" || showatmodal == "false"){//跳转到对应的提交表单路由
                	//path是需要被转成新值的。
					var queryPatams = {};
					if(JSON.parse(getCookie("parent")) && JSON.parse(getCookie("parent")).dataid){
						queryPatams.parentid = JSON.parse(getCookie("parent")).dataid
					}
					var pathobj = { path:'test'};
					pathobj.query = queryPatams;
					this.$router.push(pathobj);
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
	function setCookie(name,value){
		var Days = 1;  //过期时间设置为一天
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
</script>
