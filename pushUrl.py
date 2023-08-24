import re
import ssl
import requests
import argparse

ssl._create_default_https_context = ssl._create_unverified_context


def parse_stiemap(site):
    site = f'{site}/sitemap.xml'
    result = requests.get(site)
    big = re.findall('<loc>(.*?)</loc>', result.content.decode('utf-8'), re.S)
    return list(big)


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
            print("successfully submitted to Bing.")
        elif "ErrorCode" in result:
            print("Error pushing URLs to Bing:", result["Message"])
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
            print("URLs successfully pushed to Baidu.")
        elif "error" in result:
            print("Error pushing URLs to Baidu:", result["message"])
        else:
            print("Unknown response from Baidu:", result)
    except Exception as e:
        print("An error occurred:", e)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='parse sitemap')
    parser.add_argument('url', type=str, help='The url of your website')
    parser.add_argument('--bing_api_key', type=str, default=None, help='your bing api key')
    parser.add_argument('--baidu_token', type=str, default=None, help='Your baidu push token')
    args = parser.parse_args()
    urls = parse_stiemap(args.url)
    if args.bing_api_key:
        push_to_bing(args.url, urls, args.bing_api_key)
    if args.baidu_token:
        push_to_baidu(args.url, urls, args.baidu_token)
