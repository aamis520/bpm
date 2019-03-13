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

	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
	let uploadfiledata = []
	let foldertype = ""
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
        var upfolderkey = '';
        if(foldertype == "private"){
          upfolderkey = window.localStorage.getItem("usrid");
          var parent = getCookie('parent');
          var _dataid = '';
          if(parent){
             _dataid = JSON.parse(parent).dataid
          }
          if(_dataid){
            this.submitdata.parentid = _dataid
          }
        }else if(foldertype == "flows"){
          upfolderkey = ownflowid;
        }

        this.submitdata.usrname = JSON.parse(localStorage.getItem("usrinfo")).usrname
        this.submitdata.usrid = window.localStorage.getItem("usrid")
        var file = file
        var filename = file.name
        this.submitdata.flowid = ownflowid
        this.submitdata.nodeid = getrealnodeid()
        this.submitdata.filename = file.name
        this.submitdata.foldertype = foldertype
        this.submitdata.folderkey = upfolderkey
      },
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

	function getcookieflowid(){
    var obj = JSON.parse(getCookie('currentUserAction'));
    return obj.flowid;
  }

  function getcookienodeid(){
    var obj = JSON.parse(getCookie('currentUserAction'));
    return obj.nodeid;
  }

  function getrealnodeid(){
    if(ownflowid == getcookieflowid()){
      return getcookienodeid()
    }else{
      return ownnodeid
    }
  }
</script>
