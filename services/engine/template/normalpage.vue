
<template>
    <Table :columns="columns" :data="data"></Table>
</template>

<script>

    export default {
        data () {
            return {
                columns: generateDatamodel(),
                data: []
            }
        },
        methods: {
            handleQuery() {
                this.$http.get(this.globalconfig.listsks,
                    {
                        params: {
                            usrid: window.localStorage.getItem("usrid"),
                            flowid:getflowid(this.$router.currentRoute.path),
                            nodeid:getnodeid(this.$router.currentRoute.path),
                            submitinfo: JSON.stringify(this.formInline),
                        }
                    }, {emulateJSON: true})
                    .then((response) => {
                        this.data = response.body.data;
                        this.$Message.success('这是一条成功的提示');
                    }, () => {
                        this.$Message.success('这是一条失败的提示');
                    });
                var keytoshow = [{id: " ", name: " "}];
                return keytoshow;
            },
        },
        created : function () {
            this.handleQuery();
        }
    }

    function getflowid (path) {
        return path.substr(1).split('|')[0]
    }

    function getnodeid (path) {
        return path.substr(1).split('|')[1]
    }


    function generateDatamodel () {
        var keytoshow = [];
        return keytoshow + generatebuttonmodel ();
    }

    function generatebuttonmodel () {
        var buttontoshow = [];
        return keytoshow;
    }

</script>
