<style scoped>  
.pieChart {  
    height: 400px;  
}   
</style>  
<template>  
    <div class="content">  
        <div class="pieChart" :id="randomid"></div>  
    </div>  
</template>  
<script>  
	import echarts from 'echarts'  
	
	let keywordid = "" //有一个bug，card中引一个布局，里边再有pieChart，keywordidid后边会跟一个undefined，这个问题还没改，在blankpage中改
export default {  
    data() {  
        return {
        	pieTitle:'',
        	pieSubtitle:'',
            chart: null,  
            opinionPie: [],  
            opinionPieData: [],
			itemid:"",
			randomid:""
        }  
    }, 
	watch:{
		pageishowwinthinmodal(){
			this.itemid = this.globalconfig.parentid;
			this.handleQuery();
		}
	},  
    methods: {
    	handleQuery(){
			var me = this;
			me.randomid ='pieChart' + new Date().getTime() + parseInt(Math.random()*1000000);
			if(me.$router.currentRoute.query.itemid){
				me.itemid = me.$router.currentRoute.query.itemid
			}
        	this.$http.get(this.globalconfig.querybyck,{
				params:{
		    		keywordid: keywordid,
                    usrid:localStorage.getItem("usrid"),
					itemid:me.itemid
				}
			},{emulateJSON:true})
			.then((response)=>{
				if(response.body.error){
					this.$Message.error(response.body.error)
				}else{
					this.$Message.success('成功');
					var piedata = response.data.data;console.log(piedata);
					//判断数据的类型是不是符合饼图的结构要求	
					var layerTrue = true;//是否符合数据类型的标记
					if(Object.keys(piedata.value).length == 0){
						layerTrue = false;	
					}
					for(var key in piedata.value){  //遍历数据，
						if(typeof(piedata.value[key]) == "object"){ //不能是数组
							layerTrue = false;
							break;	
						}
					}
					if(!layerTrue){ //不符合，写一条假的数据替换进数据中给饼图
						piedata.value = {"格式错误":"99"};	
					}
					//饼状图需要四个数据。1标题，2描述，3各项详情【数组】，4值和项目名绑定数据【数组】
					me.pieTitle = piedata.name;//标题
					me.pieSubtitle = piedata.desc;//描述
					var option = [];//数据项
					var optiondata = [];//数据项及其取值
					for(var key in piedata.value){
						option.push(key);
						optiondata.push({
							value:parseFloat(piedata.value[key]),
							name:key
						});
					}
					me.opinionPie = option;
					me.opinionPieData = optiondata
					me.drawGraphPie(me.randomid);
				}
			},(response)=>{
				this.$Message.success('成功');
			})
    	},
        // 绘图  
        drawGraphPie(id) {
            // 绘图方法  
            var me = this;
            this.chart = echarts.init(document.getElementById(id))  
            this.chart.showLoading()  
            var that = this  
            this.chart.setOption({
                title: {  
                    text: me.pieTitle,  
                    subtext:"",    
                    x: 'center'  
                },  
                tooltip: {  
                    trigger: 'item',  
                    formatter: "{a} <br/>{b} : {c} ({d}%)"  
                },  
                legend: {  
                    orient: 'vertical',
        			left: 'left',  
                    data: me.opinionPie 
                },  
                calculable: true,  
                toolbox: {
		            show: true,
		            right: 'right',
		            top: 'top'
		        },
                series: [{  
                    name: me.pieTitle,
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
                    data:me.opinionPieData,
                    itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
                }]  
            })  
            this.chart.hideLoading()  
        }  
    },  
    mounted:function(){
    	this.handleQuery()
    }
}  
</script>  