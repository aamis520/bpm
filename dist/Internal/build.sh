#!/bin/bash

source common.sh

#按需生成数据库
ifbuildDB=$(fReadConfig './build.ini'  'buildDB')

if [ "$ifbuildDB"=true ] 
then
	dbName=$(fReadConfig "build.ini" "sourceDBName")
	dbAddress=$(fReadConfig "build.ini" "sourceDBAddress")
	dbPort=$(fReadConfig "build.ini" "sourceDBPort")
	dbUserName=$(fReadConfig "build.ini" "sourceDBUserName")
	dbPassword=$(fReadConfig "build.ini" "sourceDBPassword")
	exportDB '../dist/BPM.DB', $dbName, $dbAddress, $dbPort, $dbUserName, $dbPassword
fi

#进行必要的编译
{
	#改变配置文件
	targetDomain=$(fReadConfig "build.ini" "dormain")

	fileBak "../../frontend/engine/src/Config.vue"
	fileBak "../../frontend/framework/src/Config.vue"
	fileReplace $targetDomain "localhost" "../../frontend/engine/src/Config.vue"
	fileReplace $targetDomain "localhost" "../../frontend/framework/src/Config.vue"

	#开始编译
	callExternal ../../frontend/engine/build.py
	callExternal ../../frontend/framework/build.py

	#编译完成后，将原文件恢复
	fileRestore "../../frontend/engine/src/Config.vue"
	fileRestore "../../frontend/framework/src/Config.vue"
}


#进行打包，对前端，只打包dist内容，对后端，全部打包。
{
	fZipFolder ../../frontend/engine/dist  ./dist/frontEngint.tar
	fZipFolder ../../frontend/framework/dist  ./dist/frontFramework.tar
	fZipFolder ../../services/engine  ./dist/serviceEngine.tar
	fZipFolder ../../services/framework  ./dist/serviceFramework.tar
}