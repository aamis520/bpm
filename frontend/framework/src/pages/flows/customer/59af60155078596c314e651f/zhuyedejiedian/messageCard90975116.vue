
<style scoped>
	.row {
		width: 100%;
		line-height:32px;
		font-size:12px;
		font-weight:34px;
	}
	.balck{
	  color:#323232;
	}
	.right {
		float: right
	}
	.row:hover{
	  color:#39f;
	}
</style>
<template>
	<div>
		<Card>
			<p slot="title">{{title}}</p>
			<router-link to="messageList" slot="extra" v-show="msgList.length > count">
				查看更多
				<Icon type="ios-arrow-right"></Icon>
			</router-link>
			<ul>
				<li v-for="(item,index) in msgList" v-if="msgList.length > 0" class="row">
					<router-link :to="item.url" class="balck">{{item.title}}
            <span class="right">
                        {{item.time}}
                    </span>
          </router-link>
				</li>
			</ul>
			<template v-if="msgList.length == 0">
				<p>暂无消息</p>
			</template>
		</Card>
	</div>
</template>

<script>
	let msgset = {"title":"234234123412312","count":"10","type":"time","flowid":"","status":""}

	let ownflowid = "59af60155078596c314e651f"
	let ownnodeid = "zhuyedejiedian"
	let ownpageid = "59af60855078596c314e6521"

	export default {
		data() {
			return {
				// 传入
				title: '消息',
				// 传入   显示多少条,默认给10条
				count: 10,
				// 传入
				// type有三种：按时间选择全部(type:"time")
				// 显示某个流程，type:"flow",flowid=flowid)
				// 按某种类型(type:"type",status:"submit"（待审批）/approve（已同意）/deny(已拒绝))
				// 传入
				type: '',
				// 传入
				flowid: '',
				// 传入
				status: '',

				msgList: []
			}
		},
		methods: {
			//整理数据
			replaceparam() {
				this.type = msgset.type
				this.flowid = msgset.flowid
				this.status = msgset.status
				if(msgset.title != ""){
					this.title = msgset.title
				}
				if(msgset.count != ""){
					this.count = Number(msgset.count)
				}
			},
			timerHandleQueryMsgList() {
				var _self = this;
				setInterval(function() {
					_self.handleQueryMsgList();
				}, 300000)
			},
			handleQueryMsgList() {
				var _self = this;
				// 默认按照时间，取10条
				var _count = 10;
				var _usrid = window.localStorage.getItem("usrid");
				// delete --start
//				var _usrid = '598186bb13b114687efa39e4';
				// delete --end
				var _type = "time";
				if(_self.type == "time") {
					_type = "time"
				}
				if(_self.type == "flow") {
					_type = "flow";
				}
				var _status = "";
				if(_self.type == "type") {
					_type = "type";
					if(_self.status == "deny") {
						_status = "deny"
					} else if(_self.status == "approve") {
						_status = "approve"
					} else if(_self.status == "submit") {
						_status = "submit"
					}
				}
				var _flowid = "";
				if(_self.flowid) {
					_flowid = _self.flowid;
				}
				console.log(_self.title)
				_self.$http.get(_self.globalconfig.listmessageforcardapi, {
						params: {
							usrid: _usrid,
							count: _count,
							type: _type,
							flowid: _flowid,
							status: _status
						}
					}, {
						emulateJSON: true
					})
					.then((response) => {
						if(response.data.messages) {
							if(response.data.messages) {
								var _tempArr = [];
								for(var i = 0; i < response.data.messages.length; i++) {
									var _tempObj = {};
									_tempObj.title = response.data.messages[i].message.title;
									_tempObj.time = _self.formatTime(response.data.messages[i].createdAt, "yyyy-MM-dd hh:mm");
									_tempObj.url = response.data.messages[i].message.url + "&usrid=" + _usrid;
									_tempArr.push(_tempObj);
								}
								_self.msgList = _tempArr;
							}
						}
					}, (response) => {
						_self.$Message.error("获取消息列表失败")
					})
			},

			formatTime(time, fmt) {
				var date = new Date(time);
				if(/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
				}
				let o = {
					'M+': date.getMonth() + 1,
					'd+': date.getDate(),
					'h+': date.getHours(),
					'm+': date.getMinutes(),
					's+': date.getSeconds()
				};
				for(let k in o) {
					if(new RegExp(`(${k})`).test(fmt)) {
						let str = o[k] + '';
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
					}
				}
				return fmt;

				function _padLeftZero(str) {
					return('00' + str).substr(str.length);
				}
			}

		},
		mounted() {
			this.replaceparam()
			this.handleQueryMsgList()
			this.timerHandleQueryMsgList()

		}
	}
</script>
