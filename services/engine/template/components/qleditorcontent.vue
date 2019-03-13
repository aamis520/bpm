<template>
	<div class="ql-editor">
		<p v-html="html"></p>
	</div>
</template>

<script>
	let qleditorsetskid = ""
	
	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
	
	export default {
        data(){
            return {
                html: "空数据",
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
		methods:{
        	handleQuery(){
        		//获取路由信息
        		if(this.$router.currentRoute.query){
        			this.querydata = this.$router.currentRoute.query
        		}
        		if(this.querydata.flowid == undefined){
        			this.querydata.flowid = getflowid(this.$router.currentRoute.path)
        		}
        		if(this.querydata.nodeid == undefined){
        			this.querydata.nodeid = getnodeid(this.$router.currentRoute.path)
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
        		//查询公告
        		this.$http.get(this.globalconfig.querybysk,
                    {
                        params: {
                            usrid: window.localStorage.getItem("usrid"),
                            flowid:ownflowid,
                            itemid:this.querydata.itemid,
                            skid:qleditorsetskid
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                        console.log(response)
                        var content = response.data.value
                        this.html = content
                        console.log(content)
                        this.$Message.success('这是一条成功的提示');
                    }, () => {
                        this.$Message.success('这是一条失败的提示');
                    });
        			
        	}
        },
        mounted : function () {
        	this.handleQuery()
        }
	}
	
	function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }
</script>

<style>
</style>