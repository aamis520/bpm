
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
	let ownpageid = "5a1b7c84bdcf99944a09eda4"
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
          		this.submitdata.usrname = JSON.parse(localStorage.getItem("usrinfo")).usrname
          		var file = file
          		var filename = file.name
          		this.submitdata.flowid = ownflowid
          		this.submitdata.nodeid = ownnodeid
          		this.submitdata.parentid = this.globalconfig.dataid
          		this.submitdata.filename = file.name
          		this.submitdata.foldertype = foldertype
          		this.submitdata.folderkey = folderkey
            }
        }
        
    }
</script>
