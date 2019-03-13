<style>
	.department_title {
		background: #e6e9ed;
		height: 30px;
		line-height: 30px;
	}

	.add_button {
		width: 8%;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.department_tree {
		background: white;
		min-height: 600px;
	}

	.department_tree_content {
		/*text-align: center;*/
		padding: 20px 0 0 20px;
	}

	.department_department_name {
		text-align: center;
		height: 50px;
		line-height: 50px;
	}

	.department_department_content {
		height: 50px;
		line-height: 50px;
	}

	.department_EditInfo {
		text-align: right;
	}

	.department_Dialog {
		margin-top: 10px;
	}
</style>
<template>
	<Row justify="space-between">
		<Col span="24" class="department_title">
		<Icon type="card" style="margin-left: 20px;"></Icon>
		后台&nbsp;>&nbsp;部门设置
		</Col>
		<Col span="24">
      <Button type="primary" @click="showcreate()" class="add_button">新建</Button>

      <Modal v-model="showcreatedepartment" title="新建部门"
             @on-ok="addDepartment"
             @on-cancel="cancel"
             class-name="addDpartment">
        <Form :model="formItem" :label-width="80">
          <Form-item label="部门名称">
            <Input v-model="formItem.departmentName" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="部门代码">
            <Input v-model="formItem.departmentCode" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="上级部门">
            <Select v-model="formItem.departmentSuperior" placeholder="请选择">
              <Option v-for="(item,index) in departmentSuperiorList" :value="index" :key="index">{{ item.departmentName }}</Option>
            </Select>
          </Form-item>
          <Form-item label="部门主管">
            <Input v-model="formItem.departmentDirector" @on-click="showPersonSelect" placeholder="请输入">
            </Input>
            <!--新建部门中的人员选择框-->
            <personselectnew @childMsg="getSelectedPerson" :switch="show"></personselectnew>

          </Form-item>
          <Form-item label="描述">
            <Input v-model="formItem.departmentDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
          </Form-item>
        </Form>
      </Modal>
		</Col>

		<Col span="6" class="department_tree">
		<Tree :data="baseData" class="department_tree_content" @on-select-change='getTreeData' ref='Tree'></Tree>
    </Col>

		<Col span="16" class="department_tree" offset="1">
      <Tabs type="card" @on-click="toggleTab">
        <Tab-pane label="部门信息">
          <Row>
            <Col span="24" class="department_EditInfo">

            <Button type="info" @click="editdepartmentBtn">编辑部门</Button>
            <Button type="info" style="margin-left:20px;margin-right:20px" @click='removeDepartment'>删除部门</Button>
            <Modal v-model="editdepartment"
                   title="编辑部门"
                   @on-ok="updateDepartment"
                   @on-cancel="cancel">
              <Form :model="departmentInfo" :label-width="80">
                <Form-item label="部门名称">
                  <Input v-model="departmentInfo.title" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="部门代码">
                  <Input v-model="departmentInfo.departmentCode" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="上级部门">
                  <Select v-model="departmentInfo.index">
                    <Option v-for="(item,index) in departmentSuperiorList" :value="index" :key="index">{{ item.departmentName }}</Option>
                  </Select>
           		       <!--<Input v-model="departmentInfo.parentName" placeholder="请输入"></Input>-->
                </Form-item>
                <Form-item label="部门主管">
                  <Input v-model="departmentInfo.ownerId" @on-click="showPersonSelectEdit">

                  </Input>
                  <!--<personselectedit v-on:childMsg="getChild"  @sendSelectedPerson='getSelectedEditPerson' :nnn="show"></personselectedit>-->
                </Form-item>
                <Form-item label="描述">
                  <Input v-model="departmentInfo.departmentDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                </Form-item>

              </Form>
            </Modal>

            </Col>
            <Col span="6" class="department_department_name">部门名称</Col>
            <Col span="18" class="department_department_content">{{departmentInfo.title}}</Col>
            <Col span="6" class="department_department_name">部门代码</Col>
            <Col span="18" class="department_department_content">{{departmentInfo.departmentCode}}</Col>
            <Col span="6" class="department_department_name">上级部门</Col>
            <Col span="18" class="department_department_content">{{departmentInfo.parentName}}</Col>
            <Col span="6" class="department_department_name">部门主管</Col>
            <Col span="18" class="department_department_content">{{departmentInfo.ownerId}}</Col>
            <Col span="6" class="department_department_name">描述</Col>
            <Col span="18" class="department_department_content">{{departmentInfo.departmentDesc}}</Col>
          </Row>
        </Tab-pane>
        <Tab-pane label="部门成员">
          <Table :columns="columns1" :data="data2" style="width: 621px;margin-left: 5px;margin-right: 3px;"></Table>
        </Tab-pane>
      </Tabs>
		</Col>
	</Row>

</template>
<script>

	import personselectnew from '../components/selectperson.vue'
/*
	import personselectedit from '../components/selectperson.vue'
*/

  // 这个变量用于计算树结构
	var dataList = []
	export default {
		components: {
			personselectnew,
			/*	personselectedit*/
		},

		data() {
			return {
				//弹出创建部门的对话框
				showcreatedepartment: false,
        //
				show: false,

				editdepartment:false,

				//树状图
				baseData: [{
					expand: true,
					title: '',
					checked: true,
					children: [{
						title: '',
						expand: true,

					}, {
						title: '',
						expand: true,

					}]
				}],
				// 创建部门
				formItem: {
					departmentName: '',
					departmentCode: '',
					// 这个0是个默认值，默认没有上级部门
					departmentSuperior: 0,
					departmentDirectorId: '',
					departmentDirector:'',
					departmentDesc: ''
				},
				//             上级部门下拉框
				departmentSuperiorList: [
					{
						departmentName: '无',
						id:'0',
					},

				],
				//部门详细信息
				departmentInfo: {

				},
				//部门详细信息展示
//				departmentInfolist:{
//
//				},

				//部门成员展示
				columns1: [{
						title: '姓名',
						key: 'personName'
					},
					{
						title: '登录名',
						key: 'loginname'
					},
					{
						title: '电子邮箱',
						key: 'email'
					},
					{
						title: '主岗',
						key: 'jobpositionName'
					},
					{
						title: '所属部门',
						key: 'departmentName'
					},
					{
						title: '是否在职',
						key: 'personStatus'
					},
				],

				data1: [],//人员的数组
        data2:[ ],//当前被选择部门的数组
        departmentArr:[],//当前部门及其子部门和后代部门的title数组
				personData:[

				],

				position_data1:[],
			}
		},

		methods: {
			//调用添加部门api
			addDepartment() {
				this.show = false;
				this.$http.get(this.globalconfig.adddepartmentapi, {
						params: {
							departmentName: this.formItem.departmentName,
							departmentCode: this.formItem.departmentCode,
							// 这里是判断如果选择departmentSuperior为0，则为没有上级部门，不为0，取上级部门id
							parentId: this.formItem.departmentSuperior == 0 ? '' : this.departmentSuperiorList[this.formItem.departmentSuperior].id ,
							ownerId:this.formItem.departmentDirector,
							departmentDesc: this.formItem.departmentDesc,
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('创建成功');
							// 将新建部门的信息push进dataList,计算树结构，浏览器会死机，重新计算树结构，所以多一步调取库中数据
							this.handlequery();
						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},

			ok() {
				this.$Message.info('点击了确定');
			},

			cancel() {
				this.$Message.info('点击了取消');
				this.show = false;
			},
      toggleTab(){

      },
			//点击添加按钮后，弹出新建部门对话框
			showcreate() {
        this.formItem = {//新建的时候重置新建表单
          departmentName: '',
          departmentCode: '',
          // 这个0是个默认值，默认没有上级部门
          departmentSuperior: 0,
          departmentDirectorId: '',
          departmentDirector:'',
          departmentDesc: ''
        };
				this.showcreatedepartment = true;
			},

			//新建部门中展示人员对话框
			showPersonSelect() {
				this.show = true;
			},

			// 编辑部门中展示人员对话框
			showPersonSelectEdit(){
				this.show = true;
			},

			//关闭人员对话框返回的bol
			//getChild: function(msg) {
			//this.show = msg;
			//},

			//关闭人员对话框返回的人员数据
			getSelectedPerson:function(isPersonObj){
				if(this.showcreatedepartment){
					this.formItem.departmentDirectorId = isPersonObj.persons[0].id;
					this.formItem.departmentDirector = isPersonObj.persons[0].name;
				}else{
					this.departmentInfo.ownerId = isPersonObj.persons[0].id;
					this.departmentInfo.ownerName = isPersonObj.persons[0].name;
				}
			},


//			getSelectedEditPerson:function(isEditPerson){

//			},

			//点击树后显示部门详细信息
			getTreeData() {
			  let departinfo = this.$refs.Tree.getSelectedNodes();
        let me = this;
        if(departinfo.length){
          me.data2 = [];
          me.departmentArr =[];
          let nowDepart = this.$refs.Tree.getSelectedNodes()[0].title;
          me.getThisDepartmentPerson(this.$refs.Tree.getSelectedNodes()[0]);//遍历子部门的人员
          for(let i=0;i<me.data1.length;i++){
            if(me.departmentArr.indexOf(me.data1[i].departmentName) > -1){
              me.data2.push(me.data1[i]);
            }
          }


          this.departmentInfo = this.$refs.Tree.getSelectedNodes()[0];
          //根据上级部门ID 显示上级部门名称
          for(var i=0;i<this.departmentSuperiorList.length;i++){
            if(this.departmentInfo.parentId == this.departmentSuperiorList[i].id){
              this.departmentInfo.parentName = this.departmentSuperiorList[i].departmentName;
            }
          }
          //根据管理人员ID 显示领导者
          for(var i=0;i<this.data1.length;i++){
            if(this.departmentInfo.ownerId == this.data1[i].id){
              this.departmentInfo.ownerName = this.data1[i].personName;
            }
          }
        }
			},
      getThisDepartmentPerson(obj){//刘国超写的
			  var me = this;
        me.departmentArr.push(obj.title);  //departmentArr存放的是当前部门及其子部门的title
        for(let i=0;i<obj.children.length;i++){
          if(obj.children[i].children.length){
            me.getThisDepartmentPerson(obj.children[i]);
          } else {
            me.departmentArr.push(obj.children[i].title);
          }
        }

      },
			//调用部门展示api
			handlequery() {
				//showdepart
				this.$http.get(this.globalconfig.listdepartmentapi, {
					params: {

					}
				},{emulateJSON: true})
				.then((response) => {
					if(response.body.error) {
						this.$Message.error(response.body.error)
					} else {
						//推入部门下拉框
						var newarr = response.data.department
						var len = newarr.length

            //  这里不用for，直接对this.departmentSuperiorList赋值，结果为空数组
						for(var i = 0; i < len; i++) {
							this.departmentSuperiorList.push(newarr[i]);
							dataList.push(newarr[i])
						}

						//showperson
						this.$http.get(this.globalconfig.listpersonapi, {
							params: {
								userStatus:"1"
							}
						}, {emulateJSON: true})
						.then((response) => {
							if(response.body.error) {
								this.$Message.error(response.body.error)
							} else {
								var personData = response.data.person;
								var pData = []
								for(var i = 0; i < personData.length; i++) {
									pData.push(personData[i]);
								}
								//showJob
								this.$http.get(this.globalconfig.listjobpositionapi, {
									params: {

									}
								}, {
									emulateJSON: true
								})
								.then((response) => {
									if(response.body.error) {
										this.$Message.error(response.body.error)
									} else {
										var positionArr = response.data.jobposition;
										var nData = []
										for(var h = 0; h < positionArr.length; h++) {

											nData.push(response.data.jobposition[h]);

										}
										//showInfo
										for(var i=0;i<pData.length;i++){
											for(var j =0;j<dataList.length;j++){
												if(pData[i].departmentId == dataList[j].id){
													pData[i].departmentName = dataList[j].departmentName;
												}
											}
										}
										for(var m=0;m<pData.length;m++){
											for(var n=0;n<nData.length;n++){
												if(pData[m].positionId == nData[n].id){
													pData[m].jobpositionName = nData[n].jobpositionName
												}
											}
										}
										this.data1 = pData
										//推入tree
										var treeArr = this.toTreeData(dataList);
										//add by liuguochao for 默认显示第一个节点的信息
										this.departmentInfo.title = treeArr[0].title;
										this.departmentInfo.departmentCode = treeArr[0].departmentCode;
										this.departmentInfo.parentName = treeArr[0].parentName;
										this.departmentInfo.ownerName = treeArr[0].ownerId;
										this.departmentInfo.departmentDesc = treeArr[0].departmentDesc;
										this.baseData = treeArr;

                    this.getThisDepartmentPerson(treeArr[0]);
                    for(let i=0;i<this.data1.length;i++){
                      if(this.departmentArr.indexOf(this.data1[i].departmentName) > -1){
                        this.data2.push(this.data1[i]);
                      }
                    }
									}
								}, (response) => {
									this.$Message.success('成功');

								})
							}
						}, (response) => {
							this.$Message.success('成功');
						})
					}
				}, (response) => {
					this.$Message.success('成功');
				})

			},

      // 计算，生成树结构

      toTreeData(data) {
        var pos = {};
        var tree = [];
        var i = 0;
				console.log();
        while(data.length != 0) {
          if(data[i].parentId == "" ||data[i].parentId == null || data[i].parentId == 0) {//是一级节点，直接放入tree中
            tree.push({
              id: data[i].id,
              title: data[i].departmentName,
              departmentCode:data[i].departmentCode,
              departmentDesc:data[i].departmentDesc,
              parentId:data[i].parentId,
              ownerId:data[i].ownerId,
              parentName:data[i].parentName,
              ownerName:data[i].ownerName,
              checked:true,
              children: []
            });
            pos[data[i].id] = [tree.length - 1];
            data.splice(0, 1);
            i--;
          } else {
            var posArr = pos[data[i].parentId];
            if(posArr != undefined) {
              var obj = tree[posArr[0]];
							console.log(obj.children[posArr[1]]);
              for(var j = 1; j < posArr.length; j++) {
                obj = obj.children[posArr[j]];
              }

              obj.children.push({
                id: data[i].id,
                title: data[i].departmentName,
                departmentCode:data[i].departmentCode,
                departmentDesc:data[i].departmentDesc,
                parentId:data[i].parentId,
                ownerId:data[i].ownerId,
                ownerName:data[i].ownerName,
                parentName:data[i].parentName,
                children: []
              });
              pos[data[i].id] = posArr.concat([obj.children.length - 1]);
              data.splice(0, 1);
              i--;
            }
          }
					i++;
          if(i > data.length - 1) {
            i = 0;
          }
        }
        return tree;
      },

			//点击编辑按钮
			editdepartmentBtn(){
				for(let i=0;i<this.departmentSuperiorList.length;i++){
						if(this.departmentSuperiorList[i].departmentName == this.departmentInfo.parentName){
								this.departmentInfo.index = i;
						}
				}

				this.editdepartment = true;
			},
			//点击删除部门按钮
			removeDepartment(){
				var departmentId = this.departmentInfo.id
				this.$http.get(this.globalconfig.deletedepartmentapi, {
						params: {

							departmentId:departmentId
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							if(response.data.isDestoryed == 1){
								this.$Message.success('删除成功');
								document.location.reload();

							}else if(response.data.isDestoryed == 0){
								this.$Message.success('有人了，别删');

							}




						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},
			//调编辑api
			updateDepartment(){
				this.$http.get(this.globalconfig.updatedepartmentapi, {
						params: {
							departmentName:this.departmentInfo.title,
							id:this.departmentInfo.id,
							departmentCode:this.departmentInfo.departmentCode,
							departmentDesc:this.departmentInfo.departmentDesc,
							parentId:this.departmentSuperiorList[this.departmentInfo.index].id,
							ownerId:this.departmentInfo.ownerId,
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('成功');
							this.handlequery();
						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},
			//整理数据的方法
			integrationData(){

							for(var i=0;i<this.data1.length;i++){
								for(var j =0;j<this.departmentSuperiorList.length;j++){
									if(this.data1[i].departmentId == this.departmentSuperiorList[j].id){
										this.data1[i].departmentName = this.departmentSuperiorList[j].departmentName;
									}
								}
							}
							for(var i=0;i<this.data1.length;i++){
								for(var j=0;j<this.position_data1.length;j++){

									if(this.data1[i].positionId == this.position_data1[j].id){
										this.data1[i].jobpositionName = this.position_data1[j].jobpositionName
									}
								}
							}


						this.data1  = this.personData
			},


		},
		created() {
			this.handlequery();
		}
	}
</script>
