<template>
    <div>
      <Table :columns="historyColumns" :data="historyData"></Table>
      <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
    </div>
</template>
<style scoped>
  .paging{
      float:right;
      margin-top:10px;
  }
</style>
<script>
export default {
        data () {
            return {
                ajaxHistoryData:[],
                // 初始化信息总条数
                dataCount:0,
                // 每页显示多少条
                pageSize:10,
                historyColumns: [
                    {
                        title: '人员',
                        key: 'username'
                    },
                    {
                        title: '操作',
                        key: 'shenpistatus'
                    },
                    {
                        title: '意见',
                        key: 'shenpicomments'
                    },
                    {
                        title: '时间',
                        key: 'time'
                    }

                ],
                historyData: []
            }
        },
        methods:{
            // 获取历史记录信息
            handleListApproveHistory(){
                //var flowid = this.$router.currentRoute.path.split('|')[0].split('/')[1];
                //var nodeid = this.$router.currentRoute.path.split('|')[1];
                var flowid = '596c1c8478d2b4c03a1b9783';
                var nodeid = 'zidongshenpi1';
                console.log(this.globalconfig.listcurnodehostories)
                this.$http.get(this.globalconfig.listcurnodehostories,{
                    params:{
                        flowid:flowid,
                        nodeid:nodeid
                    }
                },{emulateJSON:true})
                .then((response)=>{
                    if(response.data.histories){
                        // 保存取到的所有数据
                        this.ajaxHistoryData = response.data.histories;
                        this.dataCount = response.data.histories.length;
                        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                        if(response.data.histories.length < this.pageSize){
                            this.historyData = this.ajaxHistoryData;
                        }else{
                            this.historyData = this.ajaxHistoryData.slice(0,this.pageSize);
                        }
                    }
                },(response)=>{
                    this.$Message.success(' 获取记录信息失败');
                })
            },
            changepage(index){
                var _start = ( index - 1 ) * this.pageSize;
                var _end = index * this.pageSize;
                this.historyData = this.ajaxHistoryData.slice(_start,_end);
            }
        },
        created(){
             this.handleListApproveHistory();
        }
    }
</script>
