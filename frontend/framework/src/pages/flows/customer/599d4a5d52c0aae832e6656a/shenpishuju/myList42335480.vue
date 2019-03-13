
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
			        
	        <div id="viewpagetobeadd"><shenpixiangqing></shenpixiangqing></div>
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
import shenpixiangqing from '../../599d4a5d52c0aae832e6656a/shenpishuju/shenpixiangqing.vue';

	
	let ownflowid = "599d4a5d52c0aae832e6656a"
	let ownnodeid = "shenpishuju"
	let ownpageid = "599d4b9852c0aae832e66572"
	
	let pageviewid = "599d4b0b52c0aae832e66571"
	let pageeditid = ""
	let setnew = [{"title":"申请人","key":"shenqingren"},{"title":"项目","key":"xiangmu"},{"title":"申请金额","key":"shenqingjine"},{"title":"理由","key":"liyou"}];
	
	let tableData = null
	
	let showmodal = {"viewinmodal":false,"editinmodal":false,"iscountBtn":false,"isfilterBtn":false,"isshowflowdata":false,"countTitle":"统计","countLabel":"tongji","filterColumn":"","countColumnStart":"","countColumnEnd":"","countColumnCalculation":"","filterkey":"","filtervaluebychoose":"","filtervaluebyfill":"","filterchoosesystemsk":false}
    export default {
    	components:{
shenpixiangqing,
},
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
        		//添加统计列
        		var iscountBtn = showmodal.iscountBtn
				var start = showmodal.countColumnStart
				var end = showmodal.countColumnEnd
				var countColumnCalculation = showmodal.countColumnCalculation
				var countTilte = showmodal.countTitle
				var countKey = showmodal.countLabel
				if(iscountBtn && start != "undefined" && end != "undefined") {
					setnew.push({
						title: countTilte,
						key: countKey
					})
				}
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
                                        marginRight: '5px',
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
					})
		        }else if(pageeditid == "" && pageviewid != ""){
						setnew.push({
							title:"操作",
							key:"edit",
							width:150,
							align:"center",
							render:(h,params) =>{
								return h('div',[
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
						})
				}else if(pageeditid != "" && pageviewid == ""){
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
                                        marginRight: '5px',
                                    },
									on:{
										click:() =>{
											this.edit(params.index)
										}
									}
								},'编辑')
							])
						}
					})
				}
        		this.pageeditid = pageeditid;
		        this.pageviewid = pageviewid;
		        pageeditid = ""
		        pageviewid = ""
        		this.columns = setnew
        		var filterkey = showmodal.filterkey
        		var filterValue = ""
        		if(showmodal.filterchoosesystemsk){
        			filterValue = showmodal.filtervaluebychoose
        		}else{
        			filterValue = showmodal.filtervaluebyfill
        		}
                this.$http.get(this.globalconfig.listsks,
                    {
                        params: {
                            usrid: window.localStorage.getItem("usrid"),
                            flowid:ownflowid,
                            nodeid:ownnodeid,
                            submitinfo: JSON.stringify(this.formInline),
                            isshowflowdata:showmodal.isshowflowdata,
                            filterkey:filterkey,
                            filterValue:filterValue
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                        tableData = response.body.data;
                       var len = tableData.length 
						for(var i = 0 ; i < len; i++) {
							for(var k in tableData[i]) {
								if(typeof(tableData[i][k]) == "number") {
									tableData[i][k] = formatTime(tableData[i][k], "yyyy-MM-dd")
								}
							}
							//统计列数据
							if(iscountBtn && start != "undefined" && end != "undefined") {
								if(tableData[i][start] && tableData[i][end]){
									tableData[i][countKey] = this.calculationColumn(tableData[i][start],tableData[i][end],countColumnCalculation)
								}
							}
						}
	                	this.pageCount = tableData.length
	                    this.data = this.showTable()
	                    showmodal.iscountBtn = false
                        this.$Message.success('这是一条成功的提示');
                    }, () => {
                        this.$Message.success('这是一条失败的提示');
                    });
            },
            calculationColumn(x,y,str){
				var m = parseInt(x)
				var n = parseInt(y)
				var r = 0
				if(str == "加"){
					r = m + n
				}else if(str == "减"){
					r = m - n
				}else if(str == "乘"){
					r = m * n
				}else if(str == "除"){
					r = m / n *100 + "%"
				}
				return r
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
            	var len = this.globalconfig.showingpagedlgqueue.length
            	for(var k in this.globalconfig.showingpagedlgqueue[len-1]){
        			if(this.globalconfig.showingpagedlgqueue[len-1][k] == true){
        				this.globalconfig.showingpagedlgqueue[len-1][k] == false
        				break
        			}
        		}
            	this.globalconfig.showingpagedlgqueue.pop()
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
    function formatTime(time,fmt) {
	    var date = new Date(time);
	    if (/(y+)/.test(fmt)) {
	      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	    }
	    let o = {
	      'M+': date.getMonth() + 1,
	      'd+': date.getDate(),
	      'h+': date.getHours(),
	      'm+': date.getMinutes(),
	      's+': date.getSeconds()
	    };
	    for (let k in o) {
	        if (new RegExp(`(${k})`).test(fmt)) {
	          let str = o[k] + '';
	          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
	        }
	    }
	    return fmt;
	}
	
	function padLeftZero(str) {
	  return ('00' + str).substr(str.length);
	}
</script>

