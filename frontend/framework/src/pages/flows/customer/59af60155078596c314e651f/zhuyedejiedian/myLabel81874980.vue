
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
	let ckid = "undefined"
	let skid = "undefined"
	let labelcontent = "瞧瞧"
	let fontStyle = {"fontSize":"","fontWeight":"","textAlign":""}
	
	let ownflowid = "59af60155078596c314e651f"
	let ownnodeid = "zhuyedejiedian"
	let ownpageid = "59af60855078596c314e6521"
	
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
				var me = this;
        		if(/px/.test(fontStyle.fontSize)){
        			fontStyle.fontSize = fontStyle.fontSize
        		}else{
        			fontStyle.fontSize = fontStyle.fontSize + 'px'
        		}
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
								itemid:this.querydata.itemid,
			                    keywordid: ckid,
			                }
			            }, {emulateJSON: true})
			            .then((response) => {
			            	var labelData = response.data.data.value;
							console.log(labelData);	
							me.data = showData(labelData);
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
							if(typeof(response.body.value) == "number" && String(response.body.value).length == 13){
								me.data =  formatTime(response.body.value,"yyyy-MM-dd");		
							} else if(typeof(response.body.value) == "number" && response.body.value<1){
								var num = response.body.value;
								num = num.toFixed(2);
								num *= 100;
								num = num + "%";
								me.data = num;
							} else {
								me.data = response.body.value;
							}
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
	function showData(labelData){  // 处理返回的数据显示到label
		if(typeof(labelData) == "number" && String(labelData).length == 13){ //value直接就是数字或者是字符串
			return formatTime(labelData,"yyyy-MM-dd");			
		}else if(typeof(labelData) == "number" && labelData < 1){
			var num = labelData;
			num = num.toFixed(2);
			num *= 100;
			num = num + "%";
			return num;
		}else if(typeof(labelData) == "number" || typeof(labelData) == "string"){
			return labelData;
		} else {
			if(Object.keys(labelData).length != 1){ //用长度来判断是不是多值和空值---都不匹配
				return "设置错误1";
			} else if(Object.keys(labelData).length == 0){
				return "这是一条空数据";
			}else {
				var key = Object.keys(labelData)[0];
				//labelData[key]是我们应该显示的值,只可能是数字或者是字符串
				if(typeof(labelData[key]) == "number" && String(labelData[key]).length == 13){  //时间戳
					return formatTime(labelData[key],"yyyy-MM-dd");
				}else if(typeof(labelData[key]) == "number" && labelData[key] < 1){
					var num = labelData[key];
					num = num.toFixed(2);
					num *= 100;
					num = num + "%";
					return num;
				} else if(typeof(labelData[key]) =="number"){//数字
					return labelData[key];
				} else if(typeof(labelData[key]) =="string"){//字符串
					return parseFloat(labelData[key]);
				}else { //对象或者是数组
					return "设置错误2";	
				}	
			}
		}	
	}
</script>