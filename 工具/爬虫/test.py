#coding=utf-8
from selenium import webdriver

driver = webdriver.Firefox()
driver.get("http://www.baidu.com")

item=driver.find_element_by_xpath("//*[@id='kw']")
item.send_keys("python")

buttton = driver.find_element_by_xpath("//*[@id='su']")
buttton.click()
