import re
import ssl
import requests
import argparse


if __name__ == '__main__':
    ssl._create_default_https_context = ssl._create_unverified_context
    parser = argparse.ArgumentParser(description='parse sitemap')
    parser.add_argument('url', help='The url of your website')
    args = parser.parse_args()
    url = f'https://{args.url}/sitemap.xml'
    result = requests.get(url)
    big = re.findall('<loc>(.*?)</loc>', result.content.decode('utf-8'), re.S)
    for i in big:
        # print(i)
        op_xml_txt = open('urls.txt', 'a')
        op_xml_txt.write('%s\n' % i)
