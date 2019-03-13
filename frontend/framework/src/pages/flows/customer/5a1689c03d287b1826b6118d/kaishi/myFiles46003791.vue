
<style scoped>
</style>

<template>

    <div class="blank">
	    <Table :columns="columns" :data="data"></Table>
        <div style=" width: 100%;height: 50px;">
	    	<div style="float: right;padding: 15px 0;">
		        <Page :total="pageCount" :current="1" @on-change="changePage"></Page>
		    </div>
	    </div>
    </div>

</template>

<script>
	let importstart;

	let ownflowid = "5a1689c03d287b1826b6118d"
	let ownnodeid = "kaishi"
	let ownpageid = "5a1b7c84bdcf99944a09eda4"
	let uploadfiledata = []
	let foldertype = "private"
	let folderkey = ""
	let isdelbtn = "true"
	export default {
    	components:{},
    	watch:{
    		pageishowwinthinmodal(){
    			var len = this.globalconfig.showingpagedlgqueue.length
    			var datas = uploadfiledata
          if(len > 0){
            var parentid = ""
            if(this.globalconfig.showingpagedlgqueue[len -1].itemid){
              parentid = this.globalconfig.showingpagedlgqueue[len -1].itemid
            }
            var tempfiles = []
            if(parentid != ""){
              for(var i=0;i<datas.length;i++){
                if(datas[i].parentid){
                  if(datas[i].parentid == parentid){
                    tempfiles.push(datas[i])
                  }
                }
              }
              this.pageCount = tempfiles.length
              this.data = this.showTable(tempfiles)
            }
          }
    		}
    	},
        data() {
            return {
            	pageCount:10,
            	pageData:null,
            	pageishowwinthinmodal: this.globalconfig.showingpagedlgqueue,
               	columns:[
               		{
               			title:'文件名',
               			key:'filename'
               		},
               		{
               			title:'提交人',
               			key:'submitter'
               		},
               		{
               			title:'提交时间',
               			key:'submitdate'
               		},
               		{
               			title:'修改时间',
               			key:'modifytime'
               		}
                ],
                data:[],
            }
        },
        methods: {
            downloadfile(index){
            	console.log(index)
				console.log(this.data[index].path)
            },
            delfile(index){
				var id = this.data[index].id
				this.$http.get(this.globalconfig.delfileapi,
                    {
                        params: {
                           id:id
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                        if(response.data.success == "删除成功"){
                        	uploadfiledata = uniqueArray(uploadfiledata,id)
                        	this.pageCount = uploadfiledata.length
                    		this.data = this.showTable(uploadfiledata)
                        	this.$Message.success('删除成功');
                        	//同时从列表中删除某一项
                        }
                    }, () => {
                        this.$Message.error('删除失败');
                    });
            },
            handleQuery(){
            	var isdelbtnscope = isdelbtn
            	if(isdelbtnscope == "true"){
            		this.columns.push({
            			title:"操作",
               			key:"action",
               			width:150,
               			align:'center',
               			render:(h,params) =>{
               				return h('div',[
               					h('button',{
									attrs:{
										'class':'ivu-btn ivu-btn-success ivu-btn-small'
									},
									style: {
                                        marginRight: '5px',
                                    },
									on:{
										click:() =>{
											this.downloadfile(params.index)
										}
									}
								},'下载'),
								h('button',{
									attrs:{
										'class':'ivu-btn ivu-btn-error ivu-btn-small'
									},
									style: {
                                        marginRight: '5px',
                                    },
									on:{
										click:() =>{
											this.delfile(params.index)
										}
									}
								},'删除')
               				])
               			}
            		})
            	}else{
            		this.columns.push({
            			title:"操作",
               			key:"action",
               			width:150,
               			align:'center',
               			render:(h,params) =>{
               				return h('div',[
               					h('button',{
									attrs:{
										'class':'ivu-btn ivu-btn-success ivu-btn-small'
									},
									style: {
                                        marginRight: '5px',
                                    },
									on:{
										click:() =>{
											this.downloadfile(params.index)
										}
									}
								},'下载')
               				])
               			}
            		})
            	}
            	isdelbtn = false


            	this.data = []
            	uploadfiledata = []
            	var itemid = ""
            	if(this.$router.currentRoute.query.itemid){
            		itemid = this.$router.currentRoute.query.itemid
            	}
            	if(foldertype == "private"){
          			folderkey = window.localStorage.getItem("usrid")

	            	//查询 如果是自己的话 就显示 如果是当前节点  查询历史记录 查找已审批的节点和待审批的节点
	           		this.$http.get(this.globalconfig.getfilesapi,
	            		{params:{
	            			flowid:ownflowid,
	            			foldertype:foldertype,
	            		}},  {emulateJSON: true})
	            		.then((response) => {
	            		    if(response.data.files){
		            		    var files = response.data.files
		            		    console.log(files)
		            		    console.log(itemid)
		            		    var tempfiles = []
		            		    if(itemid != ""){
		            		    	for(var j=0;j<files.length;j++){
			            		    	if(!files[j].parentid){
			            		    	}else{
			            		    		if(files[j].parentid == itemid){
			            		    			tempfiles.push(files[j])
			            		    		}
			            		    	}
			            		    }
		            		    	files = tempfiles
		            		    }
		            		    var usrname = JSON.parse(window.localStorage.getItem("usrinfo")).usrname
		            		    var retarr = []
		            		    for(var i=0;i<files.length;i++){
		            		    	var tmp = i
		            		    	var submitter = files[tmp].submitter
		            		    	var fileflowid = files[tmp].flowid
		            		    	var filenodeid = files[tmp].nodeid
		            		    	retarr.push({
		            		    		flowid:fileflowid,
		            		    		nodeid:filenodeid,
		            		    		itemid:files[tmp].parentid,
		            		    		parentid:files[tmp].parentid
		            		    	})
		            		    }
		            		    //发送一个请求 单独的API 查询已经审批的节点 和下一节点
	            		    	this.$http.get(this.globalconfig.listapprovalnodeandnextnode,
			                    {
			                        params: {
			                           itemidsandnodeids:retarr
			                        }
			                    }, {emulateJSON: true})
			                    .then((response) => {
			                        if(response.data){
			                        	var nodes = response.data.nodes
			                        	for(var i=0;i<files.length;i++){
			                        		var tmp = i
				            		    	var submitter = files[tmp].submitter
				            		    	var fileflowid = files[tmp].flowid
				            		    	var filenodeid = files[tmp].nodeid
				            		    	var itemid = files[tmp].parentid
				            		    	var flag = false
				            		    	for(var j=0;j<nodes.length;j++){
				            		    		if(nodes[j].flowid == fileflowid && nodes[j].nodeid == filenodeid && nodes[j].itemid == itemid){
													if(ownflowid == fileflowid && ownnodeid != filenodeid){
										            	for(var k=0;k<nodes[j].nodes.length;k++){
										            		if(ownnodeid == nodes[j].nodes[k]){
										            			flag = true
										            			break
										            		}
										            	}

	            		    						}
				            		    		}
				            		    	}
							            	if(flag){
							            		uploadfiledata.push({
				            		    			filename:files[tmp].filename,
				            		    			submitter:files[tmp].submitter,
				            		    			submitdate:formatTime(files[tmp].createdAt,'yyyy-MM-dd hh:mm'),
				            		    			modifytime:formatTime(files[tmp].updatedAt,'yyyy-MM-dd hh:mm'),
				            		    			path:files[tmp].path,
				            		    			id:files[tmp].id,
				            		    			parentid:files[tmp].parentid
				            		    		})
							            	}else{
							            		if(submitter == usrname){
					            		    		uploadfiledata.push({
					            		    			filename:files[tmp].filename,
					            		    			submitter:files[tmp].submitter,
					            		    			submitdate:formatTime(files[tmp].createdAt,'yyyy-MM-dd hh:mm'),
					            		    			modifytime:formatTime(files[tmp].updatedAt,'yyyy-MM-dd hh:mm'),
					            		    			path:files[tmp].path,
					            		    			id:files[tmp].id,
					            		    			parentid:files[tmp].parentid
					            		    		})
					            		    	}
							            	}
			                        	}
			                    		this.pageCount = uploadfiledata.length
			                    		this.data = this.showTable(uploadfiledata)
			                        }
			                    }, () => {
			                        this.$Message.error('删除失败');
			                    });
	            		    }
	            		}, () => {
	            		    this.$Message.success('这是一条失败的提示');
	            		}
	        		);
        		}else if(foldertype == "all"){
        			//待完善
        		}
            },
            showTable(arr){
            	let data = []
            	let len = arr.length
            	if(len>10){
	            	for(let i=0;i<10;i++){
						data.push(uploadfiledata[i])
	            	}
            	}else{
            		for(let i=0;i<len;i++){
						data.push(uploadfiledata[i])
	            	}
            	}
            	return data
            },
            changePage(index){
            	if(this.pageData == null){
            		this.pageData = uploadfiledata
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


        },
        mounted:function(){
        	this.handleQuery()
        }
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

	/*数组删除某一项 匹配值为ID*/
	function uniqueArray(ary,id){
		for (var i = ary.length-1; i>=0; i--){
		    if (ary[i].id==id){
		        ary.splice(i,1);
	       }
		}
		return ary;
	}
</script>
