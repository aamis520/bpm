<style>
	.position_title {
		background: #e6e9ed;
		height: 30px;
		line-height: 30px;
	}
</style>
<template>
	<Row>
		<Col span="24" class="position_title">
      <Icon type="card" style="margin-left: 20px;"></Icon>
      后台&nbsp;/&nbsp;人员设置&nbsp;/&nbsp;新增人员
		</Col>
		<Col span="24" style="background:white;">
      <Form :model="formItem" :label-width="100">
        <Card :dis-hover=true :bordered=false>
          <p slot="title">系统信息</p>
          <Row>
            <Col span="12">
              <Form-item label="姓名">
                <Input v-model="formItem.personName" placeholder="请输入" style="width:200px;"></Input>
              </Form-item>
              <Form-item label="登录名">
                <Input v-model="formItem.loginName" placeholder="请输入" style="width:200px"></Input>
              </Form-item>
              <Form-item label="默认密码">
                <Input placeholder="111111" style="width:200px" disabled></Input>
              </Form-item>
              <Form-item label="账户状态">
                <Select v-model="formItem.userStatus" placeholder="请选择" style="width:200px">
                  <Option value="1">启用</Option>
                  <Option value="0">未启用</Option>
                </Select>
              </Form-item>
            </Col>
          </Row>
        </Card>
        <Card :dis-hover=true :bordered=false>
          <p slot="title">个人信息</p>
          <Row>
            <Col span="12">
              <Form-item label="性别">
                <Input v-model="formItem.sex" placeholder="请输入" style="width:200px;"></Input>
              </Form-item>
              <Form-item label="办公室电话">
                <Input v-model="formItem.officePhone" placeholder="请输入" style="width:200px"></Input>
              </Form-item>
              <Form-item label="电子邮件">
                <Input v-model="formItem.email" placeholder="请输入" style="width:200px"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="出生日期">
                <Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="formItem.personBirthday"></Date-picker>
              </Form-item>
              <Form-item label="手机号">
                <Input v-model="formItem.telPhone" placeholder="请输入" style="width:200px"></Input>
              </Form-item>
            </Col>
          </Row>
        </Card>
        <Card :dis-hover=true :bordered=false>
          <p slot="title">组织信息</p>
          <Row>
            <Col span="12">
              <Form-item label="所属部门">
                <Select v-model="formItem.departmentId" placeholder="请选择" style="width:200px">
                  <Option v-for="(item,index) in departmentSuperiorList" :value="index" :key="item">{{ item.departmentName }}</Option>
                </Select>
              </Form-item>
              <Form-item label="岗位">
                <Select v-model="formItem.jobpositionId" placeholder="请选择" style="width:200px">
                  <Option v-for="(item,index) in jobpositionList" :value="index" :key="item">{{ item.jobpositionName }}</Option>
                </Select>
              </Form-item>
              <Form-item label="人员类型">
                <Select v-model="formItem.personType" placeholder="请选择" style="width:200px">
                  <Option value="1">正式</Option>
                  <Option value="0">非正式</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="人员状态">
                <Select v-model="formItem.personStatus" placeholder="请选择" style="width:200px">
                  <Option value="1">在职</Option>
                  <Option value="0">非在职</Option>
                </Select>
              </Form-item>
            </Col>
            <Col span="24">
              <Form-item label="工作地">
                <Input v-model="formItem.workPlace" placeholder="请输入"></Input>
              </Form-item>
            </Col>
            <Col span="12">
              <Form-item label="入职时间">
                <Date-picker type="date" placeholder="选择日期" style="width: 200px" v-model="formItem.inductionTime"></Date-picker>
              </Form-item>
            </Col>
            <Col span="12">

            </Col>
            <Col span="24">
              <Form-item label="说明">
                <Input v-model="formItem.personDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
              </Form-item>
            </Col>
            <Col span="24">
              <Form-item>
                <Button type="primary" style="margin-left:240px;" @click="checkLoginNameIfRepeat">创建</Button>
                <Button type="ghost" style="margin-left: 30px" @click="cancel">取消</Button>
              </Form-item>
            </Col>
          </Row>
        </Card>
      </Form>
		</Col>
	</Row>
</template>
<script>
	export default {
		data() {
			return {
				formItem: {
					personName: '',
					loginName: '',
					defaultPassword: '',
					userStatus: '',
					sex: '',
					avatarUrl: '',
					personBirthday: '',
					departmentId: '',
					jobpositionId: '',
					officePhone: '',
					telPhone: '',
					email: '',
					personType: '',
					personStatus: '',
					workPlace: '',
					inductionTime: '',
					personDesc: '',
				},
				departmentSuperiorList: [],
        uploadurl:this.globalconfig.personuploadlogoapi,
				jobpositionList: [],
			}
		},
		methods: {
      checkLoginNameIfRepeat(){  //查看登录名是否是重复的
        let me = this;
        let nowLoginName = this.formItem.loginName;//findpersonapi
        if(nowLoginName){
          this.$http.get(this.globalconfig.findpersonapi,{
            params:{
              loginname : nowLoginName
            }
          },{
            emulateJSON: true
          }).then((response) => {
            var data = JSON.parse(response.bodyText);
            if(data.error){
              me.$Message.error('登录名已被占用');
            } else {
              me.createperson();
            }
          }, (response) => {
            this.$Message.error('获取失败');
          });
        }
      },
			//调创建人员api
			createperson() {
				var positionId = this.jobpositionList[this.formItem.jobpositionId].id;
				var departmentId = this.departmentSuperiorList[this.formItem.departmentId].id;
				var departmentName = this.departmentSuperiorList[this.formItem.departmentId].departmentName;
				var personBirthday = Date.parse(this.formItem.personBirthday);
				var inductionTime = Date.parse(this.formItem.inductionTime);
				this.$http.get(this.globalconfig.createpersonapi, {
						params: {
							personName: this.formItem.personName,
							loginName: this.formItem.loginName,
							defaultPassword: this.formItem.defaultPassword,
							userStatus: this.formItem.userStatus,
							sex: this.formItem.sex,
							avatarUrl: this.formItem.avatarUrl,
							personBirthday: personBirthday,
							departmentId: departmentId,
							departmentName : departmentName,
							positionId: positionId,
							officePhone: this.formItem.officePhone,
							telPhone: this.formItem.telPhone,
							email: this.formItem.email,
							personType: this.formItem.personType,
							personStatus: this.formItem.personStatus,
							workPlace: this.formItem.workPlace,
							inductionTime: inductionTime,
							personDesc: this.formItem.personDesc,
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.body.error) {
							this.$Message.error(response.body.error)
						} else {
							this.$Message.success('创建成功');

							this.$router.push('./person');
						}
					}, (response) => {
						this.$Message.success('成功');

					})
			},
			cancel() {
				this.$router.push('./person');
			},
			//调用部门展示api
			showdepartment() {

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
							for(var i = 0; i < response.data.department.length; i++) {
								this.departmentSuperiorList.push(response.data.department[i]);
							}
						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},
			//调用岗位展示api
			listallPosition() {

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
							for(var i = 0; i < response.data.jobposition.length; i++) {
								this.jobpositionList.push(response.data.jobposition[i]);
							}

						}
					}, (response) => {
						this.$Message.success('成功');
					})
			},


		},
		mounted: function() {
			this.showdepartment(),
				this.listallPosition()

		},
	}
</script>
