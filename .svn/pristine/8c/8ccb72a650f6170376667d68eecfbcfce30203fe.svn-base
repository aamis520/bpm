<style scoped>  
.histoGram {  
    height: 400px;  
}   
</style>  
<template>  
    <div class="content">  
        <div class="histoGram" :id="randomid"></div>  
    </div>  
</template>  
<script>  
	import echarts from 'echarts'

	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""
	
export default {  
    data() {  
        return {
            chart: null,  
            HistoTitle:"",
            HistoSubTitle:'',
            opinionHisTo: [],  
            opinionHisToData: [],
            xAxis:[],
            seriesData:[],
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
    		//此处为ajax获取数据 根据复杂关键字查询出来的数据
    		this.$http.get(this.globalconfig.querybyck,{
				params:{
					usrid:window.localStorage.getItem("usrid"),
		    		keywordid:"",
					itemid:me.itemid
				}
			},{emulateJSON:true})
			.then((response)=>{
				if(response.body.error){
					this.$Message.error(response.body.error)
				}else{
					this.$Message.success('成功');
					var data = response.data.data;console.log(data);
					var histoData = data.value;
					//首先判断数据的格式，用第一项判断
					//类型一，某些属性的值，若干对
					//类型二，某个属性（若干个），某种情况下的值（若干个）
					//类型三，写一个假的数据，提示类型错误
					var dataType = "";
					var firstKey = Object.keys(histoData)[0];
					if(typeof(histoData[firstKey]) == "number"){ //每一项都是数字
						dataType = 1;
					} else if(typeof(histoData[firstKey]) == "object" && !(histoData[firstKey] instanceof Array)) { //每一项都是object（不是数组）
						//数据第一项的第一个子项的值是数字(有点复杂，不太容易阅读)
						if(typeof(histoData[firstKey][Object.keys(histoData[firstKey])[0]]) == "number"){
							dataType = 2;
						} else {
							dataType = 3;
						}
					} else if(Object.keys(histoData).length == 0){
						dataType = 3;
					}
					if(dataType == 1){
						var xAxisArr = [];//横坐标
						var seriesDataArr = [];//值
						for(var key in histoData){
							xAxisArr.push(key);	
							seriesDataArr.push(histoData[key]);
						}
						me.xAxis = xAxisArr;
						me.seriesData = {
							name:[],
							type:"bar",
							data:seriesDataArr
						};
					} else if(dataType == 2) {   //这个时候需要两层遍历
						var opinionHisToArr = [];//颜色标识 ---
						var xAxisArr = [];//横坐标 ---
						var seriesDataArr = [];//值
						var tempdata = {};
						for(var key in histoData){ // 遍历数据
							xAxisArr.push(key); 
							for(var key1 in histoData[key]){//遍历每一项，得到所有的底层数据
								if(opinionHisToArr.indexOf(key1) < 0){
									opinionHisToArr.push(key1); //把颜色提示的数组数据放在其中

								}
							}
						}
						for(let i=0;i<opinionHisToArr.length;i++){
							tempdata[opinionHisToArr[i]] = [];
						}
						for(var key2 in histoData){
							for(let i=0;i<opinionHisToArr.length;i++){
								tempdata[opinionHisToArr[i]].push(histoData[key2][opinionHisToArr[i]]);
							}
						}
						for(var name in tempdata){
							seriesDataArr.push({
								name:name,
								type:"bar",
								data:tempdata[name]
							});
						}
						me.opinionHisTo = opinionHisToArr;
						me.xAxis = xAxisArr;
						me.seriesData = seriesDataArr
					} else if(dataType == 3) {
						me.opinionHisTo = [];
						me.xAxis = ["类型错误"];
						me.seriesData = [{
							name:"类型错误",
							type:"bar",
							data:[666]
						}];
					}
					me.HistoTitle = data.name;
					me.HistoSubTitle = data.desc;
					me.drawGraphHisTo(me.randomid);
				}
			},(response)=>{
				this.$Message.success('成功');
			})
    	},
        // 绘图  
        drawGraphHisTo(id) {
            // 绘图方法  
			var me = this;
            this.chart = echarts.init(document.getElementById(id))  
            this.chart.showLoading()  
            var that = this  
            this.chart.setOption({
            	title: {  
                    text: me.HistoTitle,  
                    subtext: "",  
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
			        data:me.opinionHisTo
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
			            data : me.xAxis
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : me.seriesData  
            })  
            this.chart.hideLoading()  
        }  
    },  
    // keypoint：执行方法  
    // “将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。”  
    mounted() {  
        this.$nextTick(function() {  
            this.drawGraphHisTo(this.randomid)  
        })  
    },
    created:function(){
    	this.handleQuery()
    }
}  
</script>  
