
<template>
    <section>
    	<Card>
    		<p slot="title" v-if="cardTitle">{{cardTitle}}</p>
	        <div id = "layouttobeadd">
<ziliuchengtijiaobiaodan></ziliuchengtijiaobiaodan>
</div>
	    </Card>
    </section>
</template>
<script>
	let importstart;
import ziliuchengtijiaobiaodan from '../../5a141043e6134880181775c1/ziliucheng/ziliuchengtijiaobiaodan.vue'


	let ownflowid = "5a140e4ce6134880181775b7"
	let ownnodeid = "kaishi"
	let ownpageid = "5a140ec9e6134880181775b9"

	let cardTitle = "子流程的"

    export default {
    	components:{
ziliuchengtijiaobiaodan,},
        data () {
        	return{
        		cardTitle:'',
        	}
        },
        mounted:function(){
        	if(cardTitle != ""){
        		this.cardTitle = cardTitle
        	}
        }
    }
</script>
<style type="text/css" scoped>
	#layouttobeadd{
		/*text-align: center;*/
	}
</style>
