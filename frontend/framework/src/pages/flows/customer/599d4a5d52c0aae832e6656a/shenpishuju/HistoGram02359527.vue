
<style scoped>  
#histoGram {  
    height: 400px;  
}  
</style>  
<template>  
    <div class="content">  
        <div id="histoGram"></div>  
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
            chart: null,  
            HistoTitle:"",
            HistoSubTitle:'',
            opinionHisTo: [],  
            opinionHisToData: [],
            xAxis:[],
            seriesData:[]
        }  
    },  
    methods: {
    	handleQuery(){
    		//此处为ajax获取数据 根据复杂关键字查询出来的数据
    		this.$http.get(this.globalconfig.querybyck,{
				params:{
		    		keywordid:"5992aaea100c7d94129eb213"
				}
			},{emulateJSON:true})
			.then((response)=>{
				if(response.body.error){
					this.$Message.error(response.body.error)
				}else{
					this.$Message.success('成功');
					var histoData = response.data.data
					console.log("图表要用的数据为："+ histoData)
					this.HistoTitle = histoData.name
					this.HistoSubTitle = histoData.desc
					this.opinionHisTo = []
					this.xAxis = []
					this.seriesData=[]
					for(var i=0;i<histoData.value.length;i++){
						this.xAxis.push(i)
						for(var key in histoData.value[i]){
								this.opinionHisTo.push(key)
								this.seriesData.push({
									name:key,
									type:'bar',
									data:[histoData.value[i][key]]
								})
						}
					}
					//更新数据
					this.drawGraphHisTo('histoGram')  
				}
			},(response)=>{
				this.$Message.success('成功');
			})
        	
    	},
        // 绘图  
        drawGraphHisTo(id) {
            // 绘图方法  
            this.chart = echarts.init(document.getElementById(id))  
            this.chart.showLoading()  
            var that = this  
            this.chart.setOption({
            	title: {  
                    text: this.HistoTitle,  
                    subtext: this.HistoSubTitle,  
                    x: 'center'  
                },
                tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    legend: {
			    	x: 'center',  
                    y: '12%',  
			        data:this.opinionHisTo
			    },
			    grid: {
			        left: '5%',
			        right: '5%',
			        top: '20%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : this.xAxis
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : this.seriesData  
            })  
            this.chart.hideLoading()  
        }  
    },  
    // keypoint：执行方法  
    // “将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。”  
    mounted() {  
        this.$nextTick(function() {  
            this.drawGraphHisTo('histoGram')  
        })  
    },
    created:function(){
    	this.handleQuery()
    }
}  
</script>  
