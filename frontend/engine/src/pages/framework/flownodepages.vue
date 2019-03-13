<style>
</style>
<template>
   <section>
   	<div style="text-align: right;padding-bottom: 20px;">
   		<Button type="primary" @click="createModalShow">创建</Button>
   	</div>
   	<Table border :columns="flowNodeList" :data="flowNodeData" @on-row-click="showThisRow"></Table>
   	<Modal
        v-model="modalCreate"
        title="创建"
        :mask-closable=false
        @on-ok="ok('formInline')"
        @on-cancel="cancel">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
        	<Form-item prop="filename">
        		<Row>
        			<Col span="6" style="text-align: right;">
        				文件名：
        			</Col>
        			<Col span="16" offset="1">
        				<Input placeholder="请输入..." v-model.trim="formInline.filename"></Input>
        			</Col>
        		</Row>
        	</Form-item>
        	<Form-item prop="tempid">
        		<Row>
        			<Col span="6" style="text-align: right;">
        				模板名：
        			</Col>
        			<Col span="16" offset="1">
        				 <Select v-model="formInline.tempid" style="width:200px">
					        <Option v-for="item in templist" :value="item.value" :key="item.label">{{ item.label }}</Option>
					    </Select>
        			</Col>
        		</Row>
        	</Form-item>
        </Form>
    </Modal>



   </section>
</template>
<script>
	let filenames = []
	let pagenames = []
    export default {
        data () {
            return {
            	//URL 参数
            	querydata:{
            		flowid:'',
        			nodeid:''
            	},
            	//创建  模态框
            	modalCreate:false,
            	filename:'',
            	tempid:'',
            	//创建页面的模态框 的下拉框
            	templist:[
            		{
            			value:'',
            			label:''
            		}
            	],
            	//表格对应的数据
                flowNodeList: [
                    {
                        title: '',
                        key: '',
                    },
                ],
                flowNodeData: [
                ],
                //下拉框的
                formInline:{
                	filename:'',
                	pagename:'',
                	tempid:'',
                	temptype:''
                },
                ruleInline:{
                	filename:[{
                		required:true,
                		message:"请输入文件名",
                		trigger:'blur'
                	}],
                	tempid:[{
                		required:true,
                		message:"请选择一个模板",
                		trigger:'blur'
                	}]
                }
            }
        },
        methods: {
        	showThisRow(data){
        		console.log(data)
        	},
        	handleQuery (){
        		//获取URL参数
        		if(this.$router.currentRoute.query.flowid != undefined){
        			this.querydata = this.$router.currentRoute.query
        		}
        		//获取当前flow node下的所有页面
        		this.$http.get(this.globalconfig.getpagesapi,
						{
		            		params:{
		            			flowid:this.querydata.flowid,
		            			nodeid:this.querydata.nodeid
		            		}
		            	},{emulateJSON:true})
	            	.then((response) =>{
	            		if(response.body.error){
	            			this.$Message.error(response.body.error)
	            		}else{
	            			var testList = response.data.finn
	            			//展示列表所需要的数据
	            			//同时保存一份 点击编辑 需要获取当前列的信息
	            			this.flowNodeList = []
	            			this.flowNodeData = []
							//TODO,类似下面的代码，最好用一个新的函数来做，可读性强。
	            			this.flowNodeList.push(
			                    {
			                        title: '文件名',
			                        key: 'pagename',
			                    },
			                    {
			                        title: '创建时间',
			                        key: 'createtime',
			                    },
			                    {
			                        title: '更新时间',
			                        key: 'updatetime',
			                    },
			                    {
			                        title: '操作',
			                        key: 'action',
			                        width: 300,
			                        align: 'center',
			                        render: (h, params) => {
			                            return h('div', [
			                                h('Button', {
			                                    props: {
			                                        type: 'success',
			                                        size: 'small'
			                                    },
			                                    style: {
			                                        marginRight: '5px'
			                                    },
			                                    on: {
			                                        click: () => {
			                                            this.setDefault(params.index)
			                                        }
			                                    }
			                                }, '设为默认'),
			                                h('Button', {
			                                    props: {
			                                        type: 'info',
			                                        size: 'small'
			                                    },
			                                    style: {
			                                        marginRight: '5px'
			                                    },
			                                    on: {
			                                        click: () => {
			                                            this.editForm(params.index)
			                                        }
			                                    }
			                                }, '编辑'),
			                                h('Button', {
			                                    props: {
			                                        type: 'error',
			                                        size: 'small'
			                                    },
			                                    on: {
			                                        click: () => {
			                                            this.remove(params.index)
			                                        }
			                                    }
			                                }, '删除')
			                            ]);
			                        }
		                        }
	            			);
	            			//存储行数据
	            			for(var i=0;i<testList.length;i++){
	            				let ele = testList[i];
	            				this.flowNodeData.push(
	            					{
	            						filename:ele.filename,
	            						createtime:formatTime(ele.createdAt,'yyyy-MM-dd hh:mm'),
	            						updatetime:formatTime(ele.updatedAt,'yyyy-MM-dd hh:mm'),
	            						flowid:ele.flowid,
	            						nodeid:ele.nodeid,
	            						id:ele.id,
	            						tempid:ele.tempid,
	            						pageid:ele.pageid,
	            						pagename:ele.pagename,
	            						items:ele.items
	            					}
	            				);
	            				//保存所有页面的页面信息以便创建的时候验证不可重名
	            				filenames.push({
	            					filename:ele.filename,
	            					flowid:ele.flowid,
	            					nodeid:ele.nodeid
	            				})
	            				pagenames.push(ele.pagename)
	            			}
	            		}
	            	},(response)=>{
	            		this.$Message.success('失败')
	            	});
        	},
        	//编辑表单 跳转到
            editForm(index){
            	//根据tempID 来判断当前是什么类型的表单 然后跳转到不同的编辑页面
            	if(this.flowNodeData[index].tempid == "591e6a3c8c9082580984ceee"){
            		//表单
            		this.$router.push({

            			//编辑表单
                  		path:'/submitform',
                  		query:{
                  			flowid:this.flowNodeData[index].flowid,
                  			nodeid:this.flowNodeData[index].nodeid,
                  			tempid:this.flowNodeData[index].tempid,
                  			pageid:this.flowNodeData[index].pageid,
                  			filename:this.flowNodeData[index].filename,
                  			id:this.flowNodeData[index].id,
                  			items:JSON.stringify(this.flowNodeData[index].items)
                  		}
                    });
            	}else if(this.flowNodeData[index].tempid == "5930074e8c9082580984cef3"){
            		this.$router.push({
                  		path:'/approval',
                  		query:{
                  			flowid:this.flowNodeData[index].flowid,
                  			nodeid:this.flowNodeData[index].nodeid,
                  			tempid:this.flowNodeData[index].tempid,
                  			pageid:this.flowNodeData[index].pageid,
                  			filename:this.flowNodeData[index].filename,
                  			id:this.flowNodeData[index].id,
                  			items:JSON.stringify(this.flowNodeData[index].items)
                  		}
                    });
            	}else if(this.flowNodeData[index].tempid == "593007c48c9082580984cef4"){
            		this.$router.push({
                  		path:'/blankPage',
                  		query:{
                  			flowid:this.flowNodeData[index].flowid,
                  			nodeid:this.flowNodeData[index].nodeid,
                  			tempid:this.flowNodeData[index].tempid,
                  			pageid:this.flowNodeData[index].pageid,
                  			filename:this.flowNodeData[index].filename,
                  			id:this.flowNodeData[index].id,
                  			items:JSON.stringify(this.flowNodeData[index].items)
                  		}
                    });
            	}else if(this.flowNodeData[index].tempid == "5959a4d08c9082580984cef5"){
            		this.$router.push({
                  		path:'/tabpage',
                  		query:{
                  			flowid:this.flowNodeData[index].flowid,
                  			nodeid:this.flowNodeData[index].nodeid,
                  			tempid:this.flowNodeData[index].tempid,
                  			pageid:this.flowNodeData[index].pageid,
                  			filename:this.flowNodeData[index].filename,
                  			id:this.flowNodeData[index].id,
                  			items:JSON.stringify(this.flowNodeData[index].items)
                  		}
                    });
            	}else if(this.flowNodeData[index].tempid == "5981429f8c9082580984cf0f"){
            		this.$router.push({
                  		path:'/tabsubmitform',
                  		query:{
                  			flowid:this.flowNodeData[index].flowid,
                  			nodeid:this.flowNodeData[index].nodeid,
                  			tempid:this.flowNodeData[index].tempid,
                  			pageid:this.flowNodeData[index].pageid,
                  			filename:this.flowNodeData[index].filename,
                  			id:this.flowNodeData[index].id,
                  			items:JSON.stringify(this.flowNodeData[index].items)
                  		}
                    });
            	}
            },
            setDefault (index) {
            	//设置默认页面

            	this.$http.get(this.globalconfig.setdefaultpageapi,
					{
	            		params:{
	            			flowid:this.flowNodeData[index].flowid,
	            			nodeid:this.flowNodeData[index].nodeid,
	            			page:this.flowNodeData[index].filename,
	            		}
	            	},{emulateJSON:true})
            	.then((response) =>{
            		if(response.body.error){
            			this.$Message.error(response.body.error)
            		}else{
            			this.$Message.success("成功")
            			console.log(response.data)
            		}
            	},(response)=>{
            		this.$Message.success('失败')
            	});
            },
            //设置页面为不可用
            remove (index) {
            	this.$http.get(this.globalconfig.delpageapi,
					{
	            		params:{
	            			pageid:this.flowNodeData[index].pageid
	            		}
	            	},{emulateJSON:true})
            	.then((response) =>{
            		if(response.body.error){
            			this.$Message.error(response.body.error)
            		}else{
        				this.flowNodeData.splice(index, 1);
            		}
            	},(response)=>{
            		this.$Message.success('失败')
            	});
          this.$http.get(this.globalconfig.deletepagesksapi,
            {
	            		params:{
	            			pageid:this.flowNodeData[index].pageid
	            		}
	            	},{emulateJSON:true})
            	.then((response) =>{
            		if(response.body.error){
            			this.$Message.error(response.body.error)
            		}
            	},(response)=>{
            		this.$Message.success('失败')
            	});
            },
            //创建页面模态框  获取模板信息
            createModalShow(){
            	this.$http.get(this.globalconfig.gettemplatesapi,
						{
		            		params:{

		            		}
		            	},{emulateJSON:true})
	            	.then((response) =>{
	            		if(response.body.error){
	            			this.$Message.error(response.body.error)
	            		}else{
	            			var ele = response.data.templete
	            			this.templist = []
	            			for (var i=0,l=ele.length;i<l;i++) {
	            				this.templist.push({
	            					value:ele[i].id,
	            					label:ele[i].desc
	            				})
	            			}
	            		}
	            	},(response)=>{
	            		this.$Message.success('失败')
	            	});
            	this.modalCreate= true
            },
            //提交
            ok :function(name){
            	//filename、pagename 不可重名
            	var pagename = this.formInline.filename

            	var filename = getPinyin(this.formInline.filename)
            	filename = stripscript(filename)
            	for(var i=0;i<filenames.length;i++){
            		if(filename == filenames[i].filename && this.querydata.flowid == filenames[i].flowid && this.querydata.nodeid == filenames[i].nodeid){
            			this.modalCreate = false;
            			this.formInline.filename = '';
            			this.$Message.error('文件名不可重复');
            			return false;
            		}
            	}
            	this.$refs[name].validate((valid) => {
            		if(valid){
            			//存页面信息到数据库  创建page
            			this.$http.get(this.globalconfig.createpageapi,{
            				params:{
            					flowid:this.querydata.flowid,
            					nodeid:this.querydata.nodeid,
            					filename:filename,
	                  			pagename:pagename,
	                  			tempid:this.formInline.tempid
            				}
            			},{emulateJSON:true})
            			.then((response)=>{
            				if(response.body.error){
            					this.$Message.error(response.body.error)
            				}else{
            					//判断选择的模板  来跳转到不同的编辑页面
            					for(var j=0;j<this.templist.length;j++){
            						if(this.formInline.tempid == this.templist[j].value){
            							this.formInline.temptype = this.templist[j].label
            						}
            					}
            					console.log(this.formInline)
            					if(this.formInline.temptype == '提交表单'){
	            					this.$router.push({
            							//提交表单
				                  		path:'/submitform',
				                  		query:{
				                  			flowid:this.querydata.flowid,
				                  			nodeid:this.querydata.nodeid,
				                  			filename:filename,
				                  			tempid:this.formInline.tempid,
				                  			pageid:response.data.page[0].pageid
				                  		}
				                    });
            					}else if(this.formInline.temptype == '审批表单'){
            						this.$router.push({
				                  		path:'/approval',
				                  		query:{
				                  			flowid:this.querydata.flowid,
				                  			nodeid:this.querydata.nodeid,
				                  			filename:filename,
				                  			tempid:this.formInline.tempid,
				                  			pageid:response.data.page[0].pageid
				                  		}
				                    });
            					}else if(this.formInline.temptype == '普通页面'){
            						this.$router.push({
				                  		path:'/blankPage',
				                  		query:{
				                  			flowid:this.querydata.flowid,
				                  			nodeid:this.querydata.nodeid,
				                  			filename:filename,
				                  			tempid:this.formInline.tempid,
				                  			pageid:response.data.page[0].pageid
				                  		}
				                    });
            					}else if(this.formInline.temptype == '标签页面'){
            						this.$router.push({
				                  		path:'/tabpage',
				                  		query:{
				                  			flowid:this.querydata.flowid,
				                  			nodeid:this.querydata.nodeid,
				                  			filename:filename,
				                  			tempid:this.formInline.tempid,
				                  			pageid:response.data.page[0].pageid
				                  		}
				                    });
            					}else if(this.formInline.temptype == '带页签提交表单'){
            						this.$router.push({
				                  		path:'/tabsubmitform',
				                  		query:{
				                  			flowid:this.querydata.flowid,
				                  			nodeid:this.querydata.nodeid,
				                  			filename:filename,
				                  			tempid:this.formInline.tempid,
				                  			pageid:response.data.page[0].pageid
				                  		}
				                    });
            					}

            				}
            			},(response)=>{
            				this.$Message.success('成功');
            			})


		            }
            	})
                //获取中文字符的拼音
                function getPinyin(el){
                	var pinyin = require("pinyin");
                	var pinyinArr = pinyin(el,{
                		style:pinyin.STYLE_NORMAL
                	})
                	var pinyinChar=''
                	for (var i=0, l=pinyinArr.length;i<l;i++) {
	        			pinyinChar += pinyinArr[i][0]
	        		}
                	el = pinyinChar;
                	pinyinChar=''
                	return el;
                }
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
        },
        created : function () {
            this.handleQuery();
        }
    }
    function stripscript(s) {
	    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？-]")
	        var rs = "";
	    for (var i = 0; i < s.length; i++) {
	        rs = rs + s.substr(i, 1).replace(pattern, '');
	    }
	    console.log(rs)
	    return rs;
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
