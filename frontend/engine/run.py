#!/usr/bin/python

import os
os.chdir(os.path.split(os.path.realpath(__file__))[0])
os.system('npm run dev')
