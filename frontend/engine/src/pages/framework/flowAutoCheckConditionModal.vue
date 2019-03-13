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
    .mgl-delbtn{
        margin-left:50px;
    }
</style>
<template>
<div>
    <Modal
        v-model="isAutoCheckModalShow"
        title="设置自动审批条件"
        @on-ok="autoCheckModalOk"
        @on-cancel="autoCheckModalCancel">
        <Form ref="autoCheckConditionModal" :model="autoCheckForm">
            <Row class="mgt10">
                <Col span="3" class="mylabel">
                <label>描述</label>
                </Col>
                <Col span="21">
                <Input type="textarea" v-model.trim="autoCheckForm.desc" placeholder="请输入..." :rows="2"></Input>
                </Col>
            </Row>
            <hr class="mgt10">
            <Form-item
            v-for="(eachCondition, index) in autoCheckForm.conditions"
            :key="index"
            >
                <Row class="mgt10">
                    <Select v-model="eachCondition.preCondition" style="width:80px;" clearable>
                        <!--这个option是第一行的，只能显示为空的一项-->
                        <Option v-for="item in preConditionList" :value="item.value" :key="item.label" v-if="index ==0 && item.value==''">
                            {{item.label}}
                        </Option>
                        <!--这个option不是第一行的，不能显示为空的一项-->
                        <Option v-for="item in preConditionList" :value="item.value" :key="item.label" v-if="index !=0 && item.value!=''">
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

                    <Button type="error" @click="handleRemove(index)" class="mgl-delbtn">
                      <Icon type="trash-a" size="20"></Icon>
                    </Button>

                </Row>
            </Form-item>
            <Form-item>
                <Row>
                    <Col span="24">
                    <Button type="dashed" long @click="handleAdd" icon="plus-round">新增</Button>
                    </Col>
                </Row>
            </Form-item>
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
        <Option v-for="item in ajaxCkList" :value="item.value" :key="item.label">
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
        <Option v-for="item in ajaxFlowList" :value="item.value" :key="item.label">
          {{item.label}}
        </Option>
      </Select>
      </Col>
      <Col span="10" offset="1">
      <Select v-model="curSelectKeyModal.curSkid" clearable>
        <Option v-for="item in curSelectKeyModal.curSkList" :value="item.value" :key="item.label">
          {{ item.label }}
        </Option>
      </Select>
      </Col>
    </Row>
  </Modal>

</div>
</template>
<script>
    export default {
        props:[
            'toautocheckMsg'
        ],
        computed:{
            isAutoCheckModalShow(){
                return this.toautocheckMsg.isAutoCheckModalShow;
            },
            flowid(){
                return this.toautocheckMsg.flowid;
            },
            autoCheckMsgid(){
                return this.toautocheckMsg.autoCheckMsgid;
            },
        },
        data () {
            return {
                ajaxCkList:[],
                ajaxSkList:[],
                ajaxFlowList:[],
                ajaxautoCheckConditions:[],

                 // 当前行的index
                curRowIndex : 0,
                autoCheckForm: {
                    desc:'',
                    conditions: [
                        {
                            flowid:'',
                            skid:'',
                            ckid:'',

                            btnStatus:'还未设置',
                            preCondition: '',
                            condition:'',
                            value:''
                        }
                    ]
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
            }
        },

        watch:{
            autoCheckMsgid(){
                // 如果由html传过来的autoCheckMsgid为“empty”,则把autoCheckForm置空
                // 这里使用'empty'是为了让watch监听到数据变化，使用''，if（this.autoCheckMsgid == ""）不会执行
                if(this.autoCheckMsgid == "empty"){
                    this.autoCheckForm = {
                        desc:'',
                        conditions: [
                            {
                                flowid:'',
                                skid:'',
                                ckid:'',

                                btnStatus:'还未设置',
                                preCondition: '',
                                condition:'',
                                value:''
                            }
                        ]
                    };
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
                    if(!this.autoCheckMsgid){
                        return
                    }
                    var _autoCheckConditionInfo = this.getAutoCheckConditionById(this.autoCheckMsgid);
                    console.log(_autoCheckConditionInfo)
                    this.autoCheckForm = {
                        desc:_autoCheckConditionInfo.desc,
                        conditions:[]
                    };

                    // 赋值之前，先清空对饮的data
                    this.selectKeyModal = [];

                    for(var i = 0; i < _autoCheckConditionInfo.operations.length;i++){
                       // 这里是赋给 autoCheckForm 的临时变量
                        var _tempFormObj = {};
                        // 这里是赋给selectKeyModal的临时变量
                        var _tempKeyObj = {};

                        _tempFormObj.preCondition = _autoCheckConditionInfo.operations[i].operation;
                        _tempFormObj.condition = _autoCheckConditionInfo.operations[i].func.operate;
                        _tempFormObj.value = _autoCheckConditionInfo.operations[i].func.value;
                        _tempFormObj.flowid = '';
                        _tempFormObj.skid = '';
                        _tempFormObj.ckid = '';

                        _tempKeyObj.curFlowid = '';
                        _tempKeyObj.curCkid = '';
                        _tempKeyObj.curSkid = '';

                        if(_autoCheckConditionInfo.operations[i].func.keytype == "ck"){
                            _tempFormObj.ckid = _autoCheckConditionInfo.operations[i].func.keyid;

                            _tempKeyObj.curCkid = _autoCheckConditionInfo.operations[i].func.keyid;
                        }

                        if(_autoCheckConditionInfo.operations[i].func.keytype == "sk"){
                            _tempFormObj.skid = _autoCheckConditionInfo.operations[i].func.keyid;
                            _tempFormObj.flowid = _autoCheckConditionInfo.operations[i].func.flowid;

                            _tempKeyObj.curFlowid = _autoCheckConditionInfo.operations[i].func.flowid;
                            _tempKeyObj.curSkid = _autoCheckConditionInfo.operations[i].func.keyid;
                            _tempKeyObj.curSkList = this.listCurFLowSk(_autoCheckConditionInfo.operations[i].func.flowid,true)
                        }

                        // 不管是ckid还是skid，只要有，就是已设置条件
                        if(_autoCheckConditionInfo.operations[i].func.keyid){
                            _tempFormObj.btnStatus = "已设置";
                        }

                        this.autoCheckForm.conditions.push(_tempFormObj);

                        // 这里的值是弹出框ck，sk等用
                        this.selectKeyModal.push(_tempKeyObj);
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
                    params:{}
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

            //列出当前流程中所有的自动审批条件
            handleListAutoCheckConditions(){
                this.$http.get(this.globalconfig.listautocheckconditionsapi,{
                    params:{
                        flowid:this.flowid
                    },
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        if(response.data.conditions){
                             this.ajaxautoCheckConditions = response.data.conditions;
                        }
                    }
                },(response)=>{
                    this.$Message.error("读取autoCheckConditions失败")
                })

            },

            // 根据当前的autoCheckMsgid找到对应的autoCheckCondition信息
            getAutoCheckConditionById(autoCheckid){
                for(var i = 0 ; i < this.ajaxautoCheckConditions.length;i++){
                    if(this.ajaxautoCheckConditions[i].id == autoCheckid){
                        return this.ajaxautoCheckConditions[i];
                    }
                }
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

            // 展开shoeSelectKeyModal弹出框
            showSelectKeyModalFn(idx){
                this.curRowIndex = idx;
                this.curSelectKeyModal = this.selectKeyModal[this.curRowIndex];
                this.showSelectKeyModal = !this.showSelectKeyModal;
            },

            // 增加一行
            handleAdd () {
                var _conditionsRow = {
                    flowid:'',
                    skid:'',
                    ckid:'',

                    btnStatus:'还未设置',
                    preCondition: '',
                    condition:'',
                    value:''
                };
                this.autoCheckForm.conditions.push(_conditionsRow);

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

            // 选择术语modal的ok
            selectKeyModalOk(){
                if(this.selectKeyModal[this.curRowIndex].curCkid && this.selectKeyModal[this.curRowIndex].curSkid){
                    this.$Message.warning('术语只能选择一个');
                }

                this.autoCheckForm.conditions[this.curRowIndex].btnStatus = '还未设置';
                if(this.selectKeyModal[this.curRowIndex].curCkid || this.selectKeyModal[this.curRowIndex].curSkid){
                    this.autoCheckForm.conditions[this.curRowIndex].btnStatus = '已设置';
                }

                this.autoCheckForm.conditions[this.curRowIndex].ckid = this.selectKeyModal[this.curRowIndex].curCkid;
                this.autoCheckForm.conditions[this.curRowIndex].flowid = this.selectKeyModal[this.curRowIndex].curFlowid;
                this.autoCheckForm.conditions[this.curRowIndex].skid = this.selectKeyModal[this.curRowIndex].curSkid;
            },

            // 选择术语modal的cancel
            selectKeyModalCancel(){
                // this.$Message.info('点击了取消');
            },

            // 删除指定行
            handleRemove (index) {
                this.autoCheckForm.conditions.splice(index, 1);
            },

            // 点击确定按钮
            autoCheckModalOk () {
                var _desc = this.autoCheckForm.desc;

                // 从父级传过来的flowid
                var _flowid = '';
                if(this.flowid){
                    _flowid = this.flowid;
                }

                // 从父级传过来的conditionid,在更新数据时候有用
                var _autoCheckMsgid = '';
                if(this.autoCheckMsgid){
                    _autoCheckMsgid = this.autoCheckMsgid;
                }

                var _operations = [];
                for(var i = 0 ; i < this.autoCheckForm.conditions.length;i++){
                    var _temp = {};
                    _temp.operation = this.autoCheckForm.conditions[i].preCondition;
                    _temp.func = {};

                    if(this.autoCheckForm.conditions[i].ckid && this.autoCheckForm.conditions[i].skid){
                        this.$Message.error({
                            content:'术语选择重复,不能提交',
                            duration:5,
                            closeable:true
                        });
                        return;
                    }

                    if(this.autoCheckForm.conditions[i].ckid){
                        _temp.func.keyid = this.autoCheckForm.conditions[i].ckid;
                        _temp.func.keytype = "ck";
                    }

                    // 判断有sk时再存入sk对应的flowid，这个flowid仅用于回显
                    if(this.autoCheckForm.conditions[i].skid){
                        _temp.func.keyid = this.autoCheckForm.conditions[i].skid;
                        _temp.func.keytype = "sk";
                        _temp.func.flowid = this.autoCheckForm.conditions[i].flowid;
                    }

                    _temp.func.operate = this.autoCheckForm.conditions[i].condition;
                    _temp.func.value = this.autoCheckForm.conditions[i].value;

                    _operations.push(_temp);
                }

                this.$http.get(this.globalconfig.createorupdateautocheckconditionapi,{
                    params:{
                        desc:_desc,
                        operations:_operations,
                        flowid:_flowid,
                        conditionid:_autoCheckMsgid
                    }
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        if(response.data.id){
                            var _id = response.data.id;
                            var data = {};
                            data.isAutoCheckModalShow = false;
                            data.autoCheckMsgid = _id;
                            this.$emit("fromautocheck",data);
                            this.$Message.info('提交成功');
                        }
                    }
                },
                (response)=>{
                    this.$Message.error("提交失败")
                })

            },

            // 点击取消按钮
            autoCheckModalCancel () {
                var data = {};
                data.autoCheckMsgid = '';
                data.isAutoCheckModalShow = false;
                this.$emit("fromautocheck",data);
            }
        },

        created(){
            this.handleListCks();
            this.handleListFlows();
            this.handleListSks();
            this.handleListAutoCheckConditions();
        }
    }
</script>
