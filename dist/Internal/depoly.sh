#!/bin/bash

source common.sh

#按需部署数据库

ifdepolyDB=$(fReadConfig './deploy.ini'  'deployDB')
if [ "$ifdepolyDB"=true ] 
then
	dbName=$(fReadConfig "deploy.ini" "destDBName")
	dbAddress=$(fReadConfig "deploy.ini" "destDBAddress")
	dbPort=$(fReadConfig "deploy.ini" "destDBPort")
	dbUserName=$(fReadConfig "deploy.ini" "destDBUserName")
	dbPassword=$(fReadConfig "deploy.ini" "destDBPassword")

	#导入前，先删除
	deleteDB dbName, dbAddress, dbPort, dbUserName, dbPassword
	importDB "../dist/BPM.DB", dbName, dbAddress, dbPort, dbUserName, dbPassword
fi


#进行部署
{
	funZipFolder ./dist/frontEngint.tar  /opt/lampp/htdocs/bpm/engine
	funZipFolder ./dist/frontFramework.tar /opt/lampp/htdocs/bpm/framework
}

#将BPMStart和BPMStop写到/etc/init.d中
{
	mklink 
	mklink 
}
