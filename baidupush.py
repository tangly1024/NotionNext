import re
import ssl
import requests
ssl._create_default_https_context = ssl._create_unverified_context
url = 'https://www.ghlerrix.cn/sitemap.xml'
result = requests.get(url)
big = re.findall('<loc>(.*?)</loc>', result.content.decode('utf-8'), re.S)
for i in big:
    print(i)
    # op_xml_txt = open('xml.txt', 'a')
    # op_xml_txt.write('%s\n' % i)
