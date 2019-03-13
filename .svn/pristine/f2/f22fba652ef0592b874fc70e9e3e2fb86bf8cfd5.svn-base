<style scoped>

    .form {
        width: 90%;
    }

</style>

<template>

    <div class="form">
        <div id = "addtubiao1"> </div>
        <i-form ref="formInline" :model="formInline" :rules="ruleValidate" :label-width="80">
            <div id = "layouttobeadd"> </div>
            
            <Form-item>
                <i-button type="primary" @click.native="handleSubmit('formValidate')">提交</i-button>
                <i-button type="ghost" @click.native="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
            </Form-item>

        </i-form>

        <div id = "addtubiao2"> </div>
    </div>

</template>

<script>

    export default {
        data() {
            return {
                formInline: generateDatamodel(),
                ruleValidate: {
                }
            }
        },
        methods: {
            handleSubmit(data) {
                this.$http.get(this.globalconfig.submitdataapi,
                    {
                        params:{
                            usrid:window.localStorage.getItem("usrid"),
                            flowid: this.$router.currentRoute.path.substr(1),//目前的url中，基本都是flowid.
                            submitinfo:JSON.stringify(this.formInline),
                        }
                    },  {emulateJSON: true})
                    .then(() => {
                        this.$Message.success('这是一条成功的提示');
                    }, () => {
                        this.$Message.success('这是一条失败的提示');
                    });
            },
            handleReset(data) {
                this.$Message.warning('这是一条警告的提示');
            }
        }
    }

    function generateDatamodel () {
            var item = {xingming: '111', nianling: '111'};
            return item;
    }


</script>
