<style scoped>
</style>

<template>

    <div class="blank">
      <div>
        <Upload
            :before-upload="handleUpload"
            :on-success="uploadsuccess"
            :action="uploadfile"
            :data="submitdata">
            <Button type="ghost" icon="ios-cloud-upload-outline">选择要上传文件的文件</Button>
        </Upload>
	    </div>

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
	let ownpageid = "5a1bc9a0bdcf99944a09edaa"
	let uploadfiledata = []
	let foldertype = "flows"
	let folderkey = "5a1689c03d287b1826b6118d"
	let isdelbtn = "false"
	export default {
    components:{},
    props:["parentid"],
      data() {
        return {
          uploadfile:this.globalconfig.uploadapi,
          pageCount:10,
          pageData:null,
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
              }
            ],
            data:[],
            submitdata:{}
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
        uploadsuccess(response, file, fileList){
          //这里要判断 是否重名之后再决定是否push
          var flag = true
          for(var i=0;i<this.data.length;i++){
            if(this.data[i].filename == file.name){
              flag = false
            }
          }
          if(flag && response.file){
            if(response.file instanceof Array){
              uploadfiledata.unshift({
                filename:file.name,
                submitter:response.file.submitter,
                submitdate:formatTime(response.file.createdAt,'yyyy-MM-dd hh:mm'),
                id:response.file.id,
                path:response.file.path
              })

            }else{
              uploadfiledata.unshift({
                filename:file.name,
                submitter:response.file.submitter,
                submitdate:formatTime(response.file.createdAt,'yyyy-MM-dd hh:mm'),
                id:response.file.id,
                path:response.file.path
              })
            }
          }
          this.pageCount = uploadfiledata.length
          this.data = this.showTable()
        },

        downloadfile(index){
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
                this.data = this.showTable()
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

          var _dnfolderkey = ''
          var _submitterid = window.localStorage.getItem("usrid")
          var _submitter = JSON.parse(localStorage.getItem("usrinfo")).usrname
          if(foldertype == 'flows'){
            _dnfolderkey = ownflowid

          }else if(foldertype == 'private'){
            _dnfolderkey = window.localStorage.getItem("usrid")
            var parent = getCookie('parent');
            var _dataid = '';
            if(parent){
                var _dataid = JSON.parse(parent).dataid
            }
          }
          // 刚打开页面的时候，跟据传入的参数，列出文件
          this.$http.get(this.globalconfig.getfilesapi,{
            params:{
              foldertype:foldertype,
              folderkey:_dnfolderkey,
              parentid:_dataid,
              submitter:_submitter,
              usrid:_submitterid
            }
          },{emulateJSON:true})
          .then((response)=>{
            if(response){
              if(response.data){
                var _dnfiles = response.data.files;
                var _fmtDnFiles = []
                this.pageCount = _dnfiles.length
                for(var i = 0;i<_dnfiles.length;i++){
                  var _tempObj = {}
                  _tempObj.filename = _dnfiles[i].filename;
                  _tempObj.submitter = _dnfiles[i].submitter
                  _tempObj.submitdate = formatTime(_dnfiles[i].createdAt,'yyyy-MM-dd hh:mm')
                  _tempObj.id = _dnfiles[i].id
                  _tempObj.path = _dnfiles[i].path
                  _fmtDnFiles.push(_tempObj)
                }
                uploadfiledata = _fmtDnFiles
                this.data = _fmtDnFiles.slice(0,10)
              }
            }
          },()=>{
            this.$Message.error('列出文件失败');
          })
        },

        showTable(){
          let data = []
          let len = uploadfiledata.length
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

	/*数组删除某一项 匹配值为ID*/
	function uniqueArray(ary,id){
		for (var i = ary.length-1; i>=0; i--){
      if (ary[i].id==id){
          ary.splice(i,1);
      }
		}
		return ary;
	}

	function padLeftZero(str) {
	  return ('00' + str).substr(str.length);
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
