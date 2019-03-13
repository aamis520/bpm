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

	.position_two_title {
		margin-top: 10px;
		height: 63px;
		background: white;
		line-height: 63px;
	}

	.position_two_title span {
		margin-right: 20px;
	}

	.position_showList span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
<template>

	<Row justify="space-between">
		<Col span="24" class="department_title">

		<Icon type="card" style="margin-left: 20px;"></Icon>
		后台&nbsp;>&nbsp;人员管理

		</Col>
		<Row>
			<Col span="12" class="position_two_title">
			<span style="margin-left: 83px;">岗位类别</span>
			<Select style="width:200px">
				<!--<Option  :value="item.value" :key="item">{{ item.label }}</Option>-->
			</Select>
			</Col>
			<Col span="12" class="position_two_title">
			<span>岗位名称</span>
			<Input placeholder="请输入..." style="width: 200px"></Input>
			</Col>
		</Row>
		<Col span="24">

		<Button type="primary" class="add_button" @click='creatprofile'>新建</Button>

		</Col>

		<Col span="6" class="department_tree">
		<Tree :data="baseData" class="department_tree_content" @on-select-change='getPersionTreeData'  ref='Tree'></Tree>
		</Col>
		<Col span="16" class="department_tree" offset="1">
		<Table :columns="position_columns1" :data="position_data2"class="position_showList"></Table>
		</Col>

	</Row>

</template>
<script>
	//TODO,与department一样的问题。
//	import personselect from '../components/personselect.vue'
let dataList = []
	export default {
//		components: {
//			personselect,
//
//		},

		data() {
			return {

				showcom: false,
				//弹出对话框
				modal1: false,
				modal2: false,
				//            	树状图
				baseData: [{
					expand: true,
					title: '',
					children: [{
						title: '',
						expand: true,

					}, {
						title: '',
						expand: true,

					}]
				}],
				//             上级部门下拉框
				departmentSuperiorList: [{
						//                		 hierarchy:0,
						parentId: '',
						departmentName: '无',
					},

				],

				//成员展示
				position_columns1: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '姓名',
						key: 'personName'
					},
					{
						title: '登录名',
						key: 'loginname'
					},
					{
						title: '所属部门',
						key: 'departmentName'
					},
					{
						title: '岗位',
						key: 'jobpositionName'
					},
					{
						title: '是否在职',
						key: 'personStatus'
					},
					{
						title: '操作',
						key: 'position_action',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.editPerson(params.index)
										},
									},
								}, '编辑'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.removePerson(params.index)
										}
									}
								}, '删除')
							]);
						}
					}
				],

				position_data1: [//table的全体数据

				],
				position_data2:[//table的筛选后数据

				],
				departmentArr:[//选择的部门和所有后代部门的集合

				],
				//创建部门
				formItem: {
					departmentName: '',
					departmentCode: '',
					departmentSuperior: '',
					departmentDirector: '',
					departmentDesc: ''
				},
				//编辑部门
				formItem1: {
					departmentName: '',
					departmentCode: '',
					departmentSuperior: '',
					//                  departmentDirector:'',
					departmentDesc: ''
				},

			}
		},

		methods: {

				handlequery() {
				//showdepart
				this.$http.get(this.globalconfig.listdepartmentapi, {
					params: {}
				},{
					emulateJSON: true
				})
				.then((response) => {
					if(response.body.error) {
						this.$Message.error(response.body.error)
					} else {
							//推入部门下拉框
						var newarr = response.data.department
						var len = newarr.length
						for(var i = 0; i < len; i++) {

							dataList.push(newarr[i])
						}
						//showperson
						this.$http.get(this.globalconfig.listpersonapi, {
							params: {
								userStatus:1,
							}
						}, {
							emulateJSON: true
						})
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
										this.position_data1 = pData;
										this.position_data2 = pData;
//										for(var t=0;t<pData.length;t++){
//											this.data1.push(pData[t])
//										}
										//推入tree
										var treeArr = toTreeData(dataList);
										this.baseData = treeArr;
										function toTreeData(data) {
											var pos = {};
											var tree = [];
											var i = 0;
											while(data.length != 0) {
												if(data[i].parentId == "" ||data[i].parentId == null || data[i].parentId == 0) {
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
													data.splice(i, 1);
													i--;
												} else {
													var posArr = pos[data[i].parentId];
													if(posArr != undefined) {

														var obj = tree[posArr[0]];
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
														data.splice(i, 1);
														i--;
													}
												}
												i++;
												if(i > data.length - 1) {
													i = 0;
												}
											}
											return tree;
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
			creatprofile() {
				this.$router.push('./personprofile')

			},
			ok() {
				this.$Message.info('点击了确定');
			},
			cancel() {
				this.$Message.info('点击了取消');

			},
			showPersonSelect() {
				this.showcom = !this.showcom;


			},
			//点击编辑按钮
			editPerson(index) {
				//将数据传入编辑页面
				this.$router.push({
					path: './personedit',
					query: {
						id: this.position_data2[index].id,
						lg: this.position_data2[index].loginname,
					}
				})
			},
			//点击人员删除按钮
			removePerson(index) {
				var loginname = this.position_data2[index].loginname;
				this.$http.get(this.globalconfig.deletepersonapi, {
						params: {
							loginname: loginname
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('成功');
							document.location.reload();
						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},
			getPersionTreeData(){ //this funtion add by liuguochao for Tree的on-select-change事件方法
				let nowDepartmentName = this.$refs.Tree.getSelectedNodes();
				//这个分支是解决点击两次同一节点时控制台报错的问题，报错的原因是出发on-select-change机制的问题
				if(nowDepartmentName.length){
					this.departmentArr = [];
					this.position_data2 = [];
					var allDepartment = this.getAllDepartment(nowDepartmentName[0]);
					for(let i=0;i<this.position_data1.length;i++){
						if(this.departmentArr.indexOf(this.position_data1[i].departmentName) > -1){
							this.position_data2.push(this.position_data1[i]);
						}
					}
				}
			},
			getAllDepartment(obj){ //add by liuguochao for 返回这个部门下所有的后代部门组成的数组（递归）
				if(obj.children.length){
					this.departmentArr.push(obj.title);
					for(let i=0;i<obj.children.length;i++){
						if(obj.children[i].children.length){
							this.getAllDepartment(obj.children[i]);
						} else {
							this.departmentArr.push(obj.children[i].title);
						}
					}
				} else {
					this.departmentArr.push(obj.title);
				}
			}
		},
		mounted() {
			this.handlequery();
		}
	}
</script>
