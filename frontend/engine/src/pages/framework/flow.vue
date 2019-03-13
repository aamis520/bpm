<style scoped>
  .header{
      margin-bottom:10px;
      overflow:hidden;
  }
  .right{
      float:right;
  }

</style>

<template>
    <section>
      <div class="header">
        <Row>
          <Col span="6">
            <h3>流程列表</h3>
          </Col>
          <Col>
            <i-button class="right" type="info" @click="showModal = !showModal">创建</i-button>
          </Col>
        </Row>
      </div>
      <i-table :columns="tableTitle" :data="allFlowInfos" ></i-table>

      <Modal
        v-model="showModal"
        title="创建流程"
        @on-ok="ok"
        @on-cancel="cancel">
        <Form>
          <Form-item>
            <Row>
              <Col span="6" style="text-align: right;">
                流程名称：
              </Col>
              <Col span="16" offset="1">
                <i-input placeholder="请输入..." v-model="flowname"></i-input>
              </Col>
            </Row>
          </Form-item>
          <Form-item>
            <Row>
              <Col span="6" style="text-align: right;">
                流程描述：
              </Col>
              <Col span="16" offset="1">
                <i-input placeholder="请输入..." v-model="flowdesc"></i-input>
              </Col>
            </Row>
          </Form-item>
        </Form>
      </Modal>

      <!--修改流程名称及描述-->
      <Modal
        v-model="isEditNameAndDescShow"
        title="普通的Modal对话框标题"
        @on-ok="EditNameAndDescOk"
        @on-cancel="EditNameAndDescCancel">
        <Form>
          <Form-item>
            <Row>
              <Col span="6" style="text-align: right;">
              流程名称：
              </Col>
              <Col span="16" offset="1">
              <i-input placeholder="请输入..." v-model="editFlowName"></i-input>
              </Col>
            </Row>
          </Form-item>
          <Form-item>
            <Row>
              <Col span="6" style="text-align: right;">
              流程描述：
              </Col>
              <Col span="16" offset="1">
              <i-input placeholder="请输入..." v-model="editFlowDesc"></i-input>
              </Col>
            </Row>
          </Form-item>
        </Form>
      </Modal>
    </section>
</template>

<script>

    export default {
        data () {
            return {
                flowid:'',
                showModal: false,
                flowname:'',
                flowdesc:'',

                editFlowName:'',
                editFlowDesc:'',
                curRowIndex : -1,

                tableTitle: [
                    {
                        title: '流程ID',
                        key: 'id'
                    },
                    {
                        title: '流程名称',
                        key: 'name'
                    },
                    {
                        title: '流程描述',
                        key: 'desc'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.index)
                                        }
                                    }
                                }, '编辑'),
                                h('Button',{
                                    props:{
                                        type:'warning',
                                        size:'small'
                                    },
                                    on:{
                                        click:() => {
                                            this.editNameAndDesc(params.index)
                                        }
                                    }
                                },'修改名称及描述')
                            ]);
                        }
                    }
                ],
                allFlowInfos: [
                    {
                        id: '',
                        name: '',
                        desc: '',
                    }
                ],
                allFlowNames:[],

                isEditNameAndDescShow : false,

            }
        },
        methods : {
        //弹出框确认
            ok () {
                if(this.allFlowNames.indexOf(this.flowname) > -1){
                    this.$Message.error("流程名称重复,请修改");
                    return false;
                }

                this.$http.get(this.globalconfig.createflow,{
                    params:{
                      flowname:this.flowname,
                      flowdesc:this.flowdesc
                    }
                },{emulateJSON:true})
                .then((response) => {
                    if(response.body.error){
                        this.$Message.error(response.body.error)
                    }else{
                        if(response.data.id){
                            this.$Message.success("创建成功",1);
                            this.$router.push({
                                path:'/flowDesign',
                                query:{
                                  flowid:response.data.id,
                                  name:response.data.name,
                                  desc:response.data.desc
                                }
                            })
                        }else{
                            this.$Message.error('创建失败')
                        }
                    }
                },(response)=>{
	            		  this.$Message.error('创建失败')
	            	});
            },

            //弹出框拒绝
            cancel () {
                this.$Message.info('点击了取消');
                this.flowname = '';
                this.flowdesc = '';
            },

            //编辑按钮
            edit (index) {
                this.$Message.info(this.allFlowInfos[index].id,2)
                this.$router.push({
                    path:'/flowDesign',
                    query:{
                        flowid:this.allFlowInfos[index].id,
                        name:this.allFlowInfos[index].name,
                        desc:this.allFlowInfos[index].desc
                    }
                })
            },

            editNameAndDesc(index){
                this.isEditNameAndDescShow = true;
                this.flowid = this.allFlowInfos[index].id;
                this.editFlowDesc = '';
                this.editFlowName = '';
                this.curRowIndex = index;
                this.editFlowName = this.allFlowInfos[index].name;
                this.editFlowDesc = this.allFlowInfos[index].desc;
            },

            EditNameAndDescOk(){
                var _name = this.editFlowName;
                var _desc = this.editFlowDesc;
                if( !(_name && _desc) ){
                    this.$Message.info("请填写名称和描述信息")
                    return;
                }
                this.$http.get(this.globalconfig.reeditflownameanddescapi,{
                    params:{
                        flowid:this.flowid,
                        name:_name,
                        desc:_desc
                    }
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data.id){
                        this.allFlowInfos[this.curRowIndex].name = _name;
                        this.allFlowInfos[this.curRowIndex].desc = _desc;
                        this.$Message.info("修改成功")
                    }
                },
                (response)=>{
                    this.$Message.info(response.body.error)
                })
            },

            EditNameAndDescCancel(){
                this.editFlowName = '';
                this.editFlowDesc = '';
            },

            //进入页面获取数据
            getdata() {
                this.$http.get(this.globalconfig.listmainflowapi,{

                },{emulateJSON:true})
                .then((response)=>{
                    if(response.body.error){
                        this.$Message.error(response.body.error)
                    }else{
                        if(response.data.flows){
                            this.allFlowInfos = response.data.flows;
                            for(var i = 0 ; i < this.allFlowInfos.length; i++){
                                this.allFlowNames.push(this.allFlowInfos[i].name)
                            }
                        }

                    }
                },(response) => {
                    this.$Message.info(response.body.error)
                })
            }

        },
        created:function(){
          this.getdata();
        }

    }

</script>
