
<template>
    <div style="width:100%;height:40px;background:#fff;padding:10px;margin-top:10px;">
        <Steps :current="currentStep" style="background:#fff;height:40px;padding:10px">
            <Step v-for="(step,index) in steps" :title="step.title" :content="step.content" :icon="step.icon" :key="step.index"></Step>
        </Steps>
    </div>
</template>
<style>

</style>
<script>
     export default {
          data(){
              return {
                  // 这里给-1，是因为这里有可能出现0，为了使vue监听到数据的变化，给值为-1
                  currentStep:-1,
                  steps:[],
                  querydata:{}
              }
          },
          methods:{
              handleGetExceptedFlow(){
                    var flowid = this.$router.currentRoute.path.split('|')[0].split('/')[1];
                    var nodeid = this.$router.currentRoute.path.split('|')[1];
                    var usrid = window.localStorage.getItem("usrid");
                    if(this.$router.currentRoute.query){
        			this.querydata = this.$router.currentRoute.query
	        		}
	        		if(this.querydata.itemid == undefined){
	        			this.querydata.itemid = ''
	        		}
//                var itemid = "5975c7cd17605cac137e5fc3";
//                var flowid = "596c1c8478d2b4c03a1b9783";
//                var usrid = "0";
                  this.$http.get(this.globalconfig.getexceptedflow,{
                      params:{
                          itemid:this.querydata.itemid,
                          flowid:flowid,
                          usrid:usrid
                      }
                  },{emulateJSON:true})
                  .then((response)=>{
                      if(response.data.flows && response.data.flows.length > 0){
                          var _tempArr = [];
                          // 数组中保存的是已走过的节点，也就是ispassed为true的节点
                          var _isPassedArr = [];
                          for(var i = 0 ; i < response.data.flows.length;i++){
                              var _tempObj = {};
                              _tempObj.title = response.data.flows[i].nodename;
                              _tempObj.content = response.data.flows[i].nodedesc;
                              _tempObj.icon = response.data.flows[i].icon;
                              _tempArr.push(_tempObj);

                              // 这里用于判断当前属于第几步
                              if(response.data.flows[i].ispassed == true){
                                  _isPassedArr.push(response.data.flows[i]);
                              }
                          }
                          this.steps = _tempArr;

                          // 这里不用延时器处理，页面的加载样式会出问题
                          var _self = this;
                          setTimeout(function(){
                              _self.currentStep = _isPassedArr.length -1 ;
                          },1);
                      }
                  },(response)=>{
                      this.$Message.error("获取exceptedflow失败")
                  })
              }
          },
          created(){
              this.handleGetExceptedFlow();
          },
          mounted: function () {
		  this.$nextTick(function () {
		   	this.handleGetExceptedFlow();
		  })
		}
     }

</script>
