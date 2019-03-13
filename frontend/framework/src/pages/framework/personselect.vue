<style>
	.addperson {
		z-index: 2000;
	}
</style>
<template>

	<Modal class-name="addperson" v-model="showpersonselect" title="请选择" @on-ok='ok' @on-cancel='cancel'>
		<Row>
			<Col span="12" style="border:1px solid #E6E6E6;">
			<Tabs value="name1">
				<Tab-pane label="部门" name="name1">
					<Tree :data="baseData" @on-select-change='getTreeData' ref='Tree'></Tree>
					<ul style='min-height:160px; border-top:1px solid #E6E6E6;'>
						<li v-model='personListShow.id' @click='addPerson(index)' v-for='(item,index) in personListShow'>
							{{item.personName}}
						</li>
				
					</ul>
				</Tab-pane>
				<Tab-pane label="岗位" name="name2">
					<ul v-for='(item,index) in showPositionList ' style="width:240px;height: 80px;" @click='positionAddPerson(index)'>
						<li style="float:left;width: 120px; ">{{item.jobpositionName}}</li>
						<li style="float:left;width:120px;text-align: center;">{{item.jobpositionCode}}</li>
					</ul>
					<ul style='min-height:160px; border-top:1px solid #E6E6E6;'>
						<li v-model='personListShowPosition.id' @click='addPersonPosition(index)' v-for='(item,index) in personListShowPosition'>
							{{item.personName}}
						</li>
				
					</ul>
				</Tab-pane>
				<Tab-pane label="单位" name="name3">
					
					<ul style='min-height:240px; border-top:1px solid #E6E6E6;'>
						<li v-model='item.id' @click='addPersonCompany(index)' v-for='(item,index) in personList'>
							{{item.personName}}
						</li>
				
					</ul>
				</Tab-pane>
			</Tabs>
			<!--<Col style='min-height:160px; border:1px solid #E6E6E6;'>
			<ul>
				<li v-model='personListShow.id' @click='addPerson(index)' v-for='(item,index) in personListShow'>
					{{item.personName}}
				</li>
				
			</ul>
			</Col>-->
			</Col>
			<Col span="11" style="border:1px solid #E6E6E6;min-height: 300px;" offset="1">
			<ul>
				<li v-for='(item,index) in selectedPerson'>
					{{item.personName}}	
					<i class='ivu-icon ivu-icon-close' @click='removePerson(index)' style='margin-left: 150px;'></i>
				</li>
			</ul>	
			</Col>
		</Row>
	</Modal>
</template>
<script>
	export default {
		props: ["nnn"],
		computed: {
			showpersonselect: function() {
				return JSON.parse(this.nnn);
			}
		},
		data() {
			return {
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
				showPositionList: [],
				//人员数据
				personList: [],
				//人员展示数据(部门)：
				personListShow:[],
				
				//人员展示数据(岗位)
				personListShowPosition:[],
				
					
				
				//选中人员列表：
				selectedPerson:[],
			}
		},
		methods: {

			ok() {
				
				this.$Message.info('点击了确定');
				this.$emit('sendSelectedPerson',this.selectedPerson);
				this.nnn = false;
				
				this.$emit('childMsg', this.nnn);

			},
			cancel() {
				
				this.$Message.info('点击了取消');
				this.nnn = false;
				
				this.$emit('childMsg', this.nnn);

			},
			//通过部门添加人员
			getTreeData() {
//				console.log(this.$refs.Tree.getSelectedNodes()[0]);
				for(var i = 0; i < this.personList.length; i++) {
					if(this.personList[i].departmentId == this.$refs.Tree.getSelectedNodes()[0].id) {
							this.personListShow.push(this.personList[i]);
							console.log(this.personListShow);
							
					}
				}
				
				
	
			},
			//点击人员到右侧栏中(部门)
			addPerson(index){
				this.selectedPerson.push(this.personListShow[index]);
			},
			//点击人员到右侧栏中(岗位)
			addPersonPosition(index){
				this.selectedPerson.push(this.personListShowPosition[index]);
			},
			//点击人员到右侧栏中(单位)
			addPersonCompany(index){
				this.selectedPerson.push(this.personList[index]);
			},
			
			//通过岗位添加人员
			positionAddPerson(index){
				
				for(var i = 0; i < this.personList.length; i++) {
					if(this.personList[i].positionId == this.showPositionList[index].id) {
							this.personListShowPosition.push(this.personList[i]);
							
							
					}
				}
			},
			
			//点击×删除选中人员
			removePerson(index){
				this.selectedPerson.splice(index,1); 
			},
			//调部门展示api
			handlequery() {
				this.$http.get(this.globalconfig.listdepartmentapi, {
						params: {

						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('成功');
							console.log(response.data.department);
							var dataArr = response.data.department;
							var treeArr = toTreeData(dataArr);
							this.baseData = treeArr;
							function toTreeData(data) {
								var pos = {};
								var tree = [];
								var i = 0;
								while(data.length != 0) {
									if(data[i].parentId == "" ||data[i].parentId == null) {
										tree.push({
											id: data[i].id,
											title: data[i].departmentName,
											departmentCode:data[i].departmentCode,
											departmentDesc:data[i].departmentDesc,
											parentId:data[i].parentId,
											ownerId:data[i].ownerId,
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
//								  console.log(tree);
								  
								
								return tree;
							}
						}
					}, (response) => {
						this.$Message.success('成功');
					})

			},
			//调岗位展示api
			showjobposition: function() {

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
							this.$Message.success('成功');
							
							var positionArr = response.data.jobposition;

							for(var i = 0; i < positionArr.length; i++) {

								this.showPositionList.push(positionArr[i]);

							}

							console.log(this.showPositionList);

						}
					}, (response) => {
						this.$Message.success('成功');

					})
			},
			//调人员表api
			showperson() {
				
				this.$http.get(this.globalconfig.listpersonapi, {
						params: {
							userStatus:1
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('成功');

							console.log(response.data);
							for(var i = 0; i < response.data.person.length; i++) {
								this.personList.push(response.data.person[i]);
								
							}
							
							
							

						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},

		},
		mounted() {
			this.handlequery();
			this.showjobposition();
			this.showperson();
		},

	}
</script>