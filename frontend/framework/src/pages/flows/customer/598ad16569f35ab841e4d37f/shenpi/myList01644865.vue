
<template>
    <section>
    	<Table :columns="columns" :data="data"></Table>
    	<div style=" width: 100%;height: 50px;">
	    	<div style="float: right;padding: 15px 0;">
		        <Page :total="pageCount" :current="1" @on-change="changePage"></Page>
		    </div>
	    </div>
	    <Modal
    		width = "1200"
	        v-model="showviewpage"
	        @on-cancel="cancel">
          	<p slot="header">
    			<span>{{showmviewodaltitle}}</span>
          	</p>
			        
	        <div id="viewpagetobeadd"></div>
			<div slot="footer"></div>
        </Modal>
        <Modal
    		width = "1200"
	        v-model="showeditpage"
	        @on-cancel="cancel">
          	<p slot="header">
    			<span>{{showeditmodaltitle}}</span>
          	</p>
			        
	        <div id="editpagetobeadd"></div>
			<div slot="footer"></div>
        </Modal>
    </section>
</template>
<script>
	let importstart;
	
	let ownflowid = "598ad16569f35ab841e4d37f"
	let ownnodeid = "shenpi"
	let ownpageid = "598ad27f367b7ce8401a20fe"
	
	let pageviewid = ""
	let pageeditid = ""
	let setnew = [{"title":"姓名","key":"xingming"},{"title":"收入","key":"shouru"},{"title":"上班时间","key":"shangbanshijian"},{"title":"下班时间","key":"xiabanshijian"},{"title":"支出","key":"zhichu"}];
	
	let tableData = null
	
	let showmodal = {}
    export default {
    	components:{},
        data () {
            return {
            	showviewpage:false,
            	showeditpage:false,
            	dialogindex: -1,
            	showmviewodaltitle:"查看",
            	showeditmodaltitle:"编辑",
                columns: [
                    
                ],
                data: [],
                pageCount:10,
                pageData:null,
                flowid:getflowid(this.$router.currentRoute.path),
                nodeid:getnodeid(this.$router.currentRoute.path)
            }
        },
        watch:{
			showviewpage(){
				if(this.dialogindex == -1){
					return false;
				}else if(!this.globalconfig.showingpagedlgqueue[this.dialogindex-1]){
					return false;
				}else{
					return this.globalconfig.showingpagedlgqueue[this.dialogindex-1][ownpageid]
				}
			},
			showeditpage(){
				if(this.dialogindex == -1){
					return false;
				}else if(!this.globalconfig.showingpagedlgqueue[this.dialogindex-1]){
					return false;
				}else{
					return this.globalconfig.showingpagedlgqueue[this.dialogindex-1][ownpageid]
				}
			},
		},
        methods:{
        	handleQuery() {
        		//添加按钮
        		if(pageeditid != "" && pageviewid != "") {
			        setnew.push({
						title:"操作",
						key:"edit",
						width:150,
						align:"center",
						render:(h,params) =>{
							return h('div',[
								h('button',{
									attrs:{
										'class':'ivu-btn ivu-btn-info ivu-btn-small'
									},
									style: {
                                        marginRight: '5px'
                                    },
									on:{
										click:() =>{
											this.edit(params.index)
										}
									}
								},'编辑'),
								h('button',{
									attrs:{
										'class':'ivu-btn ivu-btn-success ivu-btn-small'
									},
									style: {
                                        marginRight: '5px'
                                    },
									on:{
										click:() =>{
											this.view(params.index)
										}
									}
								},'查看')
							])
						}
					});
			        this.pageeditid = pageeditid;
			        this.pageviewid = pageviewid;
		        }
        		this.columns = setnew
                this.$http.get(this.globalconfig.listsks,
                    {
                        params: {
                            usrid: window.localStorage.getItem("usrid"),
                            flowid:this.flowid,
                            nodeid:this.nodeid,
                            submitinfo: JSON.stringify(this.formInline),
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                        this.data = response.body.data;
                        tableData = response.body.data;
	                	this.pageCount = tableData.length
	                    this.data = this.showTable()
                        this.$Message.success('这是一条成功的提示');
                    }, () => {
                        this.$Message.success('这是一条失败的提示');
                    });
            },
            //分页改变
            changePage(index){
            	if(this.pageData == null){
            		this.pageData = tableData
            	}
            	this.pageCount = this.pageData.length
            	let changeData = []
            	if(this.pageData.length > 10*index){
            		for(let i=((index-1)*10);i<10*index;i++){
            			changeData.push(this.pageData[i])
            		}
            	}else{
            		for(let i=((index-1)*10);i<this.pageData.length;i++){
            			changeData.push(this.pageData[i])
            		}
            	}
            	this.data = changeData
            },
            //表格只显示10条数据
            showTable(){
            	let data = []
            	let len = tableData.length
            	if(len>10){
	            	for(let i=0;i<10;i++){
						data.push(tableData[i])          		
	            	}
            	}else{
            		for(let i=0;i<len;i++){
						data.push(tableData[i])          		
	            	}
            	}
            	return data
            },
            //view
            view(index){
            	let flag = 'view'
            	this.getInfo(this.pageviewid,index,flag)
            },
            //edit
            edit(index){
            	let flag = 'edit'
            	this.getInfo(this.pageeditid,index,flag)
            },
            //
            getInfo(page,index,flag){
            	if(page !=""){
	            	var id = page
	            	//获取filename
	            	this.$http.get(this.globalconfig.getpageapi,
	                {
	                    params: {
	                        flowid:this.flowid,
	                        nodeid:this.nodeid,
	                        pageid:id
	                    }
	                }, {emulateJSON: true})
	                .then((response) => {
	                    this.path = response.data.page.filename
	                    if(this.path != undefined){
		                    this.$Message.success('这是一条成功的提示');
		                    var path = "./" +this.flowid+"|"+this.nodeid+"|"+ this.path
		                    var itemid = this.data[index].id
		                    if(flag == "view"){
		                    	if(showmodal.viewinmodal == false){
		                    		this.$router.push({
					            		path:path,
					            		query:{
					            			flowid:this.flowid,
					            			nodeid:this.nodeid,
					            			itemid:itemid,
					            			usrid:window.localStorage.getItem("usrid")
					            		}
					            	})
		                    	}else{
		                    		this.showviewpage = true
		                    		var newObj = {}
				                	newObj[ownpageid] = true
				                	newObj.flowid = ownflowid
				                	newObj.nodeid = ownnodeid
				                	newObj.itemid = itemid
				                	this.dialogindex = this.globalconfig.showingpagedlgqueue.push(newObj)
				                	console.log(this.globalconfig.showingpagedlgqueue)
		                    	}
		                    }else if(flag == "edit"){
		                    	if(showmodal.editinmodal == false){
		                    		this.$router.push({
					            		path:path,
					            		query:{
					            			flowid:this.flowid,
					            			nodeid:this.nodeid,
					            			itemid:itemid,
					            			usrid:window.localStorage.getItem("usrid")
					            		}
					            	})
		                    	}else{
		                    		this.showeditpage = true
		                    		//同时往 全局变量里面存储数据
		                    		var newObj = {}
				                	newObj[ownpageid] = true
				                	newObj.flowid = ownflowid
				                	newObj.nodeid = ownnodeid
				                	newObj.itemid = itemid
				                	this.dialogindex = this.globalconfig.showingpagedlgqueue.push(newObj)
				                	console.log(this.globalconfig.showingpagedlgqueue)
		                    	}
		                    }
	                    }else{
	                    	this.$Message.success('未找到页面信息');
	                    }
	                }, () => {
	                    this.$Message.success('这是一条失败的提示');
	                });
            	}
                    
            },
            cancel(){
            	for(var k in this.globalconfig.showingpagedlgqueue[i]){
        			if(this.globalconfig.showingpagedlgqueue[i][k] == true){
        				this.globalconfig.showingpagedlgqueue[i][k] == false
        				break
        			}
        		}
            	this.globalconfig.showingpagedlgqueue.pop()
            	console.log(this.globalconfig.showingpagedlgqueue)
            	this.dialogindex--
            }
        },
        
        created:function(){
        	 this.handleQuery();
        }
    }
    function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }
</script>

