<style scoped>
	.layout {
		border: 1px solid #d7dde4;
		background: #f5f7f9;
		position: relative;
		border-radius: 4px;
		overflow: hidden;
	}

	.layout-breadcrumb {
		padding: 10px 15px 0;
	}

	.layout-content {
		min-height: 600px;
		margin: 15px;
		overflow: hidden;
		background: #fff;
		border-radius: 4px;
	}

	.layout-content-main {
		padding: 20px 10px;
		background: #edf0f5;
		min-height: 600px;
	}

	.layout-copy {
		text-align: center;
		padding: 10px 0 20px;
		color: #9ea7b4;
	}

	.layout-menu-left {
		background: #464c5b;
		/*min-width: 100px;*/
	}

	.layout-header {
		height: 53px;
		background-color: #F9F9F9;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
	}

	.layout-logo-left {
		width: 90%;
		height: 30px;
		background: #5b6270;
		border-radius: 3px;
		margin: 15px auto;
		line-height: 30px;
		color: white;
		text-align: center;
		vertical-align: middle;
		overflow: hidden;
	}

	.layout-ceiling-main a {
		color: #9ba7b5;
	}

	.layout-hide-text .layout-text {
		display: none;
	}

	.ivu-col {
		transition: width .2s ease-in-out;
	}

	.index_top {
		height: 50px;
		background-color: #2B7EE4;
		line-height: 50px;
		color: #fff;
	}

	.index_top div {
		margin-top: 8px;
		height: 35px;
		line-height: 35px;
	}

	.index_top_center span {
		margin-left: 20px;
		font-size:16px;
	}

	.index_top_logo {
		background:url("../assets/img/logo.png");
		background-repeat:no-repeat;
		background-size:contain;
		background-position-x:15%;
		border-right: 1px solid #3091f2;
		text-align: center;
		font-size:16px;
		text-align: center;
	}

	.index_top_right span {
		margin-right: 30px;
		overflow:hidden;
	}
	.userspan{
		position:relative;
		top:-5px;
	}
	.usericon{
		position:relative;
		top:2px;
	}
</style>

<template>

  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row class="index_top">
				<Col class="index_top_logo" span="5">{{companyName}}</Col>
				<Col span="15" class="index_top_center"><span ></span></Col>
				<Col span="4" class="index_top_right">
						<span v-if="isadmin"  @click="backstage"><Icon size="30" type="ios-monitor"></Icon></span>
						<span @click="gomessageList"><Icon size="30" type="ios-bell" ></Icon></span>
						<span class="userspan">
								<Dropdown>
										<a href="javascript:void(0)" style="font-size:16px;color:#fff;">
												{{userName}}
												<Icon size=20 type="arrow-down-b" class="usericon"></Icon>
										</a>
										<Dropdown-menu slot="list">
												<Dropdown-item><span @click="exitLogin"> <Icon type="power"></Icon> 退出登录</span></Dropdown-item>
										</Dropdown-menu>
								</Dropdown>
						</span>
				</Col>
		</Row>
    <Row type="flex">
      <i-col :span="spanLeft" class="layout-menu-left">
        <Menu theme="dark" width="auto" @on-select="routeTo" :open-names=[menulist[0].name]>
					<!--
          <div class="layout-logo-left">
            <h3>XX公司管理系统</h3>
					</div>
					-->
          <template v-for="menu in menulist" v-if="menu.showinpage">
            <Submenu :name=menu.name>
              <template slot="title">
                <Icon type="ios-paper"></Icon>
                {{menu.name }}
              </template>

              <template v-for="child in menu.child">
                <Menu-item :name=generatemenuid(child.flowid,child.node,child.page)>
                  <Icon type="document" :size="iconSize"></Icon>
                  <span class="layout-text">{{child.name}}</span>
                </Menu-item>
              </template>
            </Submenu>
          </template>
        </Menu>
      </i-col>
      <i-col :span="spanRight">
        <div class="layout-content">
          <div class="layout-content-main">
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </i-col>
    </Row>
  </div>

</template>

<script>
	export default {
		data() {
			return {
				companyName:"",
				spanLeft: 5,
				spanRight: 19,
				menulist: JSON.parse(localStorage.getItem("menus")),
				isadmin:JSON.parse(localStorage.getItem("usrinfo")).isadmin,
				userName : JSON.parse(localStorage.getItem("usrinfo")).usrname
			}
		},
		computed: {
			iconSize() {
				return this.spanLeft === 5 ? 14 : 24;
			},
			setActive() {
				return this.$route.path.replace('/', '');
			}
		},
		methods: {
			exitLogin(){
				this.$router.push('/login');
			},
			backstage() {
				this.$router.push('./logo')
			},
			gomessageList(){
				this.$router.push('./messageList')
			},
			generatemenuid(parent, child ,page) {
				return '/' + parent + '|' + child + '|' + page;
			},
			toggleClick() {
				if(this.spanLeft === 5) {
					this.spanLeft = 1;
					this.spanRight = 23;
				} else {
					this.spanLeft = 5;
					this.spanRight = 19;
				}
			},
			routeTo(e) {console.log(12312);
			var flowid = e.split('|')[0].split('/')[1];
			var nodeid = e.split('/')[1].split('|')[1];
        var obj = {
          flowid:flowid,
          nodeid:nodeid
        }
				delCookie('parent')
				setCookie('currentUserAction',JSON.stringify(obj),1000 );
				this.$router.push(e);
			},
			handlequery(){
				var usrid = localStorage.getItem("usrid");
				for(let i=0,l=this.menulist.length;i<l;i++){
					if(this.menulist[i].usrid != usrid){
						this.menulist[i].showinpage = false
					}else{
						this.menulist[i].showinpage = true
					}
				}
				/*window.localStorage.removeItem("usrid");
        window.localStorage.removeItem("menus");
				window.localStorage.removeItem("adminmenus");
				window.localStorage.removeItem("pages");
				window.localStorage.removeItem("usrinfo");*/
			}
		},
		created:function(){
			this.handlequery();
		},
		mounted:function(){
			var me = this;
			this.$http.get(this.globalconfig.uploadcompanynameapi,{
			},{
					emulateJSON: true
			}).then((response) => {
					if(response.body.success){
							me.companyName = response.body.success.companyname;
					}
			});
		}
	}

	//删除cookie
	function delCookie(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null)
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}

	//获取cookie
	function getCookie(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return null;
		}
	}

	// 新建cookie
	function setCookie(name,value,day){ //设置cookie的属性名和属性值和有效天数
    var oDate=new Date();
    oDate.setDate(oDate.getDate()+day);
    document.cookie=name+'='+value+';expires='+oDate;//expires代表过期时间，
  }
</script>





