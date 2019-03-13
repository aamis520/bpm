<style scoped>
    .header{
        margin-bottom:10px;
    }
    .right{
        text-align:right;
    }
</style>
<template>
    <section>
        <div class="header">
            <Row>
                <Col span="12">
                    <h3>术语列表</h3>
                </Col>
                <Col span="12" class="right">
                <Button type="info" @click="createCk()">创建</Button>
                </Col>
            </Row>
        </div>
        <Table border :columns="tableTitle" :data="allCkInfos"></Table>

    </section>
</template>

<script>

    export default{
        data(){
            return{
                tableTitle:[
                    {
                        title:'术语ID',
                        width:220,
                        key:'id'
                    },
                    {
                        title:'术语名称',
                        width:200,
                        key:'name'
                    },
                    {
                        title:'术语描述',
                        key:'desc'
                    },
                    {
                        title:'操作',
                        key:'action',
                        align:'center',
                        width:150,
                        render:(h,params) => {
                            return h('div',[
                                h('Button',{
                                    props:{
                                        type:'primary',
                                        size:'small'
                                    },
                                    style:{
                                        marginRight:'5px'
                                    },
                                    on:{
                                        click:()=>{
                                            this.open(params)
                                        }
                                    }
                                },'修改'),
                                h('Button',{
                                    props:{
                                        type:'error',
                                        size:'small'
                                    },
                                    on:{
                                        click:() => {
                                            this.remove(params)
                                        }
                                    }
                                },'删除')
                            ])
                        }
                    }

                ],
                allCkInfos:[]
            }
        },
        methods:{
            createCk(){
                this.$router.push({
                    path:'/keywordgenerate'
                })
            },

            open(params){
                var _id = this.allCkInfos[params.index].id;
                this.$router.push({
                    path:'/keywordgenerate',
                    query:{
                        ckid:_id
                    }
                })
            },

            remove(params){
                alert('需要删除ck的功能吗')
            },

            handleGetCks(){
                this.$http.get(this.globalconfig.listcksapi,{
                    params:{

                    }
                },{emulateJSON:true})
                .then((response) => {
                    if(response.data.cks){
                        this.allCkInfos = [];
                        for(let i = 0; i < response.data.cks.length;i++){
                            let _id = response.data.cks[i].id;
                            let _name = response.data.cks[i].name;
                            let _desc = response.data.cks[i].desc;
                            this.allCkInfos.push({id:_id,name:_name,desc:_desc})
                        }
                    }
                },(response) => {
                    this.$Message.error("术语获取失败")
                })
            }
        },

        mounted:function(){
            this.handleGetCks();
        }
    }
</script>
