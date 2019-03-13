#!/usr/bin/env python
# -*- encoding: utf-8 -*-

from pyspider.libs.base_handler import *

# 本模版最后的主要变量需要根据任务的不同而做不同的替代
# 主要替代的内容包括如下几点
# 1. 文件上方定义的各种结构。
# 2. 处理详情页时的 @config等配置信息。

class userinfo:
	def __init__(self):
			self.needuserlogin = false;
			self.username = ''
			self.usernamexpath = ''
			self.password = ''
			self.passwordxpath = ''
			self.buttonxpath = ''

class indexpageinfo
	def __init__(self):
			self.url = ""
			

class detailpageinfo
	def __init__(self):
			self.username = ''

class resultsformat:
	def __init__(self):
			self.username = ''


class Handler(BaseHandler):
    
    def on_start(self):
		if (userinfo.needuserlogin){
			#模拟用户名密码输入后登录。
			self.crawl(indexpageinfo.url,
					   fetch_type='js', js_script=self.loginjsgenerate(), callback=self.detailpage_parser)
		} else {
			#如果没有设置用户信息，则认为不需要登录，直接爬取就可以。
			self.crawl(indexpageinfo.url,
					   fetch_type='js', callback=self.phantomjs_parser)
		}

	#详情页分析函数
    @config(age=0)
    def detailpage(self, response):
        return ....................

	#返回用于登录的JS字符串
	def loginjsgenerate(self)
			............

	#返回用于搜索的JS字符串命令，用于在网页上执行。
	def searchjsgenerate(self)
			............

	#返回用于过滤的JS字符串命令，用于在网页上执行。
	def filterjsgenerate(self)
			............

	#根据逻辑返回不同的结果，写入对应的数据表中。
	def generateresults(self)
			........