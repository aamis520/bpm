
<style scoped>
</style>

<template>

    <div class="blank">
        <div>
	        <Upload
	            :before-upload="handleUpload"
	            :action="uploadfile"
	            :data="submitdata">
	            <Button type="ghost" icon="ios-cloud-upload-outline">选择要上传文件的文件</Button>
	        </Upload>
	    </div>
    </div>

</template>

<script>
	let importstart;

	let ownflowid = "5a1689c03d287b1826b6118d"
	let ownnodeid = "kaishi"
	let ownpageid = "5a1bc9a0bdcf99944a09edaa"
	let uploadfiledata = []
	let foldertype = "private"
	let folderkey = ""
	export default {
    	components:{},
    	props:["parentid"],
        data() {
            return {
                submitdata:{},
                uploadfile:this.globalconfig.uploadapi
            }
        },
        methods: {
          	handleUpload (file) {
          		//获取设置的参数 以及文件 的参数 文件名  以及扩展名
          		if(foldertype == "private"){
          			folderkey = window.localStorage.getItem("usrid")
          		}
              var parent = getCookie('parent');
          		 var _dataid = '';
              if(parent){
                  var _dataid = JSON.parse(parent).dataid
                  console.log(_dataid)
              }
              if(_dataid){
                this.submitdata.parentid = _dataid
              }
          		this.submitdata.usrname = JSON.parse(localStorage.getItem("usrinfo")).usrname
          		var file = file
          		var filename = file.name
          		this.submitdata.flowid = ownflowid
          		this.submitdata.nodeid = ownnodeid

          		this.submitdata.filename = file.name
          		this.submitdata.foldertype = foldertype
          		this.submitdata.folderkey = folderkey
            }
        },
        mounted(){
          console.log(this.globalconfig.dataid)
        }

    }

    function getCookie(name){
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
      }else{
        return null;
      }
	  }
</script>
