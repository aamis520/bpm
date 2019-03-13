<style>
	.position_title {
		background: #e6e9ed;
		height: 30px;
		line-height: 30px;
	}
	
	.position_add_button {
		width: 8%;
		margin-top: 21px;
		margin-bottom: 10px;
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
	
	.position_Dialog {
		margin-top: 10px;
	}
</style>
<template>
	<Row justify="space-between">
		<Col span="24" class="position_title">

		<Icon type="card" style="margin-left: 20px;"></Icon>
		后台&nbsp;>&nbsp;岗位设置

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

		<!--<Button type="primary" class="add_button">新建</Button>-->
		<Button type="primary" @click="modal1 = true" class="position_add_button">新建</Button>
		<Modal v-model="modal1" title="新建岗位" @on-ok="addjobposition" @on-cancel="cancel">

			<Form :model="formItem" :label-width="80">
				<Form-item label="岗位名称">
					<Input v-model="formItem.jobpositionName" placeholder="请输入"></Input>
				</Form-item>
				<Form-item label="岗位代码">
					<Input v-model="formItem.jobpositionCode" placeholder="请输入"></Input>
				</Form-item>
				<Form-item label="岗位类别">
					<Input v-model="formItem.jobpositionType" placeholder="请输入"></Input>
				</Form-item>

				<Form-item label="描述">
					<Input v-model="formItem.jobpositionDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
				</Form-item>

			</Form>
		</Modal>

		</Col>
		<Col span="24">

		<Table :columns="position_columns1" :data="positionList" class="position_showList">
			 
		</Table>
		<Page :total='totalLength' :current='1' :page-size='10' @on-change='paging'></Page>
		<Modal v-model="editShow" title="编辑岗位" @on-ok="editPosition" @on-cancel="cancel">

			<Form :model="positionInfo" :label-width="80">
				<Form-item label="岗位名称">
					<Input v-model="positionInfo.jobpositionName" placeholder="请输入"></Input>
				</Form-item>
				<Form-item label="岗位代码">
					<Input v-model="positionInfo.jobpositionCode" placeholder="请输入"></Input>
				</Form-item>
				<Form-item label="岗位类别">
					<Input v-model="positionInfo.jobpositionType" placeholder="请输入"></Input>
				</Form-item>

				<Form-item label="描述">
					<Input v-model="positionInfo.jobpositionDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
				</Form-item>

			</Form>
		</Modal>
		<Row type="flex" justify="space-around">
			<Col span="8">

			</Col>
			<Col span="16">
			<!--<Page :total="100"  page-size='10' show-elevator style="float: right;"></Page>-->
			</Col>
		</Row>
		</Col>
	</Row>

</template>
<script>
	
	export default {
		data() {
			return {
				totalLength:0,
				//
				modal1: false,
				//编辑按钮弹对话框
				editShow: false,
				//岗位
				formItem: {
					jobpositionName: '',
					jobpositionCode: '',
					jobpositionType: '',
					jobpositionDesc: ''
				},

				//职位展示
				position_columns1: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},
					{
						title: '岗位类别',
						key: 'jobpositionType'
					},
					{
						title: '岗位名称',
						key: 'jobpositionName'
					},
					{
						title: '岗位代码',
						key: 'jobpositionCode'
					},
					{
						title: '岗位描述',
						key: 'jobpositionDesc'
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
											this.editJobPosition(params.index)
										},
									}
								}, '编辑'),
								h('Button', {
									props: {
										type: 'text',
										size: 'small'
									},
									on: {
										click: () => {
											this.removeJobPosition(params.index)
										}
									}
								}, '删除')
							]);
						}
					}
				],
				//职位列表
				position_data1: [
					

				],
				//职位展示列表
				positionList:[
					
				],

				//职位详细信息
				positionInfo: {

				},

			}
		},

		methods: {
			ok() {
				this.$Message.info('点击了确定');
			},
			cancel() {
				this.$Message.info('点击了取消');
			},
			//调用添加岗位api
			addjobposition() {
				this.$http.get(this.globalconfig.addjobpositionapi, {
						params: {
							jobpositionName: this.formItem.jobpositionName,
							jobpositionCode: this.formItem.jobpositionCode,
							jobpositionType: this.formItem.jobpositionType,
							jobpositionDesc: this.formItem.jobpositionDesc,
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('创建成功');
							this.position_data1.push(response.data.org);
						
						}
					}, (response) => {
						this.$Message.success('成功');

					})
			},
			//调用展示岗位api
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

								this.position_data1.push(response.data.jobposition[i]);

							}
							this.totalLength = this.position_data1.length
							this.positionList = this.position_data1.slice(0,10);
							console.log(this.totalLength);

							

						}
					}, (response) => {
						this.$Message.success('成功');

					})
			},

			//			点击编辑按钮
			editJobPosition(index) {

				this.editShow = true;
				this.positionInfo = this.position_data1[index];

			},

			//点击删除按钮
			removeJobPosition(index) {
				var positionId = this.position_data1[index].id;

				this.$http.get(this.globalconfig.deletejobpositionapi, {
						params: {

							positionId: positionId
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							if(response.data.isDestoryed == 1) {
								this.$Message.success('删除成功');
								this.position_data1.splice(index, 1)

							} else if(response.data.isDestoryed == 0) {
								this.$Message.success('有人了，别删');

							}

						}
					}, (response) => {
						this.$Message.success('成功');
					})

			},

			//调岗位编辑api
			editPosition: function() {

				this.$http.get(this.globalconfig.updatejobpositionapi, {
						params: {
							jobpositionName: this.positionInfo.jobpositionName,
							id: this.positionInfo.id,
							jobpositionCode: this.positionInfo.jobpositionCode,
							jobpositionDesc: this.positionInfo.jobpositionDesc,
							jobpositionType: this.positionInfo.jobpositionType

						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('成功');

						}
					}, (response) => {
						this.$Message.success('成功');
					})

			},
			paging:function(page){
				
				
				this.positionList = this.position_data1.slice(page*10-10,page*10);

			},
			

		},
		mounted() {
			this.showjobposition();

		},
	}
</script>