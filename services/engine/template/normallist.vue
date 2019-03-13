
<template>
    <section>
    	<Table :columns="columns" :data="data"></Table>
    	<div style=" width: 100%;height: 50px;">
	    	<div style="float: right;padding: 15px 0;">
		        <Page :total="pageCount" :current="1" @on-change="changePage"></Page>
		    </div>
	    </div>
    	<div id = "layouttobeadd"></div>
    </section>
</template>

<script>
	let importstart;
	
	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
	let countData = []
	let editpageid = []
	let viewpageid = []
	let isshowviewinmodal = []
	let isshoweditinmodal = []
	
	let tableData = null
	let editpage = []
	let viewpage = []
	
    export default {
    	components:{},
        data () {
            return {
                columns: this.generateDatamodel(),
                data: [],
                path:'',
                pageCount:10,
                pageData:null,
                flowid:getflowid(this.$router.currentRoute.path),
                nodeid:getnodeid(this.$router.currentRoute.path),
                pageeditid:"",
                pageviewid:""
            }
        },
        methods: {
            handleQuery() {
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
                        
                        var datastart = response.body.data
                        var start = countData[0][0].columnStart
                        var end = countData[0][0].columnEnd
                        var countKey = countData[0][0].columnKey
                        var columnCalculation = countData[0][0].columnCalculation
                        if(start!="0" && end !="0" && columnCalculation !="0"){
                        	for(var i=0,len=datastart.length;i<len;i++){
								datastart[i][countKey] = this.calculationColumn(datastart[i][start],datastart[i][end],columnCalculation)                        		
                        	}
                        }
                        tableData = datastart
                        for(var i=0,len = tableData.length;i<len;i++){
	                    	for(var k in tableData[i]){
	                        	if(typeof(tableData[i][k]) == "number" && tableData[i][k].length == 13){
	                        		tableData[i][k] = formatTime(tableData[i][k],"yyyy-MM-dd")
	                        	}
	                        }
	                    }
	                	this.pageCount = tableData.length
	                    this.data = this.showTable()
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
				}else{
					r = ""
				}
				return r
			},
            view(index){
            	this.getInfo(this.pageviewid,index)
            },
            edit(index){
            	this.getInfo(this.pageeditid ,index)
            },
            getInfo(page,index){
            	var id = page
            	if(id == "0"){
            		return false;
            	}
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
                    this.$Message.success('这是一条成功的提示');
                    var path = "./" +this.flowid+"|"+this.nodeid+"|"+ this.path
                    var itemid = this.data[index].id
	            	this.$router.push({
	            		path:path,
	            		query:{
	            			flowid:this.flowid,
	            			nodeid:this.nodeid,
	            			itemid:itemid,
	            			usrid:window.localStorage.getItem("usrid")
	            		}
	            	})
                }, () => {
                    this.$Message.success('这是一条失败的提示');
                });
            },
            generateDatamodel () {
		        var keytoshow = [];
		        //添加统计列、
		        if(countData[0][0].columnStart !="0" && countData[0][0].columnEnd !="0" && countData[0][0].columnCalculation !="0"){
		        	keytoshow[0].push({
		        		title:countData[0][0].columnTitle,
						key:countData[0][0].columnKey,
						align:"center",
		        	})
		        }
		        //lieb添加按钮
            	if(editpageid[0][0].pageid != "0" && viewpageid[0][0].pageid  != "0") {
			        keytoshow[0].push({
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
		        }else if(editpageid[0][0].pageid == "0" && viewpageid[0][0].pageid  != "0") {
						keytoshow[0].push({
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
				}else if(editpageid[0][0].pageid != "0" && viewpageid[0][0].pageid  == "0") {
					keytoshow[0].push({
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
        		this.pageeditid = editpageid[0][0].pageid;
		        this.pageviewid = viewpageid[0][0].pageid;
		        editpageid[0][0].pageid = "0"
		        viewpageid[0][0].pageid = "0"
		        return keytoshow[0];
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
        },
        created : function () {
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
