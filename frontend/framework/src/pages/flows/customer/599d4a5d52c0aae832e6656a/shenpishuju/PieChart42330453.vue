
<style scoped>  
#pieChart {  
    height: 400px;  
}  
</style>  
<template>  
    <div class="content">  
        <div id="pieChart"></div>  
    </div>  
</template>  
<script>  
	import echarts from 'echarts'  
	
	let ownflowid = "599d4a5d52c0aae832e6656a"
	let ownnodeid = "shenpishuju"
	let ownpageid = "599d4b9852c0aae832e66572"
	
export default {  
    data() {  
        return {
        	pieTitle:'',
        	pieSubtitle:'',
            chart: null,  
            opinionPie: [],  
            opinionPieData: []
        }  
    },  
    methods: {
    	handleQuery(){
        	this.$http.get(this.globalconfig.querybyck,{
				params:{
		    		keywordid: "5992aaea100c7d94129eb213undefined"
				}
			},{emulateJSON:true})
			.then((response)=>{
				if(response.body.error){
					this.$Message.error(response.body.error)
				}else{
					this.$Message.success('成功');
					var pieData = response.data.data
					console.log(pieData)
					this.pieTitle = pieData.name
					this.pieSubtitle= pieData.desc
					this.opinionPie = []
					this.opinionPieData = []
					for(var i=0;i<pieData.value.length;i++){
						var temp = i
						for(var k in pieData.value[temp]){
							this.opinionPie.push(k)
							this.opinionPieData.push({
								value:pieData.value[temp][k],
								name:k
							})
						}
					}
					this.drawGraphPie('pieChart')
					
				}
			},(response)=>{
				this.$Message.success('成功');
			})
    	},
        // 绘图  
        drawGraphPie(id) {
            // 绘图方法  
            this.chart = echarts.init(document.getElementById(id))  
            this.chart.showLoading()  
            var that = this  
            this.chart.setOption({
                title: {  
                    text: this.pieTitle,  
                    subtext: this.pieSubtitle,  
                    x: 'center'  
                },  
                tooltip: {  
                    trigger: 'item',  
                    formatter: "{a} <br/>{b} : {c} ({d}%)"  
                },  
                legend: {  
                    x: 'center',  
                    y: 'bottom',  
                    data: this.opinionPie // 别忘了this  
                },  
                calculable: true,  
                toolbox: {
		            show: true,
		            //orient: 'vertical',
		            right: 'right',
		            top: 'top',
		            feature: {
		                saveAsImage: {}
		            }
		        },
                series: [{  
                    name: '人员',  
                    type: 'pie',  
                    // 内圆半径，外圆半径  
                    radius: [0, 150],  
                    // 位置，左右，上下  
                    center: ['50%', '50%'],  
                    roseType: 'area',  
                    data: this.opinionPieData, 
                }]  
            })  
            this.chart.hideLoading()  
        }  
    },  
    created:function(){
    	this.handleQuery()
    }
}  
</script>  