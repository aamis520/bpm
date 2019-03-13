<template>
    <div>
        <Button @click="showPersonSelectModalFn">aa</Button>
        <selectOnePersonModal :toSelectOnePersonModal="toSelectOnePersonModal" @fromSelectOnePersonModal="getSelectOnePersonModalMsg"></selectOnePersonModal>
    </div>
</template>
<style>

</style>
<script>
    import selectOnePersonModal from "./selectOnePersonModal.vue";
    export default{
        components:{
            selectOnePersonModal
        },

        data(){
            return{
                personSelected:'',
                toSelectOnePersonModal:{
                    isModalShow:false
                },
            }
        },

        methods:{
            showPersonSelectModalFn(){
                this.toSelectOnePersonModal.isModalShow = true;
            },
            getSelectOnePersonModalMsg(data){
                this.toSelectOnePersonModal.isModalShow = false;
                console.log(data)
            }
        }
    }
</script>
