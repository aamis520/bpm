
<style scoped>
	h4{
		color: #657180;
		font-size: 14px;
		font-weight: normal;
	}
</style>
<template>
    <h4 :style="labelstyle"><span id="label">{{data}}</span> </h4>
</template>

<script>
	let ckid = ""
	let skid = ""
	let labelcontent = "理由"
	let fontStyle = {"fontSize":"","fontWeight":"","textAlign":""}
	
	let ownflowid = "599d4a5d52c0aae832e6656a"
	let ownnodeid = "shenpishuju"
	let ownpageid = "599d4b0b52c0aae832e66571"
	
    export default {
        data(){
            return {
                data: "空数据",
                labelstyle:{},
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
        		fontStyle.fontSize = fontStyle.fontSize + 'px'
        		this.labelstyle = fontStyle
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
        		if(labelcontent !="undefined" && labelcontent !=""){
        			this.data = labelcontent
        		}else{
	        		if(ckid != ""){
			            this.$http.get(this.globalconfig.querybyck,
			            {
			                params: {
			                    usrid: window.localStorage.getItem("usrid"),
			                    flowid:ownflowid,
			                    keywordid: ckid,
			                }
			            }, {emulateJSON: true})
			            .then((response) => {
			            	var labelData = response.data.data
			            	if(typeof(labelData) == "number" && String(labelData).length == 13){
                        		labelData= formatTime(labelData,"yyyy-MM-dd")
                        	}
			            	this.data = labelData
				        }, () => {
			                this.data = "空数据"
			            });
		        	}else if(skid != "" && this.querydata.itemid != ""){
		        		this.$http.get(this.globalconfig.querybysk,
			            {
			                params: {
			                    usrid: window.localStorage.getItem("usrid"),
			                    flowid:ownflowid,
			                    itemid:this.querydata.itemid,
			                    skid:skid
			                }
			            }, {emulateJSON: true})
			            .then((response) => {
			            	var labelData = response.data.value
			            	if(typeof(labelData) == "number" && String(labelData).length == 13){
                        		labelData= formatTime(labelData,"yyyy-MM-dd")
                        	}
			            	this.data = labelData
				        }, () => {
			                this.data = "空数据"
			            });
		        	}
        			
        		}
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