
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
	
	let ownflowid = "59bb8f524b62afa833f8226d"
	let ownnodeid = "yijishenpi"
	let ownpageid = "59bb909c4b62afa833f82275"
	
	let pageviewid = ""
	let pageeditid = ""
	let setnew = [{"title":"申请人","key":"shenqingren"},{"title":"申请金额","key":"shenqingjine"},{"title":"申请理由","key":"shenqingliyou"},{"title":"申请时间","key":"shenqingshijian"}];
	
	let tableData = null
	let childtableData = null
	
	let showmodal = {"viewinmodal":false,"editinmodal":false,"iscountBtn":false,"isfilterBtn":false,"isshowflowdata":false,"countTitle":"统计","countLabel":"tongji","filterColumn":"","countColumnStart":"","countColumnEnd":"","countColumnCalculation":"","filterkey":"","filtervaluebychoose":"","filtervaluebyfill":"","filterchoosesystemsk":false,"isdelbtn":false,"isapprovalstatus":false,"flowid":"59bb8f524b62afa833f8226d","nodeid":"yijishenpi","newcountcolumns":[]}
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
        		//添加统计列
        		var iscountBtn = showmodal.iscountBtn
				var start = showmodal.countColumnStart
				var end = showmodal.countColumnEnd
				var countColumnCalculation = showmodal.countColumnCalculation
				var countTilte = showmodal.countTitle
				var countKey = showmodal.countLabel
				var flowid = showmodal.flowid
				this.flowid = flowid
				var nodeid = showmodal.nodeid
				this.nodeid = nodeid
				//是否有审批状态
		        if(showmodal.isapprovalstatus == true){
		        	setnew.push({
                		"title":"状态",
                		"key":"approvalstatus",
                		width:80,
                		align:"center"
                	})
		        }
				
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
//						align:"center",
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
								},'查看1')
							])
						}
					})
		        }else if(pageeditid == "" && pageviewid != ""){
						setnew.push({
							title:"操作",
							key:"edit",
							width:80,
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
						width:80,
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
		        
		        var isdelbtn= showmodal.isdelbtn
				if(isdelbtn == true){
					setnew.push({
						title:"删除",
						key:"deldata",
						width:'80',
						render:(h,params) =>{
							return h('div',[
								h('button',{
									attrs:{
										'class':'ivu-btn ivu-btn-error ivu-btn-small'
									},
									style: {
                                        marginRight: '5px',
                                    },
									on:{
										click:() =>{
											this.deldata(params.index)
										}
									}
								},'删除')
							])
						}
					})
				}
				showmodal.isdelbtn = false
				this.columns = setnew
				//console.log(this.columns)
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
                            flowid:flowid,
                            nodeid:nodeid,
                            submitinfo: JSON.stringify(this.formInline),
                            isshowflowdata:showmodal.isshowflowdata,
                            filterkey:filterkey,
                            filterValue:filterValue
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                        tableData = response.body.data;
                        var ids = []
                       var len = tableData.length 
						for(var i = 0 ; i < len; i++) {
							for(var k in tableData[i]) {
								if(typeof(tableData[i][k]) == "number" && String(tableData[i][k]).length == 13) {
									tableData[i][k] = formatTime(tableData[i][k], "yyyy-MM-dd")
								}
							}
							
							//统计列数据
							if(iscountBtn && start != "undefined" && end != "undefined") {
								if(tableData[i][start] && tableData[i][end]){
									tableData[i][countKey] = this.calculationColumn(tableData[i][start],tableData[i][end],countColumnCalculation)
								}
							}
							tableData[i].approvalstatus = ""
							ids.push(tableData[i].id)
						}
						
						//列表统计扩展
						var newcountcolumns = showmodal.newcountcolumns
						var lnccl = newcountcolumns.length
						if(lnccl !=0){
							for(var e=0;e<lnccl;e++){
								var temp = e
								if(newcountcolumns[temp].isuse == "true" || newcountcolumns[temp].isuse == true) {
									if(newcountcolumns[temp].from == "own") {
										var key = newcountcolumns[temp].key
										var columnsbycolumn = newcountcolumns[temp].own.columns
										var columnsbycolumnLen = columnsbycolumn.length
										if(columnsbycolumnLen != 0) {
											var calcData = null
											var calOpration = ""
											for(var r = 0; r < columnsbycolumnLen; r++) {
												var rtemp = r
												var calkey = columnsbycolumn[rtemp].key

												for(var t = 0; t < len; t++) {
													for(var k in tableData[t]) {
														if(calkey == k) {
															calcData = tableData[t][calkey]
															//往tabledata里面存值
															if(rtemp == 0) {
																tableData[t][key] = calcData
																calOpration = columnsbycolumn[rtemp].calculation
															} else if(rtemp > 0) {
																//计算当前值 与库里的值
																if(calOpration == "+") {
																	tableData[t][key] = add(Number(tableData[t][key]),Number(calcData))
																							
																} else if(calOpration == "-") {
																	tableData[t][key] = sub(Number(tableData[t][key]),Number(calcData))
																} else if(calOpration == "*") {
																	tableData[t][key] = mul(Number(tableData[t][key]),Number(calcData))
																} else if(calOpration == "/") {
																	tableData[t][key] = p(Number(tableData[t][key]),Number(calcData))
																	tableData[t][key] = tableData[t][key].toFixed(4)
																	tableData[t][key] = tableData[t][key]*100 + "%"
																}

															}

														}
													}
												}
												calOpration = columnsbycolumn[rtemp].calculation
											}
										}
									} else if(newcountcolumns[temp].from == "relate") {
										var relateTemp = temp
										var columnsbyrelate = newcountcolumns[relateTemp].relate.columns
										var columnsbycolumnLen = columnsbyrelate.length
										var childflowid = newcountcolumns[relateTemp].relate.childflowid
										var maintagkey = newcountcolumns[relateTemp].relate.maintagkey
										var childtagkey = newcountcolumns[relateTemp].relate.childtagkey
										//先请求子流程数据
										this.$http.get(this.globalconfig.listsks, {
												params: {
													usrid: window.localStorage.getItem("usrid"),
													flowid: childflowid,
													isshowflowdata: true
												}
											}, {
												emulateJSON: true
											})
											.then((response) => {

												childtableData = response.data.data
												var childLen = childtableData.length
												var key = newcountcolumns[relateTemp].key
												if(columnsbycolumnLen != 0) {
													var calcData = null
													var calOpration = ""
													for(var r = 0; r < columnsbycolumnLen; r++) {
														var rtemp = r
														var calkey = columnsbyrelate[rtemp].key
														for(var t = 0; t < childLen; t++) {
															for(var k in childtableData[t]) {
																if(calkey == k) {
																	calcData = childtableData[t][calkey]
																	//往tabledata里面存值
																	if(rtemp == 0) {
																		childtableData[t][key] = calcData
																		calOpration = columnsbyrelate[rtemp].calculation
																	} else if(rtemp > 0) {
																		//计算当前值 与库里的值
																		if(calOpration == "+") {
																			childtableData[t][key] = add(Number(childtableData[t][key]),Number(calcData))
																		} else if(calOpration == "-") {
																			
																			childtableData[t][key] = sub(Number(childtableData[t][key]),Number(calcData))
																		} else if(calOpration == "*") {
																			childtableData[t][key] = mul(Number(childtableData[t][key]),Number(calcData))
																		} else if(calOpration == "/") {
																			childtableData[t][key] = p(Number(childtableData[t][key]),Number(calcData))
																			childtableData[t][key] = childtableData[t][key].fixed(4)
																			childtableData[t][key] = childtableData[t][key]*100 + "%"
																		}

																	}

																}
															}
														}
														calOpration = columnsbyrelate[rtemp].calculation
														//融合子流程计算出来的数据 赋给主流程
														for(var z = 0; z < childLen; z++) {
															var ztemp = z
															for(var x = 0; x < len; x++) {
																var xtemp = x
																if(tableData[xtemp][maintagkey] == childtableData[ztemp][childtagkey]) {
																	tableData[xtemp][key] = childtableData[ztemp][key]
																}
															}
														}
													}
													this.pageCount = tableData.length
													this.data = this.showTable()
												}
											}, () => {
												this.$Message.success('这是一条失败的提示');
											});

									} else if(newcountcolumns[temp].from == "column") {
										var key = newcountcolumns[temp].key
										var columnsbycolumn = newcountcolumns[temp].column.columns
										var columnsbycolumnLen = columnsbycolumn.length
										if(columnsbycolumnLen != 0) {
											var calcData = null
											var calOpration = ""
											for(var r = 0; r < columnsbycolumnLen; r++) {
												var rtemp = r
												var calkey = columnsbycolumn[rtemp].key

												for(var t = 0; t < len; t++) {
													for(var k in tableData[t]) {
														if(calkey == k) {
															calcData = tableData[t][calkey]
															//往tabledata里面存值
															if(rtemp == 0) {
																tableData[t][key] = calcData
																calOpration = columnsbycolumn[rtemp].calculation
															} else if(rtemp > 0) {
																//计算当前值 与库里的值
																if(calOpration == "+") {
																	tableData[t][key] = add(Number(tableData[t][key]),Number(calcData))
																							
																} else if(calOpration == "-") {
																	tableData[t][key] = sub(Number(tableData[t][key]),Number(calcData))
																} else if(calOpration == "*") {
																	tableData[t][key] = mul(Number(tableData[t][key]),Number(calcData))
																} else if(calOpration == "/") {
																	tableData[t][key] = p(Number(tableData[t][key]),Number(calcData))
																	tableData[t][key] = tableData[t][key].toFixed(4)
																	tableData[t][key] = tableData[t][key]*100 + "%"
																}

															}

														}
													}
												}
												calOpration = columnsbycolumn[rtemp].calculation
											}
										}
									}
									this.pageCount = tableData.length
									this.data = this.showTable()
								}
							}
						}
						//审批状态
						//获取所有数据的ID
						//查询状态  listallapprovalbyids
						var isapprovalstatus = showmodal.isapprovalstatus
						if(isapprovalstatus == true){
							this.$http.get(this.globalconfig.listallapprovalbyids,
		                    {
		                        params: {
		                        	flowid:flowid,
		                        	ids:ids
		                        }
		                    }, {emulateJSON: true})
		                    .then((response) => {
		                    	var histories = response.data.histories
		                    	var alldatas = []
		                    	for(var i=0;i<ids.length;i++){
		                    		alldatas.push({
		                    			id:ids[i],
		                    			status:"",
		                    			arr:[]
		                    		})
		                    		for(var j=0;j<histories.length;j++){
		                    			if(histories[j].itemid == ids[i]){
		                    				alldatas[i].arr.push(histories[j])
		                    			}
		                    		}
		                    	}
		                    	//取出最后一条 
		                    	for(var z=0;z<alldatas.length;z++){
		                    		var status = ""
		                    		var shenpistatus = ""
									if(alldatas[z].arr[alldatas[z].arr.length - 1]){
										shenpistatus = alldatas[z].arr[alldatas[z].arr.length - 1].shenpistatus
									}
		                    		if(shenpistatus == "submit"){
		                    			status = "待审批"
		                    		}else if(shenpistatus == "deny"){
		                    			status = "已拒绝"
		                    		}else if(shenpistatus == "approve"){
		                    			status = "审批中"
		                    		}else if(shenpistatus == "end" || shenpistatus == "finish"){
		                    			status = "审批通过"
		                    		}
		                    		alldatas[z].status = status
		                    	}
		                    	for(var x=0;x<len;x++){
		                    		for(var c=0;c<alldatas.length;c++){
		                    			if(tableData[x].id == alldatas[c].id){
		                    				tableData[x].approvalstatus = alldatas[c].status
		                    			}
		                    		}
		                    	}
		                    	//添加状态列
		                    	this.pageCount = tableData.length
			                    this.data = this.showTable()
			                    showmodal.iscountBtn = false
		                    	
		                    }, () => {
		                        this.$Message.error('删除失败');
		                    });
						}else{
							this.pageCount = tableData.length
		                    this.data = this.showTable()
		                    showmodal.iscountBtn = false
						}
                    }, () => {
                        this.$Message.success('这是一条失败的提示');
                    });
            },
            calculationColumn(x,y,str){
				var m = Number(x)
				var n = Number(y)
				var r = 0
				if(str == "加"){
					r = add(m,n)
				}else if(str == "减"){
					r = sub(m,n)
				}else if(str == "乘"){
					r = mul(m,n)
				}else if(str == "除"){
					r = (p(m,n) *100).toFixed(4) + "%"
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
            deldata(index){
            	var id = this.data[index].id
            	var flowid = this.flowid
            	//删除数据
            	this.$http.get(this.globalconfig.deldataapi,
                    {
                        params: {
                        	flowid:flowid,
                        	id:id
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                    	if(response.data.success){
							this.removeByValue(this.data,id)
                    		this.$Message.success('删除成功');
                    	}
                    }, () => {
                        this.$Message.error('删除失败');
                    });
            },
            removeByValue(arr, val) {
				for(var i=0; i<arr.length; i++) {
				    if(arr[i].id == val) {
				        arr.splice(i, 1);
				      	break;
				    }
				}
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
					            			vieworedit:"view",
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
				                	newObj.vieworedit="view"
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
	
	function add(a, b) {
	    var c, d, e;
	    try {
	        c = a.toString().split(".")[1].length;
	    } catch (f) {
	        c = 0;
	    }
	    try {
	        d = b.toString().split(".")[1].length;
	    } catch (f) {
	        d = 0;
	    }
	    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
	}
	
	function sub(a, b) {
	    var c, d, e;
	    try {
	        c = a.toString().split(".")[1].length;
	    } catch (f) {
	        c = 0;
	    }
	    try {
	        d = b.toString().split(".")[1].length;
	    } catch (f) {
	        d = 0;
	    }
	    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
	}
	
	function mul(a, b) {
	    var c = 0,
	        d = a.toString(),
	        e = b.toString();
	    try {
	        c += d.split(".")[1].length;
	    } catch (f) {}
	    try {
	        c += e.split(".")[1].length;
	    } catch (f) {}
	    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
	}
	
	function p(a, b) {
	    var c, d, e = 0,
	        f = 0;
	    try {
	        e = a.toString().split(".")[1].length;
	    } catch (g) {}
	    try {
	        f = b.toString().split(".")[1].length;
	    } catch (g) {}
	    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
	}
</script>

