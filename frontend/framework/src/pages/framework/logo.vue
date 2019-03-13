<style scoped>
    .title{
        font-size:20px;
        font-weight: normal;
    }
    .content{
        height:400px;
    }
    .uploadTip{
        color:red;
        font-size:12px;
        position:absolute;
        left:0px;
        top:90px;
    }
</style>
<template>
    <Row>
        <Col span="24">
            <Card :bordered="false">
                <p class="title" slot="title">首页属性设置</p>
                <p class="content">
                   <!--
                       <Row style="margin-top:20px;">
                        <Col span="3" push="4" style="margin-top:20px;"><b>LOGO设置</b></Col>
                        <Col span="4" push="4"><div :style="imageShow" ref="image"></div></Col>
                        <Col span="4" push="5" style="margin-top:20px;">
                            <Upload 
                                :before-upload="beforeupload" 
                                :format="['png','jpg']" 
                                :max-size="1024"
                                :on-exceeded-size="superSize"
                                :on-format-error="nosupport" 
                                :on-success="success"
                                :show-upload-list=false
                                :data="submitdata"
                                action=uploadurl
                            >
                                <Button type="primary">上传logo</Button>
                            </Upload>
                            <div class="uploadTip">(图片支持PNG、JGP等格式，大小不超过1M)</div>
                        </Col>
                   </Row>
                   -->
                   <Row style="margin-top:20px;">
                        <Col span="3" push="4" style="margin-top:20px;"><b>单位名称</b></Col>
                        <Col span="20" push="4" style="margin-top:15px;">
                            <Input v-model="companyName" placeholder="请输入..." style="width:300px;"></Input>
                            <Button type="info" @click="submit">提交</Button>
                            <Button type="ghost" @click="cancel" >清空</Button>
                        </Col>
                   </Row>
                </p>
            </Card>
        </Col>
    </Row>
</template>
<script>
export default {
		data() {
			return {
				companyName : "",
                submitdata:{},
                uploadurl:this.globalconfig.uploadlogoapi,
                imageShow:{
                    width:"150px",
                    height:"150px",
                    border:"1px solid #ddd",  
                    borderRadius: "3px",
                    backgroundImage:"",
                    backgroundSize:"cover"    
                }
			}
		},
		methods: {
            beforeupload(file){//上传前的钩子
                this.submitdata.filename = file.name;
            },
            superSize(){//文件过大的钩子
                this.$Message.error("上传文件过大");
            },
            nosupport(){//格式错误的钩子
                this.$Message.error("不支持此格式");
            },
            submit(){//提交按钮 -- 改变左上角logo 和  单位名称 （仅仅是处理公司名称的的上传）
                var me = this;
                if(this.companyName){
                    this.$http.get(this.globalconfig.uploadcompanynameapi,{
                        params:{
                            companyname : me.companyName     
                        }
                    },{
                        emulateJSON: true
                    }).then((response) => {
						if(response.body.error) {
							this.$Message.error("公司名称设置失败")
						} else {
							this.$Message.success('设置成功');
                            /*在这里给index.vue设置logo和公司名*/
						}
					});
                } else {
                    this.$Message.error("公司名称不能为空");
                } 
            },
            cancel(){//取消
                this.companyName = "";
            },
            success(response, file, fileList){//上传图片成功的钩子，在这里获取路径给div添加背景图片

                //服务器上还没布置相应的下载功能，不能得到图片--回显暂时不做
                this.$Message.success("上传成功");
                //path是文件的路径
                var path = response.file.path;
            }
		},
        mounted:function(){
            //console.log(this.$refs.image.style); 
            var me = this;
            this.$http.get(this.globalconfig.uploadcompanynameapi,{
            },{
                emulateJSON: true
            }).then((response) => {
                if(response.body.success){
                    me.companyName = response.body.success.companyname;
                }
            });      
		}
	}
</script>