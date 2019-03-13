<style scoped>
    .mylabel{
        text-align: center;
        vertical-align: middle;
        float: left;
        font-size: 12px;
        color: #657180;
        line-height: 1;
        padding: 10px 12px 0 0;
        box-sizing: border-box;
        margin-bottom:10px
    }
    .mgt10{
        margin-top:10px;
    }
    .mgl10{
        margin-left:10px;
    }

</style>
<template>
<div>
  <Modal
      v-model="flowConditionModal"
      title="设置条件"
      @on-ok="flowConditionModalOk"
      @on-cancel="flowConditionModalCancel"
      width="900"
  >
      <Form ref="flowConditionModalForm" :model="flowConditionForm">
          <Row>
              <Col span="4">
                  <Card>
                      <p slot="title">
                          选择优先级
                      </p>
                      <Select v-model="flowConditionForm.priority">
                        <Option :value="0" :key="0">
                          {{0}}
                        </Option>
                          <Option v-for="item in 9" :value="item" :key="item">
                              {{item}}
                          </Option>
                      </Select>
                  </Card>
              </Col>

              <Col span="13">
                  <Card>
                      <p slot="title">
                          设置条件
                      </p>
                      <Row class="mgt10">
                        <Col span="3" class="mylabel">
                        <label>描述</label>
                        </Col>
                        <Col span="21">
                            <Input type="textarea" v-model.trim="flowConditionForm.desc" placeholder="请输入..." :rows="2"></Input>
                        </Col>
                      </Row>

                      <hr class="mgt10">

                      <Form-item v-for="(eachCondition, index) in flowConditionForm.conditions" :key="eachCondition.index">
                          <Row class="mgt10">
                              <Select v-model="eachCondition.preCondition" style="width:80px;" clearable>
                                  <!--这个option是第一行的，只能显示为空的一项-->
                                  <Option v-for="item in preConditionList" :value="item.value" :key="item.value" v-if="index ==0 && item.value==''">
                                    {{item.label}}
                                  </Option>
                                  <!--这个option不是第一行的，不能显示为空的一项-->
                                  <Option v-for="item in preConditionList" :value="item.value" :key="item.value" v-if="index !=0 && item.value!=''">
                                    {{item.label}}
                                  </Option>
                              </Select>

                              <Button type="primary" @click="showSelectKeyModalFn(index)" size="small">
                                  <p>选择术语</p>
                                  <hr>
                                  <p>{{eachCondition.btnStatus}}</p>
                              </Button>

                              <Select v-model="eachCondition.condition" style="width:80px;" clearable>
                                <Option v-for="item in conditionList" :value="item.value" :key="item.label">
                                  {{item.label}}
                                </Option>
                              </Select>

                              <Input v-model.trim="eachCondition.value" placeholder="请输入..." style="width:120px"></Input>

                            <Button type="error" @click="handleRemove(index)" class="mgl10">
                                <Icon type="trash-a" size="20"></Icon>
                            </Button>

                          </Row>
                      </Form-item>
                      <Form-item>
                        <Row>
                          <Col span="24">
                          <Button type="dashed" long @click="handleAdd" long icon="plus-round">新增</Button>
                          </Col>
                        </Row>
                      </Form-item>
                    </Card>
              </Col>
              <Col span="7">
                  <Card>
                      <p slot="title">
                          通知
                      </p>
                      <Row>
                          <Input :placeholder="personIptPlaceHolder" @on-click="showPersonSelect" icon="edit"></Input>
                      </Row>
                      <Row class="mgt10">
                          <p>请选择优先级</p>
                          <Select v-model="flowConditionForm.informPriority" placeholder="请选择优先级">
                              <Option v-for="item in 5" :value="item" :key="item">{{ item }}</Option>
                          </Select>
                      </Row>
                      <Row class="mgt10">
                          <p>选择同意消息跳转页面</p>
                          <Select v-model="flowConditionForm.messageDetailPage" placeholder="请选择消息详情页面">
                              <Option v-for="(item,index) in curFlowPageList" :value="item.value" :key="index">{{item.label}}</Option>
                          </Select>
                      </Row>
                      <Row class="mgt10">
                          <p>选择拒绝消息跳转页面</p>
                          <Select v-model="flowConditionForm.messageDenyDetailPage" placeholder="请选择消息详情页面">
                            <Option v-for="(item,index) in curFlowPageList" :value="item.value" :key="index">{{item.label}}</Option>
                          </Select>
                      </Row>
                      <Row class="mgt10">
                        <Select v-model="flowConditionForm.keyword1" placeholder="请选择重点字段1" clearable>
                          <Option v-for="(item,index) in curFlowSksList" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                      </Row>
                      <Row class="mgt10">
                        <Select v-model="flowConditionForm.keyword2" placeholder="请选择重点字段2" clearable>
                          <Option v-for="(item,index) in curFlowSksList" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                      </Row>
                      <Row class="mgt10">
                        <Select v-model="flowConditionForm.keyword3" placeholder="请选择重点字段3" clearable>
                          <Option v-for="(item,index) in curFlowSksList" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                      </Row>
                      <Row class="mgt10">
                        <Select v-model="flowConditionForm.keyword4" placeholder="请选择重点字段4" clearable>
                          <Option v-for="(item,index) in curFlowSksList" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                      </Row>
                  </Card>
              </Col>
          </Row>
      </Form>
  </Modal>

  <Modal
      v-model="showSelectKeyModal"
      title="选择术语"
      @on-ok="selectKeyModalOk"
      @on-cancel="selectKeyModalCancel">
          <Row>
              <Col span="4" class="mylabel">
                  <label>复杂术语</label>
              </Col>
              <Col span="20">
                  <Select v-model="curSelectKeyModal.curCkid" clearable>
                      <Option v-for="item in ajaxCkList" :value="item.value" :key="item.value">
                          {{ item.label }}
                      </Option>
                  </Select>
              </Col>
          </Row>
          <hr class="mgt10">
          <Row class="mgt10">
              <Col span="4" class="mylabel">
                  <label>简单术语</label>
              </Col>

              <Col span="9">
                  <Select v-model="curSelectKeyModal.curFlowid" clearable
                      @on-change="listCurFLowSk(curSelectKeyModal.curFlowid)">
                      <Option v-for="item in ajaxFlowList" :value="item.value" :key="item.value">
                          {{item.label}}
                      </Option>
                  </Select>
              </Col>
            <Col span="10" offset="1">
            <Select v-model="curSelectKeyModal.curSkid" clearable>
              <Option v-for="item in curSelectKeyModal.curSkList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
            </Col>
          </Row>
  </Modal>

   <!--选择人员弹出框-->
  <SelectPerson @fromselectperson="getSelectPersonMsg" :toSelectPersonMsg="toSelectPersonMsg" ref="SelectPerson"></SelectPerson>



</div>
</template>
<script>
    import SelectPerson from "./selectpersonModal"
    export default {
        components:{
            SelectPerson
        },
        props:[
            'toChildMsg'
        ],
        computed:{
            flowConditionModal(){
                return this.toChildMsg.isflowConditionModalShow;
            },
            flowid(){
                return this.toChildMsg.flowid;
            },
            conditionid(){
                return this.toChildMsg.conditionid;
            },
            messageconditionid(){
                return this.toChildMsg.messageconditionid;
            },
            nextnodeid(){
                return this.toChildMsg.nextnodeid;
            }

            // 优先级
            //priority(){
            //    return this.toChildMsg.priority;
            //}
        },
        data () {
            return {
                // 当前行的index
                curRowIndex : 0,
                ajaxCkList:[],
                // 所有的sk
                ajaxSkList:[],
                // 当前流程下的sk
                curFlowSksList:[],
                ajaxFlowList:[],
                ajaxConditions:[],
                ajaxMessageConditions:[],
                ajaxPages:[],

                // 当前节点创建的页面
                curFlowPageList:[],

                personIptPlaceHolder:"请选择人员",

                flowConditionForm:{
                    priority:0,
                    desc:'',
                    conditions:[
                         {
                              flowid:'',
                              skid:'',
                              ckid:'',

                              btnStatus:'还未设置',
                              preCondition:' ',
                              condition:'',
                              value:''
                         }
                    ],
                    informWho:{
                        persons:[],
                        groups:[],
                        departments:[]
                    },
                    informPriority:1,
                    messageDetailPage:"",
                    messageDenyDetailPage:'',
                    keyword1:"",
                    keyword2:"",
                    keyword3:"",
                    keyword4:"",
                },
                preConditionList:[
                    {
                        label:'空',
                        value:''
                    },
                    {
                        label:'与',
                        value:'&&'
                    },{
                        label:'或',
                        value:'||'
                    }
                ],
                conditionList:[
                    {
                        label:'大于',
                        value:'>'
                    },
                    {
                        label:'等于',
                        value:'=='
                    },
                    {
                        label:'小于',
                          value:'<'
                    }
                ],

                showSelectKeyModal:false,
                curSelectKeyModal:{},
                selectKeyModal:[
                    {
                        curCkid:'',
                        curSkid:'',
                        curFlowid:'',
                        curSkList:[
                            {
                                label:'此流程下无sk',
                                value:''
                            }
                        ]
                    }
                ],

                // 向选择人员的子组件你传递的数据
                toSelectPersonMsg:{
                    isSelectPersonModalShow:false,
                    isReshow:"empty",
                    persons:"",
                    groups:"",
                    apartments:"",
                    isAdmin:"empty"
                },
            }
        },

        watch:{
            flowid(){
               if(this.flowid != "" || this.flowid != "empty"){
                  var tempArr = [{
                      value:'',
                      label:'空'
                  }];
                  for(var i = 0 ; i < this.ajaxPages.length;i++){
                      if(this.ajaxPages[i].flowid == this.flowid){
                          var tempObj = {};
                          tempObj.value = this.ajaxPages[i].nodeid + '|' + this.ajaxPages[i].filename;
                          tempObj.label = this.ajaxPages[i].pagename  + "(" + this.ajaxPages[i].nodeid +")" ;
                          tempArr.push(tempObj);
                      }
                  }
                  this.curFlowPageList = tempArr;

                  //获取当前流程下的sk
                  var _tempArr = [{
                      label:'空',
                      value:''
                  }];
                  for(var i = 0 ; i < this.ajaxSkList.length;i++){
                      if(this.ajaxSkList[i].flowid == this.flowid){
                          var _tempObj = {};
                          _tempObj.label = this.ajaxSkList[i].name;
                          _tempObj.value = this.ajaxSkList[i].id;
                          _tempArr.push(_tempObj);
                      }
                  }
                  this.curFlowSksList = _tempArr;
               }
            },

            conditionid(){
            // 由html传过来的conditionid为"empty"，则把flowconditionform置为空
            // 这里使用'empty'是为了让watch监听到数据变化，使用''，if（this.conditionid == ""）不会执行
                if(this.conditionid == "empty"){
                    this.flowConditionForm.priority = 0;
                    this.flowConditionForm.desc = '';
                    this.flowConditionForm.conditions = [
                        {
                            flowid:'',
                            skid:'',
                            ckid:'',

                            btnStatus:'还未设置',
                            preCondition:'',
                            condition:'',
                            value:''
                        }
                    ];

                    this.selectKeyModal = [
                        {
                            curCkid:'',
                            curSkid:'',
                            curFlowid:'',
                            curSkList:[
                                {
                                    label:'此流程下无sk',
                                    value:''
                                }
                            ]
                        }
                    ];
                    this.curSelectKeyModal = {};
                    this.curRowIndex = 0;
                }else{
                    // 这里是由html传过来的conditionid不为空，回显数据
                    var _conditionInfo = this.getConditioinById(this.conditionid);
                    // 这里的值是保存用以及form中的显示----Start
                    this.flowConditionForm.priority = Number(this.toChildMsg.priority);
                    this.flowConditionForm.desc = _conditionInfo.desc;
                    this.flowConditionForm.conditions = [];

                    // 赋值之前，先清空对应的data
                    this.selectKeyModal = [];
                    for(var i = 0 ;i <_conditionInfo.operations.length;i++){
                        // 这是赋给flowConditionForm的临时变量
                        var _tempFormObj = {}
                        // 这是赋给selectKeyModal的临时变量
                        var _tempKeyObj = {}
                        _tempFormObj.preCondition = _conditionInfo.operations[i].operation;
                        _tempFormObj.condition = _conditionInfo.operations[i].func.operate;
                        _tempFormObj.value = _conditionInfo.operations[i].func.value;
                        _tempFormObj.flowid = '';
                        _tempFormObj.skid = '';
                        _tempFormObj.ckid = '';

                        _tempKeyObj.curFlowid = '';
                        _tempKeyObj.curCkid = '';
                        _tempKeyObj.curSkid = '';
                        if(_conditionInfo.operations[i].func.keytype == "ck"){
                            _tempFormObj.ckid = _conditionInfo.operations[i].func.keyid;

                            _tempKeyObj.curCkid = _conditionInfo.operations[i].func.keyid;
                        }
                        if(_conditionInfo.operations[i].func.keytype == "sk"){
                            _tempFormObj.skid = _conditionInfo.operations[i].func.keyid;
                            _tempFormObj.flowid = _conditionInfo.operations[i].func.flowid;

                            _tempKeyObj.curFlowid = _conditionInfo.operations[i].func.flowid;
                            _tempKeyObj.curSkid = _conditionInfo.operations[i].func.keyid;
                            _tempKeyObj.curSkList = this.listCurFLowSk(_conditionInfo.operations[i].func.flowid,true)
                        }

                        // 不管是ckid还是skid，只要有，就是已设置条件
                        if(_conditionInfo.operations[i].func.keyid){
                            _tempFormObj.btnStatus = "已设置";
                        }else{
                            _tempFormObj.btnStatus = "还未设置";
                        }
                        this.flowConditionForm.conditions.push(_tempFormObj)

                        // 这里的值是弹出框ck,sk等用
                        this.selectKeyModal.push(_tempKeyObj);
                    }
                    // 这里的值是保存用以及form中的显示----End
                }
            },
            messageconditionid(){
                if(this.messageconditionid == "empty"){
                    this.flowConditionForm.informWho.persons = [];
                    this.flowConditionForm.informWho.groups = [];
                    this.flowConditionForm.informWho.departments = [];
                    this.flowConditionForm.informPriority = 1;
                    this.flowConditionForm.messageDetailPage = "";
                    this.flowConditionForm.messageDenyDetailPage = "";
                    this.flowConditionForm.keyword1 = "";
                    this.flowConditionForm.keyword2 = "";
                    this.flowConditionForm.keyword3 = "";
                    this.flowConditionForm.keyword4 = "";
                }else{
                    // 这里是由flow传过来的messageconditionid，回显通知的数据
                    var _messageConditionInfo = this.getMessageConditionById(this.messageconditionid);
                    this.flowConditionForm.informPriority = Number(_messageConditionInfo.priority);
                    this.flowConditionForm.keyword1 = _messageConditionInfo.keyword1 ? _messageConditionInfo.keyword1 : "";
                    this.flowConditionForm.keyword2 = _messageConditionInfo.keyword2 ? _messageConditionInfo.keyword2 : "";
                    this.flowConditionForm.keyword3 = _messageConditionInfo.keyword3 ? _messageConditionInfo.keyword3 : "";
                    this.flowConditionForm.keyword4 = _messageConditionInfo.keyword4 ? _messageConditionInfo.keyword4 : "";
                    this.flowConditionForm.messageDetailPage = _messageConditionInfo.nodeid + '|' +_messageConditionInfo.page;
                    this.flowConditionForm.messageDenyDetailPage = _messageConditionInfo.denynodeid + "|" + _messageConditionInfo.denypage;
                    if(_messageConditionInfo.toIDs && _messageConditionInfo.toIDs.length > 0){
                        this.flowConditionForm.informWho.persons = _messageConditionInfo.toIDs;
                    }else{
                        this.flowConditionForm.informWho.persons = [];
                    }

                    if(_messageConditionInfo.groupIDs && _messageConditionInfo.groupIDs.length > 0){
                        this.flowConditionForm.informWho.groups = _messageConditionInfo.groupIDs;
                    }else{
                        this.flowConditionForm.informWho.groups = [];
                    }

                    if(_messageConditionInfo.departmentIDs && _messageConditionInfo.departmentIDs.length > 0 ){
                        this.flowConditionForm.informWho.departments = _messageConditionInfo.departmentIDs;
                    }else{
                        this.flowConditionForm.informWho.departments = [];
                    }

                    if( _messageConditionInfo.departmentIDs && _messageConditionInfo.departmentIDs.length > 0 ||
                        _messageConditionInfo.groupIDs && _messageConditionInfo.groupIDs.length > 0 ||
                        _messageConditionInfo.toIDs && _messageConditionInfo.toIDs.length > 0
                    ){
                        this.personIptPlaceHolder = "已选择";
                    }
                }
            }
        },

        methods: {
            // 列出所有的ck
            handleListCks(){
                this.$http.get(this.globalconfig.listcksapi,{
                    params:{}
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        if(response.data.cks){
                            for(var i = 0;i < response.data.cks.length;i++){
                                var _eachCk = {}
                                _eachCk.value = response.data.cks[i].id;
                                _eachCk.label = response.data.cks[i].name;
                                this.ajaxCkList.push(_eachCk);
                            }
                        }
                    }
                },(response)=>{
                    this.$Message.error("读取cks失败")
                })
            },

            // 列出所有的flow
            handleListFlows(){
                this.$http.get(this.globalconfig.listflow,{
                    params:{}
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        if(response.data.flows){
                            for(var i = 0;i < response.data.flows.length;i++){
                                var _flow = {};
                                _flow.label = response.data.flows[i].name;
                                _flow.value = response.data.flows[i].id;
                                this.ajaxFlowList.push(_flow)
                            }
                        }
                    }
                },
                (response)=>{
                    this.$Message.error("读取Flow失败")
                })
            },

            // 列出所有的sk
            handleListSks(){
                this.$http.get(this.globalconfig.listsksapi,{

                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        if(response.data.sks){
                            this.ajaxSkList = response.data.sks;
                        }
                    }
                },
                (response)=>{
                    this.$Message.error("读取sks失败")
                })
            },

            // 列出所有条件
            handleListConditions(){
                this.$http.get(this.globalconfig.listconditionsapi,{

                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        if(response.data.conditions){
                            this.ajaxConditions = response.data.conditions;
                        }
                    }
                },(response)=>{
                    this.$Message.error("读取conditions失败")
                })
            },

            // 列出所有消息的条件
            hangleQueryMessageConditions(){
                this.$http.get(this.globalconfig.listmessageconditionsapi,{

                },{emulateJSON:true})
                .then((response)=>{
                     if(response.data){
                        if(response.data.conditions){
                            this.ajaxMessageConditions = response.data.conditions;
                        }
                     }
                },(response)=>{
                    this.$Message.error("读取messageconditions失败")
                })
            },

            // 列出所有的pages
            handleQueryGetallpages(){
                this.$http.get(this.globalconfig.getallpagesapi,{

                },{emulateJSON:true})
                .then((response)=>{
                    this.ajaxPages = response.data.pages;
                },
                (response)=>{
                    this.$Message.error("读取allpage失败");
                })
            },

            // 根据当前的conditionid找到对用的condition信息
            getConditioinById(conditionid){
                for(var i = 0 ; i < this.ajaxConditions.length;i++){
                    if(this.ajaxConditions[i].id == conditionid){
                        return this.ajaxConditions[i];
                    }
                }
            },

             // 根据当前的messageconditionid找到对应的messageCondition信息
             getMessageConditionById(id){
                for(var i = 0 ; i < this.ajaxMessageConditions.length;i++){
                    if(this.ajaxMessageConditions[i].id == id){
                        return this.ajaxMessageConditions[i];
                    }
                }
             },

            // 展开shoeSelectKeyModal弹出框
            showSelectKeyModalFn(idx){
                this.curRowIndex = idx;
                this.curSelectKeyModal = this.selectKeyModal[this.curRowIndex];
                this.showSelectKeyModal = !this.showSelectKeyModal;
            },


            // 列出当前流程下的sk,isReshow位true则为回显数据时用，return出数据
            listCurFLowSk(flowid,isReshow){
                var _curFlowList = [];
                for(var i = 0;i < this.ajaxSkList.length;i++){
                    if(this.ajaxSkList[i].flowid == flowid){
                        var _sk = {};
                        _sk.label = this.ajaxSkList[i].name;
                        _sk.value = this.ajaxSkList[i].id;
                        _curFlowList.push(_sk);
                    }
                }
                if(_curFlowList.length == 0){
                    _curFlowList = [
                        {
                            label:'此流程下无sk',
                            value:''
                        }
                    ]
                }

                if(isReshow){
                    return _curFlowList;
                }else{
                    this.selectKeyModal[this.curRowIndex].curSkList = _curFlowList;
                }
            },

            // 增加一行
            handleAdd () {
                var _conditionsRow = {

                    flowid:'',
                    skid:'',
                    ckid:'',

                    btnStatus:'还未设置',
                    preCondition:'',
                    condition:'',
                    value:''
                };
                this.flowConditionForm.conditions.push(_conditionsRow);

                var _selectKeyModal = {
                    curCkid:'',
                    curSkid:'',
                    curFlowid:'',
                    curSkList:[
                        {
                            label:'此流程下无sk',
                            value:''
                        }
                    ]
                };
                this.selectKeyModal.push(_selectKeyModal);
            },

            //删除一行
            handleRemove (index) {
                this.flowConditionForm.conditions.splice(index, 1);
                this.selectKeyModal.splice(index,1);
            },

            //选择术语modal的ok
            selectKeyModalOk(){
                if(this.selectKeyModal[this.curRowIndex].curCkid && this.selectKeyModal[this.curRowIndex].curSkid){
                    this.$Message.warning('术语只能选择一个');
                }

                this.flowConditionForm.conditions[this.curRowIndex].btnStatus = '还未设置';
                if(this.selectKeyModal[this.curRowIndex].curCkid || this.selectKeyModal[this.curRowIndex].curSkid){
                    this.flowConditionForm.conditions[this.curRowIndex].btnStatus = '已设置';
                }

                this.flowConditionForm.conditions[this.curRowIndex].ckid = this.selectKeyModal[this.curRowIndex].curCkid;
                this.flowConditionForm.conditions[this.curRowIndex].flowid = this.selectKeyModal[this.curRowIndex].curFlowid;
                this.flowConditionForm.conditions[this.curRowIndex].skid = this.selectKeyModal[this.curRowIndex].curSkid;
            },

            selectKeyModalCancel(){
                // this.$Message.info('点击了取消');
            },

            // 展示人员弹出框
            showPersonSelect(){
                this.toSelectPersonMsg.isSelectPersonModalShow = true;
                if(this.messageconditionid == "empty"){
                    this.toSelectPersonMsg.isReshow = "false";
                }else{
                    this.toSelectPersonMsg.isReshow = "true";
                    this.toSelectPersonMsg.persons = this.flowConditionForm.informWho.persons;
                    this.toSelectPersonMsg.groups = this.flowConditionForm.informWho.groups;
                    this.toSelectPersonMsg.apartments = this.flowConditionForm.informWho.departments;
                }


            },

            getSelectPersonMsg(data){
                this.toSelectPersonMsg.isSelectPersonModalShow = false;
                this.toSelectPersonMsg.isReshow = "empty";
                this.toSelectPersonMsg.isAdmin = "empty";

                if(data.isClickOk == true){
                    this.flowConditionForm.informWho.persons = data.persons;
                    this.flowConditionForm.informWho.groups = data.groups;
                    this.flowConditionForm.informWho.departments = data.apartments;
                }

                if(data.persons && data.persons.length > 0 || data.groups && data.groups.length > 0 || data.apartments && data.apartments.length > 0){
                    this.personIptPlaceHolder = "已选择";
                }
            },

            flowConditionModalOk () {
                // 从父级传过来的flowid
                var _flowid = '';
                if(this.flowid){
                    _flowid = this.flowid;
                }

                // 从父级传过来的conditionid,在更新数据时候有用
                var _conditionid = '';
                if(this.conditionid){
                    _conditionid = this.conditionid;
                }

                // 从父级传过来的messageconditionid，在更新数据时候有用
                var _messageconditionid = "";
                if(this.messageconditionid){
                    _messageconditionid = this.messageconditionid;
                }

                var _desc = this.flowConditionForm.desc;
                var _priority = this.flowConditionForm.priority;

                var _operations = [];
                for(var i = 0;i < this.flowConditionForm.conditions.length;i++){
                    var _temp = {};
                    _temp.operation = this.flowConditionForm.conditions[i].preCondition;
                    _temp.func = {};

                    if(this.flowConditionForm.conditions[i].ckid && this.flowConditionForm.conditions[i].skid){
                        this.$Message.error({
                            content: '术语选择重复,不能提交',
                            duration: 5,
                            closable: true
                        });
                        return;
                    }

                    if(this.flowConditionForm.conditions[i].ckid){
                        _temp.func.keyid = this.flowConditionForm.conditions[i].ckid;
                        _temp.func.keytype = "ck";
                    }

                    // 判断有sk时再存入sk对应的flowid，这个flowid仅用于回显
                    if(this.flowConditionForm.conditions[i].skid){
                        _temp.func.keyid = this.flowConditionForm.conditions[i].skid;
                        _temp.func.keytype = "sk";
                        _temp.func.flowid = this.flowConditionForm.conditions[i].flowid;
                    }

                    _temp.func.operate = this.flowConditionForm.conditions[i].condition;
                    _temp.func.value = this.flowConditionForm.conditions[i].value;

                    _operations.push(_temp)
                }

                // todo:这个允许创建的条件，回头需要自私斟酌，修改
                if(_desc || _priority != 0 || _operations[0].func.operate || _operations[0].func.value ||
                    _operations[0].operation ){

                    console.log('save')
                    this.$http.get(this.globalconfig.createorupdateconditionapi,{
                        params:{
                            flowid:_flowid,
                            desc:_desc,
                            conditionid:_conditionid,
                            operations:_operations
                        }
                    },{emulateJSON:true})
                    .then((response)=>{
                        if(response.data){
                            if(response.data.id){
                                var _id = response.data.id;
                                var data = {};
                                // 向父级vue传递条件的id
                                data.conditionid = _id;
                                // 向父级传递优先级
                                data.priority = this.flowConditionForm.priority;
                                // 向父级传递条件的desc
                                data.desc = this.flowConditionForm.desc;
                                // 向父级vue传递当前Modal的状态
                                data.isflowConditionModalShow = false;
                                this.$emit('toparent',data);
                                this.$Message.info('提交成功');
                            }
                        }
                    },
                    (response)=>{
                        this.$Message.error('提交失败')
                    })
                }else{
                    var data = {};
                    data.conditionid = "";
                    data.priority = 0;
                    data.desc = "";
                    data.messageconditionid = '';
                    // 向父级vue传递当前Modal的状态
                    data.isflowConditionModalShow = false;
                    this.$emit('toparent',data);
                }

                // 这是保存消息中的条件
                var _informPriority = this.flowConditionForm.informPriority;
                var _nodeid = this.nextnodeid;
                var _pageandnodeid = this.flowConditionForm.messageDetailPage;
                var _nodeid = _pageandnodeid.split("|")[0];
                var _page = _pageandnodeid.split("|")[1] ? _pageandnodeid.split("|")[1] : "";
                var _denypageandnodeid = this.flowConditionForm.messageDenyDetailPage;
                var _denynodeid = _denypageandnodeid.split("|")[0];
                var _denypage = _denypageandnodeid.split("|")[1] ? _denypageandnodeid.split("|")[1] : "";
                var _departments = this.flowConditionForm.informWho.departments;
                var _persons = this.flowConditionForm.informWho.persons;
                var _groups = this.flowConditionForm.informWho.groups;
                var _keyword1 = this.flowConditionForm.keyword1;
                var _keyword2 = this.flowConditionForm.keyword2;
                var _keyword3 = this.flowConditionForm.keyword3;
                var _keyword4 = this.flowConditionForm.keyword4;
                // todo:这个允许创建的条件，回头需要仔细斟酌，修改

                if( _departments.length > 0 || _persons.length > 0 || _groups.length > 0 ||
                    _keyword1 || _keyword2 || _keyword3 || _keyword4){

                     console.log('messagecondition save')

                    this.$http.get(this.globalconfig.updateorcreatemessageconditionapi,{
                        params:{
                            id:this.messageconditionid,
                            nodeid:_nodeid,
                            denynodeid:_denynodeid,
                            toIDs:_persons,
                            groupIDs:_groups,
                            priority:_informPriority,
                            departments:_departments,
                            keyword1:_keyword1,
                            keyword2:_keyword2,
                            keyword3:_keyword3,
                            keyword4:_keyword4,
                            flowid:_flowid,
                            denypage:_denypage,
                            page:_page
                        }
                    },{emulateJSON:true})
                    .then((response)=>{
                        if(response.data){
                            if(response.data.id){
                                var data = {};
                                data.messageconditionid = response.data.id;

                                this.$emit('toparent',data);
                            }
                        }
                    },
                    (response)=>{
                        this.$Message.error("提交失败");
                    })
                }else{
                    var data = {}
                    data.messageconditionid = "";
                    this.$emit('toparent',data);
                }
            },

            flowConditionModalCancel () {
                var data = {};
                data.conditionid = '';
                data.messageconditionid = '';
                data.priority = 0;
                data.desc = "";
                // 向父级vue传递当前Modal的状态
                data.isflowConditionModalShow = false;
                this.$emit('toparent',data);
            },
        },

        created(){
            this.handleListCks();
            this.handleListFlows();
            this.handleListSks();
            this.handleListConditions();
            this.hangleQueryMessageConditions();
            this.handleQueryGetallpages();
        }
    }
</script>
