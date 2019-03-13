<style scoped>

.form {
    width: 90%;
}

</style>

<template>

<div class="form">
    <i-form ref:form-validate :model="formValidate" :rules="ruleValidate" :label-width="80">

        <Form-item label="关DDDD" prop="keywordname">
            <i-input v-model="formValidate.name" placeholder="请输入姓名"></i-input>
        </Form-item>

        <Form-item label="类型" prop="keywordtype">
            <i-select :value.sync="formValidate.keywordtype" placeholder="请选择类型">
                <i-option value="string">字符</i-option>
                <i-option value="number">数字</i-option>
                <i-option value="Date">日期</i-option>
            </i-select>
        </Form-item>

        <Form-item label="介绍" prop="keyworddesc">
            <i-input v-model="formValidate.keyworddesc" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入..."></i-input>
        </Form-item>

        <Form-item>
            <i-button type="primary" @click.native="handleSubmit('formValidate')">提交</i-button>
            <i-button type="ghost" @click.native="handleReset('formValidate')" style="margin-left: 8px">重置</i-button>
        </Form-item>

    </i-form>

</div>

</template>

<script>

export default {
    data() {
            return {
                formValidate: {
                    keywordname: '',
                    keywordtype: '',
                    keyworddesc: ''
                },
                ruleValidate: {
                }
            }
        },
        methods: {
            handleSubmit(name) {
                console.log(this.globalconfig.engineserver);
                this.$http.get({url: this.globalconfig.engineserver})
                      .then(() => {
                        this.$Message.success('这是一条成功的提示');
                      }, () => {
                        this.$Message.success('这是一条失败的提示');
                      });
                },
            handleReset(name) {
                this.$Message.warning('这是一条警告的提示');
                }
        }
}

</script>
