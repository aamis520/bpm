#!/usr/bin/env python
# -*- encoding: utf-8 -*-

from pyspider.libs.base_handler import *

# ��ģ��������Ҫ������Ҫ��������Ĳ�ͬ������ͬ�����
# ��Ҫ��������ݰ������¼���
# 1. �ļ��Ϸ�����ĸ��ֽṹ��
# 2. ��������ҳʱ�� @config��������Ϣ��

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
			#ģ���û�������������¼��
			self.crawl(indexpageinfo.url,
					   fetch_type='js', js_script=self.loginjsgenerate(), callback=self.detailpage_parser)
		} else {
			#���û�������û���Ϣ������Ϊ����Ҫ��¼��ֱ����ȡ�Ϳ��ԡ�
			self.crawl(indexpageinfo.url,
					   fetch_type='js', callback=self.phantomjs_parser)
		}

	#����ҳ��������
    @config(age=0)
    def detailpage(self, response):
        return ....................

	#�������ڵ�¼��JS�ַ���
	def loginjsgenerate(self)
			............

	#��������������JS�ַ��������������ҳ��ִ�С�
	def searchjsgenerate(self)
			............

	#�������ڹ��˵�JS�ַ��������������ҳ��ִ�С�
	def filterjsgenerate(self)
			............

	#�����߼����ز�ͬ�Ľ����д���Ӧ�����ݱ��С�
	def generateresults(self)
			........