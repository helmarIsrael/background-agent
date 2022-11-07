#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/myeskwela/")

from myeskwela import app as application
application.secret_key = 'XLROU6WwjjzAPC8QLaGL'
