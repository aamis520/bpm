
<template>
    <h4><span id="label">{{data}}</span> </h4>
</template>

<script>
	let ckid = ""
	let skid = "59928fd28a4a72140e783310"
	let labelcontent = ""
	let fontStyle = {"fontSize":"12","fontWeight":"bold","textAlign":"left"}
	
	let ownflowid = "59928f778a4a72140e78330d"
	let ownnodeid = "shenpi"
	let ownpageid = "599293879e8a735c1d7f9254"
	
    export default {
        data(){
            return {
                data: "正在读。。。",
                querydata:{
            	
                }
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
        		if(labelcontent !=""){
        			this.data = labelcontent
        			this.$nextTick(function () {
	        			var label = document.getElementById('label')
						label.style.fontSize = parseInt(fontStyle.fontSize) + 'px'
						label.style.fontWeight = fontStyle.fontWeight
						label.parentElement.style.textAlign = fontStyle.textAlign
        			})
        		}else{
	        		if(ckid != ""){
			            this.$http.get(this.globalconfig.querybyck,
			            {
			                params: {
			                    usrid: window.localStorage.getItem("usrid"),
			                    flowid:getflowid(this.$router.currentRoute.path),
			                    keywordid: ckid,
			                }
			            }, {emulateJSON: true})
			            .then((response) => {
			            	var labelData = response.data.data.value
			            	this.data = labelData[0]
			            	var label = document.getElementById('label')
	    					label.style.fontSize = parseInt(fontStyle.fontSize) + 'px'
	    					label.style.fontWeight = fontStyle.fontWeight
	    					label.parentElement.style.textAlign = fontStyle.textAlign
				        }, () => {
			                this.data = "读失败"
			            });
		        	}else if(skid != "" && this.querydata.itemid != ""){
		        		this.$http.get(this.globalconfig.querybysk,
			            {
			                params: {
			                    usrid: window.localStorage.getItem("usrid"),
			                    flowid:getflowid(this.$router.currentRoute.path),
			                    itemid:this.querydata.itemid,
			                    skid:skid
			                }
			            }, {emulateJSON: true})
			            .then((response) => {
			            	var labelData = response.data.value
			            	this.data = labelData
			            	var label = document.getElementById('label')
	    					label.style.fontSize = parseInt(fontStyle.fontSize) + 'px'
	    					label.style.fontWeight = fontStyle.fontWeight
	    					label.parentElement.style.textAlign = fontStyle.textAlign
				        }, () => {
			                this.data = "读失败"
			            });
		        	}
        			
        		}
        	}
        },
        created : function () {
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