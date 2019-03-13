<style scoped>
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
  .mgt10{
      margin-top:10px;
  }

</style>
<template>
    <div>
    <Modal
      v-model="isSelectPersonModalShow"
      title='选择人员'
      @on-ok="SelectPersonModalOk"
      @on-cancel="SelectPersonModalCancel"
      width="600"
    >
        <Row>
            <Col span="24">
                <Card dis-hover>
                    <Checkbox v-model="isAdmin">仅管理员可见</Checkbox>
                </Card>
            </Col>
        </Row>
        <Row class="mgt10">
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

                <Table :columns="selectedPersonsColumns"
                       :data="selectedPersons"
                       :show-header="false"
                       type= 'selection'
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
            "toSelectPersonMsg"
        ],
        computed:{
            isReshow(){
                return this.toSelectPersonMsg.isReshow;
            },
            isSelectPersonModalShow(){
                return this.toSelectPersonMsg.isSelectPersonModalShow;
            },
        },

        watch:{
           isReshow(){
              // 这是不需要回显的，即为新创建的
              if(this.isReshow == "false"){
                  this.finalSelectedPersonsData = [];
                  this.selectedPersons = [];
                  this.isAdmin = false;
              }else{
                  // 判断回显是否是尽管理员可见
                  var _isAdmin = this.toSelectPersonMsg.isAdmin;
                  if(_isAdmin == "true"){
                      this.isAdmin = true;
                  }
                  if(_isAdmin == "false"){
                      this.isAdmin = false;
                  }

                  // 判断回显人员数据
                  var _personsArr = this.toSelectPersonMsg.persons;
                  var _groupsArr = this.toSelectPersonMsg.groups;
                  var _apartmentsArr = this.toSelectPersonMsg.apartments;
                  var _tempArr = [];
                  for(var i = 0 ; i < _personsArr.length;i++){
                      var _tempObj = {};
                      _tempObj.id = _personsArr[i];
                      _tempObj.realname = this.getPersonNameById(_personsArr[i],this.ajaxPersonsArr);
                      _tempObj.name = this.getPersonNameById(_personsArr[i],this.ajaxPersonsArr);
                      _tempObj.type = "person";
                      _tempArr.push(_tempObj);
                  }

                  // 这里缺一个回显“组”的
                  for(var j = 0 ; j < _apartmentsArr.length;j++){
                      var _tempOb = {};
                      _tempOb.id = _apartmentsArr[j];
                      _tempOb.name = "选择本组";
                      _tempOb.realname = this.getApartmentNameById(_apartmentsArr[j],this.ajaxDepartmentData);
                      _tempOb.type = "apartment";
                      _tempArr.push(_tempOb);
                  }
                  this.finalSelectedPersonsData = _tempArr;
              }
           }
        },

        data () {
            return {
                // 是否仅管理员可见
                isAdmin:false,
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
                selectedPersonsColumns:[
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
                aparmentData:{},
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
                        this.ajaxDepartmentData = response.data.department;
                        // 整理成树结构可用的数据,
                        var data = response.data.department;

                        var  treedata = [];
                        /*
                        for(let j=0;j<data.length;j++){
                            data[j].expand = false
                            data[j].title = data[j].departmentName
                            if(data[j].parentId == ""){
                                treedata.push({
                                    "expand":true,
                                    "title":data[j].departmentName,
                                    "id":data[j].id
                                })
                            }
                        }
                        treedata[0].children = new Array()
                        //无限层级
                        //子孙树，从顶级往下找到是有的子子孙孙
                        let treedataLev = sonsTree(data,treedata[0].id)
                        //找到层级最高的那些
                        let maxLev = 0
                        for(let i=0;i<treedataLev.length;i++){
                            if(parseInt(treedataLev[i].lev) > maxLev){
                                maxLev = parseInt(treedataLev[i].lev)
                            }else{
                                maxLev = maxLev
                            }
                        }
                        let needLev = maxLev
                        let maxLevTree = []
                        let maxLevTreePrev = []
                        for(let m=0;m<maxLev;m++){
                            maxLevTree = getLevArr(needLev)
                            maxLevTreePrev = getLevArr(needLev-1)
                            for(let j=0;j<maxLevTreePrev.length;j++){
                                maxLevTreePrev[j].children = new Array()
                                for(let i=0;i<maxLevTree.length;i++){
                                    if(maxLevTree[i].parentId == maxLevTreePrev[j].id){
                                        maxLevTreePrev[j].children.push(maxLevTree[i])
                                    }
                                }
                            }
                            needLev--
                        }
                        treedata[0].children = maxLevTreePrev
                        //找出同一级的数据
                        function getLevArr(lev){
                            let levTree = []
                            for(let i=0;i<treedataLev.length;i++){
                                if(parseInt(treedataLev[i].lev) == lev){
                                    levTree.push(treedataLev[i])
                                }
                            }
                          return levTree
                        }
                        //给每个数据添加一个lev
                        function sonsTree(arr,id){
                            let temp = [],lev=0;
                            let forFn = function(arr, id,lev){
                                for (let i = 0; i < arr.length; i++) {
                                    let item = arr[i];
                                    if (item.parentId==id) {
                                        item.lev=lev;
                                        temp.push(item);
                                        forFn(arr,item.id,lev+1);
                                    }
                                }
                            };
                            forFn(arr, id,lev);
                            return temp;
                        }
*/
                        //  这是只放了三层

                        for(let j=0;j<data.length;j++){
                            if(data[j].parentId == ""){
                                treedata.push({
                                    "expand":true,
                                    "title":data[j].departmentName,
                                    "id":data[j].id
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
                                    "arr":[]
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
                                        "arr":[]
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
                        //--end

                        this.treeData = treedata;
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
                        _tempObj.id = this.ajaxPersonsArr[i].loginId;
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
                        _tempObj.id = this.ajaxPersonsArr[i].loginId;
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
                console.log(selection);
                this.selectedPersonsArr = [];
                if(selection){
                    if(selection[0] && selection[0].type == "apartment"){
                        this.selectedPersonsArr = this.selectedPersons;
                    }  else {
                        this.selectedPersonsArr = selection;
                    }            
                }
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
                     var tmpStatus = false;
                     for(var j=0;j<arr.length;j++){
                         if(obj[key]==arr[j][key]){
                             return j;
                         }else{
                             tmpStatus = false;
                         }
                     }
                     if(!tmpStatus){
                        return -1;
                     }
                }
            },

            // 根据人员的id获取人员的name
            getPersonNameById(id,data){
                if(data && data.length > 0){
                     for(var i = 0 ; i < data.length;i++){
                        if(data[i].loginId == id){
                            return data[i].personName ? data[i].personName : data[i].loginName;
                        }
                     }
                }else{
                    return "未知";
                }
            },

            // 根据部门的id获取部门的name
            getApartmentNameById(id,data){
                if(data && data.length > 0){
                    for(var i = 0 ; i < data.length;i++){
                        if(data[i].id == id){
                            return data[i].departmentName
                        }
                    }
                }else{
                    return "未知"
                }
            },

            // modal框的OK按钮
            SelectPersonModalOk(){
                var _select = this.finalSelectedPersonsData;
                var resultObj = {};
                resultObj.persons = [];
                resultObj.groups = [];
                resultObj.apartments = [];
                for(var i = 0;i < _select.length;i++){
                    if(_select[i].type == "person"){
                        resultObj.persons.push(_select[i].id);
                    }else if(_select[i].type == "group"){
                        resultObj.groups.push(_select[i].id);
                    }else if(_select[i].type == "apartment"){
                        resultObj.apartments.push(_select[i].id);
                    }
                }
                resultObj.isSelectPersonModalShow = false;
                resultObj.isClickOk = true;
                resultObj.isAdmin = this.isAdmin;
                var data = {};
                data = resultObj;
                this.$emit("fromselectperson",data)
            },
            // modal框的cancel按钮
            SelectPersonModalCancel () {
                this.$Message.info('点击了取消');
                var data = {};
                data.persons = [];
                data.groups = [];
                data.apartments = [];
                data.isSelectPersonModalShow = false;
                data.isClickOk = false;
                data.isAdmin = this.isAdmin;
                this.$emit("fromselectperson",data);
            },

        },
        created(){
            this.handleQueryApartmentData();
            this.handleQueryPersonsData();
            this.handleQueryJobPositionData();
        }
  }

</script>
