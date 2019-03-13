<style >
  .mgt30{
      margin-top:30px;
  }
  .center{
      position:relative;
      height:400px;
  }
  .v-middle{
      position:absolute;
      top:50%;
      left:0;
      color:#39f;
      cursor: pointer;
  }
  .v-middle:hover{
      color:#38f;
  }
  .addperson{
      z-index:2000
  }

</style>
<template>
    <div>
    <Modal
      v-model="isSelectPersonModalShow"
      title="普通的Modal对话框标题"
      @on-ok="SelectPersonModalOk"
      @on-cancel="SelectPersonModalCancel"
      width="600"
      class-name="addperson"
    >
        <Row>
          <!--左半侧-->
            <Col span="11">
                <Card dis-hover>
                <Tabs size="small" type="line">
                    <Tab-pane label="部门" name="apartment">
                        <Tree :data="treeData"
                              @on-select-change="getTreeSelectData"
                              ref="Tree">
                        </Tree>
                    </Tab-pane>
                    <Tab-pane label="组" name="gorup">
                        标签二的内容
                    </Tab-pane>
                    <Tab-pane label="岗位" name="jobPosition">
                        <Table :columns="jobPositionColumns"
                               :data="jobPositionData"
                               :show-header="false"
                               @on-row-click="getJobPositionSelectData"
                               size="small" >
                        </Table>
                    </Tab-pane>
                </Tabs>
                </Card>
                    <Table :columns="selectedPersonsByTreeColumns"
                           :data="selectedPersons"
                           :show-header="false"
                           @on-selection-change="SelectedRows"
                           size="small"
                           class="mgt30">
                    </Table>
            </Col>
            <Col span="2" class="center">
            <Button type="text" class="v-middle" size="small"
                @click="addSelectedPersonsToFinal"
                >
                <Icon type="android-arrow-dropright-circle" size="40"></Icon>
            </Button>
            </Col>
            <!--右半侧-->
            <Col span="11">
                <Table :columns="finalSelectedPersonsColumns"
                       :data="finalSelectedPersonsData"
                       :show-header="false"
                       size="small"
                >
                </Table>
            </Col>
        </Row>
    </Modal>
      </div>
</template>

<script>
  export default {
        props:[
            "switch"
        ],
        computed:{
            isSelectPersonModalShow(){
                return this.switch;
            }
        },
        data () {
            return {
                // 获取的人员的列表
                ajaxPersonsArr:[],
                // 获取的职位的列表
                ajaxDepartmentData:[],
                // 获取的岗位的列表
                ajaxJobPositionData:[],
                // 树结构的数据
                treeData: [],
                // 根据树结构删选出的人员信息
                selectedPersons:[],
                selectedPersonsByTreeColumns:[
                    {
                        type : 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '',
                        key: 'name'
                    }
                ],
                jobPositionColumns:[
                    {
                        title:'',
                        key:'name'
                    },
                    {
                        title:'',
                        key:'code'
                    }
                ],
                jobPositionData:[],

                // 选中的人员的列表
                selectedPersonsArr:[],
                // 最终选中的人员列表
                finalSelectedPersonsColumns:[
                    {
                        title: '',
                        key: 'realname'
                    },
                    {
                        title: '',
                        key: 'action',
                        width:50,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.finalSelectedPersonsRemoveRow(params.index)
                                        }
                                    }
                                }, 'X')
                            ]);
                        }
                    }
                ],

                // 最终选中的人员列表数据
                finalSelectedPersonsData:[]
            }
        },
        methods: {
            // 获取部门信息
            handleQueryApartmentData(){
                this.$http.get(this.globalconfig.listdepartmentapi,{
                    params:{}
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data){
                        var _departmentData = response.data.department;
                        this.ajaxDepartmentData = response.data.department;
                        // 整理成树结构可用的数据,
                        this.treeData = this.departmentDataToTree(_departmentData);
                    }
                },(response)=>{
                    this.$Message.error("获取部门信息失败");
                })
            },

            // 获取岗位信息
            handleQueryJobPositionData(){
                this.$http.get(this.globalconfig.listjobpositionapi,{
                    params:{}
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data.jobposition){
                        this.ajaxJobPositionData = response.data.jobposition;
                        // 整理成所需格式
                        var _jobposition = response.data.jobposition;
                        var _tempArr = [];
                        for(var i = 0 ; i < _jobposition.length;i++){
                            var _tempObj = {};
                            _tempObj.id = _jobposition[i].id;
                            _tempObj.name = _jobposition[i].jobpositionName;
                            _tempObj.desc = _jobposition[i].jobpositionDesc;
                            _tempObj.code = _jobposition[i].jobpositionCode;
                            _tempObj.type = _jobposition[i].jobpositionType;
                            _tempArr.push(_tempObj);
                        }
                        this.jobPositionData = _tempArr;
                    }
                },(response)=>{
                    this.$Message.error("获取岗位信息失败");
                })
            },

            // 获取人员信息
            handleQueryPersonsData(){
                this.$http.get(this.globalconfig.listpersonapi,{
                    params: {
                        userStatus: 1
                    }
                },{emulateJSON: true})
                .then((response)=>{
                    if(response.data){
                        this.ajaxPersonsArr = response.data.person;
                    }
                },
                (response)=>{
                    this.$Message.error("获取人员信息失败")
                })
            },

            // 通过点击岗位列表，筛选出对应的人员
            getJobPositionSelectData(data){
                var _id = data.id;
                var _tempArr = [];
                for(var i = 0 ; i < this.ajaxPersonsArr.length;i++){
                    if(this.ajaxPersonsArr[i].positionId == _id){
                        var _tempObj = {};
                        _tempObj.id = this.ajaxPersonsArr[i].id;
                        _tempObj.realname = this.ajaxPersonsArr[i].personName ? this.ajaxPersonsArr[i].personName : this.ajaxPersonsArr[i].loginName;
                        _tempObj.name = this.ajaxPersonsArr[i].personName ? this.ajaxPersonsArr[i].personName : this.ajaxPersonsArr[i].loginName;
                        _tempObj.type = "person";
                        _tempArr.push(_tempObj);
                    }
                }
                this.selectedPersons = _tempArr;
            },

            // 通过点击树结构中，筛选出对应的人员
            getTreeSelectData(){
                // 再次点击已选中的，取得的getSelectedNodes()为空数组，需要判断，不然会出错
                if(this.$refs.Tree.getSelectedNodes().length == 0){
                    return;
                }
                var _selectedGroupidFromTree = this.$refs.Tree.getSelectedNodes()[0].id;
                var _selectedGroupnameFromTree = this.$refs.Tree.getSelectedNodes()[0].title;
                var _tempArr = [];

                // 数组的第一项为选择本组
                _tempArr[0] = {
                    id:this.$refs.Tree.getSelectedNodes()[0].id,
                    type:"apartment",
                    realname:_selectedGroupnameFromTree,
                    name:'选择本部门'
                };
                for(var i = 0 ; i < this.ajaxPersonsArr.length;i++){
                    var _tempObj = {};
                    if(this.ajaxPersonsArr[i].departmentId == _selectedGroupidFromTree){
                        _tempObj.id = this.ajaxPersonsArr[i].id;
                        _tempObj.name = this.ajaxPersonsArr[i].personName ? this.ajaxPersonsArr[i].personName : this.ajaxPersonsArr[i].loginName;
                        _tempObj.realname = this.ajaxPersonsArr[i].personName ? this.ajaxPersonsArr[i].personName : this.ajaxPersonsArr[i].loginName;
                        _tempObj.type = "person";
                        _tempArr.push(_tempObj);
                    }
                }
                this.selectedPersons = _tempArr;
            },

            //  选中的人员或组
            SelectedRows(selection){
                // 先赋值为空，再进行赋值
                this.selectedPersonsArr = [];
                this.selectedPersonsArr = selection;
            },

            // 点击中间按钮，将选中的人员赋值给右侧table
            addSelectedPersonsToFinal(){
                var _tempArr = this.finalSelectedPersonsData.concat(this.selectedPersonsArr);
                // 对最终选中的人员进行一个去重
                this.finalSelectedPersonsData = this.uniqueArr(_tempArr,"id")
                // 赋值过后将选中的人员Arr清空
                this.selectedPersonsArr = [];
            },

            // 删除最终选出的人员中的一行
            finalSelectedPersonsRemoveRow(index){
                this.finalSelectedPersonsData.splice(index,1)
            },

            // 根据数组中对象的某一项进行去重
            uniqueArr(arr,key) {
                var newArr=[];
                for(var i=0;i<arr.length;i++){
                    if(_objIsInArray(arr[i],newArr,key) ==-1){
                        newArr.push(arr[i]);
                    }
                }
                return newArr

                function _objIsInArray(obj,arr,key){
                     var tmpStatus=false;
                     for(var j=0;j<arr.length;j++){
                         if(obj[key]==arr[j][key]){
                           return j;
                         }else{
                           tmpStatus=false;
                         }
                     }
                     if(!tmpStatus){
                        return -1;
                     }
                }
            },

            // 这里先放了三层
            departmentDataToTree(data){
                let treedata = [];
                for(let j=0;j<data.length;j++){
                    if(data[j].parentId == ""){
                        treedata.push({
                            "expand":true,
                            "title":data[j].departmentName,
                            "id":data[j].id,
                        })
                    }
                }
                treedata[0].children = new Array()
                for(let i=0;i<data.length;i++){
                    if(data[i].parentId == treedata[0].id){
                        treedata[0].children.push({
                            "expand":true,
                            "title":data[i].departmentName,
                            "id":data[i].id,
                            "arr":new Array
                        })
                    }
                }

                for(let m=0;m<treedata[0].children.length;m++){
                    for(let n=0;n<data.length;n++){
                        if(data[n].parentId == treedata[0].children[m].id){
                            treedata[0].children[m].arr.push({
                                "expand":true,
                                "title":data[n].departmentName,
                                "id":data[n].id,
                                "arr":new Array
                            })
                        }
                    }
                    if(treedata[0].children[m].children == undefined){
                        if(treedata[0].children[m].arr.length != 0){
                            treedata[0].children[m].children = new Array()
                            treedata[0].children[m].children = treedata[0].children[m].arr
                        }
                    }
                }
                return treedata
            },

            // modal框的OK按钮
            SelectPersonModalOk(){
                if(this.finalSelectedPersonsData.length == 0){
                    this.$Message.error("请选择人员")
                    return
                }
                var _select = this.finalSelectedPersonsData;
                var resultObj = {};
                resultObj.persons = [];
                resultObj.groups = [];
                resultObj.apartments = [];
                for(var i = 0;i < _select.length;i++){
                    var _tempObj = {};
                    _tempObj.id = _select[i].id;
                    _tempObj.name = _select[i].realname;
                    if(_select[i].type == "person"){
                        resultObj.persons.push(_tempObj);
                    }else if(_select[i].type == "group"){
                        resultObj.groups.push(_tempObj);
                    }else if(_select[i].type == "apartment"){
                        resultObj.apartments.push(_tempObj);
                    }
                }
                console.log(resultObj)
                this.$emit('childMsg',resultObj)
            },
            // modal框的cancel按钮
            SelectPersonModalCancel () {
                this.$Message.info('点击了取消');
            },

        },
        created(){
            this.handleQueryApartmentData();
            this.handleQueryPersonsData();
            this.handleQueryJobPositionData();
        }
  }

</script>
