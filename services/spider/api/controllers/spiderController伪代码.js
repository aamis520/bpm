/**
 * SpinderController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
	listProject: function (req, res) {
		//从指定目录下读取所有的目录名返回。（未来需要由状态管理起来，第一版先由目录列举得出项目列表）
		.....
	}

	startProject: function(req, res){
		//start的逻辑稍微复杂一点，它兼有创建/更新/启动项目三个功能。
		//start会在项目对应的文件夹下创建一个timestamp文件，里面存的是上次的创建项目时间。
		//如果时间和文件夹更新时间相比老，说明项目有更新，则将之前的项目任务全部停止，更新模版文件，再开始。
		//如果时间相对较新，说明没有更新，则只需要重新启动所有任务即可。
		....
	}

	stopProject: function(req, res){
		//用“组”过滤所有pyspider的tasks，然后将每一个tasks都停止。
		....
	}

	projectStatus: function(req, res){
		//用“组”过滤所有pyspider的tasks，然后取每一个tasks的当前状态，然后汇总返回。
		//如果参数中有组名，则找对应组名的status，如果没有，则列出全部。
		....
	}
}

/*
下面的data中会存的内容为

{
	"projectinfo": { ....  }
	"mediainfo": []
	"spidercontent": []
	"tasksinfo": []
}

爬虫任务的命名规则为：
	
	1. 以项目名为spinder的分组名。
	2. 任务名为：媒体名+

*/

function createTasksToSpider(projectname) {
	//
    return new Promise(function (resolve, reject) {
        readProjectInfo(projectname)				//从项目的xml中读取项目的信息。
            .then(readMediaLibraryInfo)			//将项目中需要的媒体库的信息读取出来。
            .then(generateSpiderFiles)				//通过Spider的模版，生成对应的文件内容，多个。
            .then(generateSpiderTasks)				//生成对应的任务，通过pyspider的API生成。
            .then(function (data) {
	                resolve(data);
	            })
	    })
}



function readProjectInfo(data) {
		return new Promise(function (resolve, reject) {
				//读取project中对应的各种xml文件的内容，将信息存入data中的对应位置。
		})
}


function readMediaLibraryInfo(data) {
		return new Promise(function (resolve, reject) {
				//将项目中对应的media信息读出来，存入data中对应的位置。
		})
}


function generateSpiderFiles(data) {
		return new Promise(function (resolve, reject) {
				//读取爬虫的模版，根据定义好的规则，替换模版中对应的位置，生成能用于pyspider的python代码。
		})
}


function generateSpiderTasks(data) {
		return new Promise(function (resolve, reject) {
				//调用pypider API，生成tasks. 并将每个tasks的组重命名为项目名。
		})
}