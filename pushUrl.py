import random
import re
import ssl
import time

import requests
import argparse

ssl._create_default_https_context = ssl._create_unverified_context


# 每日推送限额，可根据实际情况修改
QUOTA = 100


def parse_sitemap(site):
    site = f'{site}/sitemap.xml'
    try:
        result = requests.get(site)
        big = re.findall('<loc>(.*?)</loc>', result.content.decode('utf-8'), re.S)
        return list(big)
    except:
        print('请检查你的url是否有误。')
        print('正确的应是完整的域名，包含https://，且不包含‘sitemap.xml’, 如下所示：')
        print('正确的示例: https://ghlcode.cn')
        print('详情参见: https://ghlcode.cn/fe032806-5362-4d82-b746-a0b26ce8b9d9')



def push_to_bing(site, urls, api_key):
    endpoint = f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey={api_key}"

    payload = {
        "siteUrl": site,
        "urlList": urls
    }

    try:
        response = requests.post(endpoint, json=payload)
        result = response.json()
        if response.status_code == 200:
            print("成功推送到Bing.")
        elif "ErrorCode" in result:
            print("推送到Bing出现错误，错误信息为：", result["Message"])
    except Exception as e:
        print("An error occurred:", e)


def push_to_baidu(site, urls, token):
    api_url = f"http://data.zz.baidu.com/urls?site={site}&token={token}"

    payload = "\n".join(urls)
    headers = {"Content-Type": "text/plain"}

    try:
        response = requests.post(api_url, data=payload, headers=headers)
        result = response.json()
        if "success" in result and result["success"]:
            print("成功推送到百度.")
        elif "error" in result:
            print("推送到百度出现错误，错误信息为：", result["message"])
        else:
            print("Unknown response from Baidu:", result)
    except Exception as e:
        print("An error occurred:", e)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='parse sitemap')
    parser.add_argument('--url', type=str, default=None, help='The url of your website')
    parser.add_argument('--bing_api_key', type=str, default=None, help='your bing api key')
    parser.add_argument('--baidu_token', type=str, default=None, help='Your baidu push token')
    args = parser.parse_args()

    # 获取当前的时间戳作为随机种子
    current_timestamp = int(time.time())
    random.seed(current_timestamp)

    if args.url:
        # 解析urls
        urls = parse_sitemap(args.url)
        if urls is not None:
            # 判断当前urls数量是否超过额度，若超过则取当日最大值，默认为100，可根据实际情况修改
            if len(urls) > QUOTA:
                urls = random.sample(urls, QUOTA)
            # 推送bing
            if args.bing_api_key:
                print('正在推送至必应，请稍后……')
                push_to_bing(args.url, urls, args.bing_api_key)
            # 推送百度
            if args.baidu_token:
                print('正在推送至百度，请稍后……')
                push_to_baidu(args.url, urls, args.baidu_token)
    else:
        print('请前往 Github Action Secrets 配置 URL')
        print('详情参见: https://ghlcode.cn/fe032806-5362-4d82-b746-a0b26ce8b9d9')
