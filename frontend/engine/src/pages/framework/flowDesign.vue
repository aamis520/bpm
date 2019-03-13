<style scoped>
#iframeWarpper{
 width:100%;
 height:510px;
 overflow:hidden;
}
.iframe{
  width:100%;
  height:100%;
  border:none;
  margin:0;
  padding:0;
  overflow-y:hidden;
}
</style>
<template>
  <div>
      <div id="iframeWarpper">
          <iframe class="iframe" :src="iframesrc" ref="iframe"></iframe>
      </div>

      <!--这是连线上的条件的子组件-->
      <Condition @toparent="getChildMsg" :toChildMsg="tochildMsg" ref="Condition"></Condition>
      <!--这是自动审批的子组件-->
      <AutoCheck @fromautocheck="getAutoCheckMsg" :toautocheckMsg="toautocheckMsg" ref="AutoCheck"></AutoCheck>
      <!--这是选择人员的Modal-->
      <SelectPerson @fromselectperson="getSelectPersonMsg" :toSelectPersonMsg="toSelectPersonMsg" ref="SelectPerson"></SelectPerson>
      <!--这是反向连线的Modal-->
      <ReverseCondition @fromReverseCondition="getReverseConditionMsg" :toReverseConditionMsg="toReverseConditionMsg" ref="ReverseCondition"></ReverseCondition>
      <!--这是结束节点的Modal-->
      <EndNodeCondition @fromEndNodeCondition="getEndNodeConditionMsg" :toEndNodeConditionMsg="toEndNodeConditionMsg" ref="EndNodeCondition"></EndNodeCondition>
  </div>
</template>
<script>
// 这是连线设置条件的Modal
import Condition from './flowConditionModal.vue';

// 这是自动审批条件的Modal
import AutoCheck from './flowAutoCheckConditionModal.vue';

// 这是反向连线的Modal
import ReverseCondition from './flowReverseConditionModal.vue';

// 这是选择人员的Modal
import SelectPerson from './selectpersonModal.vue';

// 这是结束节点的modal
import EndNodeCondition from './endNodeConditionModal.vue';
    export default{
        components:{
            Condition,
            AutoCheck,
            SelectPerson,
            ReverseCondition,
            EndNodeCondition
        },
        data(){
            return{
                // 向链接上的条件子组件传递的数据
                tochildMsg:{
                    flowid:'',
                    isflowConditionModalShow:false,
                    conditionid:'',
                    flowid:'',
                    messageconditionid:'',
                },

                // 向自动审批的子组件传递的数据
                toautocheckMsg:{
                    flowid:this.$router.currentRoute.query.flowid,
                    isAutoCheckModalShow:false,
                    autoCheckMsgid:''
                },

                // 向选择人员的子组件你传递的数据
                toSelectPersonMsg:{
                    isSelectPersonModalShow:false,
                    isReshow:"empty",
                    persons:"",
                    groups:"",
                    apartments:"",
                    isAdmin:"empty"
                },

                // 向反向条件的子组件传递的值
                toReverseConditionMsg:{
                    flowid:'',
                    conditionid:'',
                    isReverseConditionModalShow:false,
                },

                // 向结束节点的设置组件传递的数据
                toEndNodeConditionMsg:{
                    thisFlowid:'',
                    conditionid:'',
                    isEndNodeConditionModalShow:false
                },


                iframesrc:this.globalconfig.flowdesigniframesrc + "?flowid="
                    + this.$router.currentRoute.query.flowid
                    + '&name=' + this.$router.currentRoute.query.name
                    + '&desc=' + this.$router.currentRoute.query.desc
            }
        },
        methods:{
            // 获取连线上的条件子组件传过来的conditionid
            getChildMsg(data){
                // 子组件关闭modal时候，通知父组件修改isflowConditionModalShow状态
                this.tochildMsg.isflowConditionModalShow = false;

                //这是传给iframe的值
                //只有有值的情况下，才会向html传递
                var _tempObj = {}
                if(data.conditionid){
                    _tempObj.conditionid = data.conditionid;
                }
                if(data.priority){
                    _tempObj.priority = data.priority;
                }
                if(data.desc){
                    _tempObj.desc = data.desc;
                }

                if(data.conditionid || data.priority || data.desc){
                    this.$refs.iframe.contentWindow
                        .postMessage(
                            _tempObj,
                            '*'
                        )
                }

                var _tempOb = {};
                if(data.messageconditionid){
                    _tempOb.messageconditionid = data.messageconditionid;
                    this.$refs.iframe.contentWindow
                        .postMessage(
                            _tempOb,
                            "*"
                        )
                }
            },

            // 获取自动审批条件modal穿过来的id
            getAutoCheckMsg(data){
                // 子组件关闭的modal的时候，通知父子间修改isAutoCheckModalShow状态
                this.toautocheckMsg.isAutoCheckModalShow = false;
                this.toautocheckMsg.autoCheckMsgid = '';
                // 这是传给iframe的值
                // 在有值的情况下才向html做传递
                var _tempObj = {};
                if(data.autoCheckMsgid){
                    _tempObj.autoCheckMsgid = data.autoCheckMsgid;
                    this.$refs.iframe.contentWindow
                        .postMessage(
                            _tempObj,
                            "*"
                        )
                }
            },

            // 获取选择人员modal传过来的值
            getSelectPersonMsg(data){
                // 子组件关闭的时候，通知父子间修改isSelectPersonModalShow状态
                this.toSelectPersonMsg.isSelectPersonModalShow = false;
                // 重置isReshow和isAdmin的值，是确保能让vue监听到数据变化，触发向子组件传递的数据
                this.toSelectPersonMsg.isReshow = "empty";
                this.toSelectPersonMsg.isAdmin = "empty";
                if(data.isClickOk == true){
                    // 这是传给iframe的值,这里只判断有没有字段,不判断值是不是空数组，在有值的情况下才向html做传递
                    var _tempObj = {};
                    if(data.persons){
                        _tempObj.persons = data.persons;
                    }
                    if(data.groups){
                        _tempObj.groups = data.groups;
                    }
                    if(data.apartments){
                        _tempObj.apartments = data.apartments;
                    }
                    _tempObj.isAdmin = data.isAdmin;
                    if(_tempObj.persons || _tempObj.groups || _tempObj.apartments){
                        this.$refs.iframe.contentWindow
                        .postMessage(
                            _tempObj,
                            "*"
                        )
                    }
                }
            },

            // 获取反向条件Modal传过来的值
            getReverseConditionMsg(data){
                this.toReverseConditionMsg.isReverseConditionModalShow = false;
                this.toReverseConditionMsg.conditionid = '';
                var _tempObj = {};
                if(data.reversemessageconditionid){
                    _tempObj.reversemessageconditionid = data.reversemessageconditionid;
                }

                if(_tempObj.reversemessageconditionid){
                    this.$refs.iframe.contentWindow
                        .postMessage(
                            _tempObj,
                            "*"
                        )
                }
            },

            // 获取结束节点Modal传过来的值
            getEndNodeConditionMsg(data){
                 this.toEndNodeConditionMsg.isEndNodeConditionModalShow = false;
                 var _tempObj = {};
                 if(data.endNodeConditionid){
                     _tempObj.endNodeConditionid = data.endNodeConditionid;
                 }
                 this.toEndNodeConditionMsg.conditionid = '';

                 if(_tempObj.endNodeConditionid){
                     this.$refs.iframe.contentWindow
                        .postMessage(
                            _tempObj,
                            '*'
                        )
                 }
            },
            flowReverseConditionModalShow(){
                this.toReverseConditionMsg.isReverseConditionModalShow = true;
            },

            flowConditionModalShow(){
                this.tochildMsg.isflowConditionModalShow = true;
            },

            autoCheckModalShow(){
                this.toautocheckMsg.isAutoCheckModalShow = true;
            },

            selectPersonModalShow(){
                this.toSelectPersonMsg.isSelectPersonModalShow = true;
            },

            endNodeConditionModalShow(){
                this.toEndNodeConditionMsg.isEndNodeConditionModalShow = true;
            }
        },

        created(){
            var _self = this;
            window.addEventListener("message",function(ev){
                // 这是控制连线上的条件Modal的--Start
                if(ev.data.conditionId){
                    _self.tochildMsg.conditionid = ev.data.conditionId;
                }
                if(ev.data.priority){
                    _self.tochildMsg.priority = ev.data.priority;
                }
                if(ev.data.isConditionModalShow){
                    _self.flowConditionModalShow();
                }
                //消息的条件id
                if(ev.data.messageconditionId){
                    _self.tochildMsg.messageconditionid = ev.data.messageconditionId;
                }
                if(ev.data.messageflowid){
                    _self.tochildMsg.flowid = ev.data.messageflowid;
                }
                // 这是控制连线上的条件Modal的--end

                // 这是控制自动审批的条件的modal的--start
                if(ev.data.autoCheckMsgid){
                    _self.toautocheckMsg.autoCheckMsgid = ev.data.autoCheckMsgid;
                }
                if(ev.data.isAutoCheckModalShow){
                    _self.autoCheckModalShow();
                }
                // 这是控制连线上的条件Modal的--end

                // 这是控制选择人员的Modal的 --start
                if(ev.data.isSelectPersonModalShow){
                    _self.selectPersonModalShow();
                }
                // 这里只判断有没有字段，不能判断数组的长度，数组为[]也代表一个状态
                if(ev.data.persons){
                    _self.toSelectPersonMsg.persons = ev.data.persons;
                }
                if(ev.data.groups){
                    _self.toSelectPersonMsg.groups = ev.data.groups;
                }
                if(ev.data.apartments){
                    _self.toSelectPersonMsg.apartments = ev.data.apartments;
                }
                _self.toSelectPersonMsg.isReshow = ev.data.isReshow;
                _self.toSelectPersonMsg.isAdmin = ev.data.isAdmin;

                // 这是控制选择人员的Modal的 --end

                // 这里是控制反向条件的Modal的 --Start
                if(ev.data.reversemessageconditionid){
                    _self.toReverseConditionMsg.conditionid = ev.data.reversemessageconditionid;
                }
                if(ev.data.reversemessageconditionflowid){
                    _self.toReverseConditionMsg.flowid = ev.data.reversemessageconditionflowid;
                }
                if(ev.data.isReverseConditionModalShow){
                    _self.flowReverseConditionModalShow();
                }

                // 这里是控制反向条件的Modal的 --end

                // 这里是结束节点设置条件的Modal --Start
                if(ev.data.endNodeConditionFlowid){
                    _self.toEndNodeConditionMsg.thisFlowid = ev.data.endNodeConditionFlowid;
                }
                if(ev.data.endNodeConditionid){
                    _self.toEndNodeConditionMsg.conditionid = ev.data.endNodeConditionid;
                }
                if(ev.data.isEndNodeConditionModalShow){
                    _self.endNodeConditionModalShow();
                }
                // 这里是结束节点设置条件的Modal --end

            })
        }
    }
</script>
