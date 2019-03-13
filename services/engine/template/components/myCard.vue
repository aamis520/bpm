<template>
    <section>
    	<Card>
    		<p slot="title" v-if="isTitleShow">{{cardTitle}}</p>
	        <div id = "layouttobeadd"></div>
	    </Card>
    </section>
</template>
<script>
	let importstart;

	let ownflowid = ""
	let ownnodeid = ""
	let ownpageid = ""

	let cardTitle = ""

    export default {
    	components:{},
        data () {
        	return{
        		cardTitle:'',
        		isTitleShow(){
        		  return cardTitle == "" ? 0 : 1;
        		}
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
