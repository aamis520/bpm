#!/usr/bin/env python
# -*- coding:utf-8 -*-

from pymongo import MongoClient
import os
import glob
import zipfile
import re

#配置信息
dbaddress = '192.168.6.10'
dbport= 27017
dbname='BPM-test'

customervuefolder = './src/pages/flows/customer/'

################

allpages = []

def backupcodes():
	print 'backupcodes'
	filename = 'customerbak.zip'
	z = zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED)
	startdir = customervuefolder
	for dirpath, dirnames, filenames in os.walk(startdir):
		for filename in filenames:
			z.write(os.path.join(dirpath, filename)) 
	z.close()

def replaceswithbak():
	print 'replaceswithbak'

def renametobak():
	print 'renamefile'
	for fpathe,dirs,fs in os.walk(customervuefolder):
		for f in fs:
			if(os.path.join(fpathe,f).endswith('vue')):
				os.rename( os.path.join(fpathe,f),  os.path.join(fpathe,f)+'bak')


def getallpages():
	print 'getallpages'
	conn = MongoClient(dbaddress, dbport)
	db = conn[dbname]
	table=db['engine-pages']
	for u in table.find():
		allpages.append(customervuefolder + u['flowid']+'/'+u['nodeid']+'/'+u['filename'])
	conn.close()

def findrelationandrestore():
	print 'findandrestorevue'
	for page in allpages:
		findrelationandrestorefile(page)

def findrelationandrestorefile(filename):
	if (2==restorefileifneeded(filename)):
		for file in getvueinfile(filename+'.vue'):
			findrelationandrestorefile(file)

#如果返回1，则表明这个文件未做处理，也就不需要重新查的文件中的内容是否还需要解析。
#如果返回2，则表明这个文件刚被重命名回来，也就是说需要继续处理文件内的vue引用。
def restorefileifneeded(filenamewithoutextend):
	if(os.path.exists(filenamewithoutextend+'.vue')):
		return 1
	if(os.path.exists(filenamewithoutextend+'.vuebak')):
		os.rename( filenamewithoutextend+'.vuebak',  filenamewithoutextend+'.vue')
		return 2
	if(os.path.exists(filenamewithoutextend+'.vuebakbak')):
		os.rename( filenamewithoutextend+'.vuebakbak',  filenamewithoutextend+'.vue')
		return 2
	if(os.path.exists(filenamewithoutextend+'.vuebakbakbak')):
		os.rename( filenamewithoutextend+'.vuebakbakbak',  filenamewithoutextend+'.vue')
		return 2
	print filenamewithoutextend + '  not found, need check carefully'

def replacerelatedpath(filenames):
	ret = []
	for i in filenames:
		if i.startswith( '../../' ):
			t = i.replace('../../' , customervuefolder)
			if(False == t.endswith('selectOnePersonModal')):
				ret.append(t)
	return ret

def getvueinfile(filename):
	newvue = []
	pattern1=re.compile("(?<=\").*(?=.vue\")")
	pattern2=re.compile("(?<=').*(?=.vue')")
	for line in open(filename, 'r'):
		newvue = newvue + replacerelatedpath(pattern1.findall(line))
		newvue = newvue + replacerelatedpath(pattern2.findall(line))

	return newvue

def main():
	backupcodes()
	renametobak()
	getallpages()
	findrelationandrestore()

main()