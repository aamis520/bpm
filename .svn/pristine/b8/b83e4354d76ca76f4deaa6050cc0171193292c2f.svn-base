<template>
    <div class="gantt" keyid='keyid' :style="{width: '850px', height: '300px'}"></div>
</template>

<script>

    export default {
        methods:{
            refreshData(data){
                this.drawGantt(data);
            },
            drawGantt(data) {
                $(".gantt").gantt({
                    source: [],
                    scale: "days",
                    minScale: "days",
                    navigate: "buttons",
                    scrollToToday:true
                });
            }
        },
        created : function () {
            this.$http.get(this.globalconfig.querybyck,
                {
                    params: {
                        usrid: window.localStorage.getItem("usrid"),
                        ckid: "111",
                    }
                }, {emulateJSON: true})
                .then((response) => {
                    this.refreshData(response.body.data)
                }, () => {
                    this.data = "读失败"
                });

        }

    }
</script>