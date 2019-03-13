<style scoped>
   .mgt30{
       margin-top:30px;
   }
</style>
<template>
    <Modal
        v-model="isShow"
        title="选择人员"
        @on-ok="selectOnePersonOk"
        @on-cancel="selectOnePersonCancel"
        width="600"
    >
        <Row>
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
            </Col>
            <Col span="12" offset="1">
                <Card dis-hover>
                    <Table :columns="selectedPersonsColumns"
                         :data="selectedPersons"
                         :show-header="false"
                         @on-row-click="SelectedRows"
                         highlight-row
                         size="small"
                         class="mgt30">
                    </Table>
                </Card>
            </Col>
        </Row>
    </Modal>
</template>

<script>

    export default{
        props:[
            "toSelectOnePersonModal"
        ],
        computed:{
            isShow(){
                return this.toSelectOnePersonModal.isModalShow
            }
        },
        data(){
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

                selectedPersonsColumns:[

                    {
                        title: '姓名',
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

                // 最终选择的人的信息
                finalSelectPerson:{}
            }
        },
        methods:{
            selectOnePersonOk(){
                // 如果最终是空对象，即没有选中任何人，给出提示

                if(isEmptyObject(this.finalSelectPerson)){
                    this.$Message.warning("没有选择任何人员");
                    var data = {};
                    data.personinfo ={};
                    data.isShow = false;
                    this.$emit("fromSelectOnePersonModal",data);
                }else{
                    var data = {};
                    data.personinfo = this.finalSelectPerson;
                    data.isShow = false;
                    this.$emit("fromSelectOnePersonModal",data);
                }

                function isEmptyObject(e) {
                    for (var t in e)
                        return !1;
                    return !0
                }
            },



            selectOnePersonCancel(){
                var data = {};
                data.isShow = false;
                data.personinfo = {};
                this.$emit("fromSelectOnePersonModal",data)
            },

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
                        _tempObj.name = this.ajaxPersonsArr[i].personName ? this.ajaxPersonsArr[i].personName : this.ajaxPersonsArr[i].loginName;
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
                //_tempArr[0] = {
                //    id:this.$refs.Tree.getSelectedNodes()[0].id,
                //    type:"apartment",
                //    realname:_selectedGroupnameFromTree,
                //    name:'选择本部门'
                //};

                for(var i = 0 ; i < this.ajaxPersonsArr.length;i++){
                    var _tempObj = {};
                    if(this.ajaxPersonsArr[i].departmentId == _selectedGroupidFromTree){
                        _tempObj.id = this.ajaxPersonsArr[i].loginId;
                        _tempObj.name = this.ajaxPersonsArr[i].personName ? this.ajaxPersonsArr[i].personName : this.ajaxPersonsArr[i].loginName;
                        _tempArr.push(_tempObj);
                    }
                }
                this.selectedPersons = _tempArr;
            },

            //  选中的人员或组
            SelectedRows(selection){
                for(var i = 0;i < this.ajaxPersonsArr.length;i++){
                   if(this.ajaxPersonsArr[i].loginId == selection.id){
                      this.finalSelectPerson = this.ajaxPersonsArr[i];
                   }
                }
            },
        },

        created(){
            this.handleQueryApartmentData();
            this.handleQueryPersonsData();
            this.handleQueryJobPositionData();
        }

    }
</script>
