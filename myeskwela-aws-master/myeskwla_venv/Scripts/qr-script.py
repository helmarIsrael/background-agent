#!c:\users\user\desktop\myeskwela\myeskwela-realtime\myeskwela-aws-master\myeskwla_venv\scripts\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'qrcode==7.3.1','console_scripts','qr'
__requires__ = 'qrcode==7.3.1'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('qrcode==7.3.1', 'console_scripts', 'qr')()
    )
