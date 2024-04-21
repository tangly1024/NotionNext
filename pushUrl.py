import random
import re
import ssl
import time

import requests
import argparse

ssl._create_default_https_context = ssl._create_unverified_context


# Daily push quota, you can modify it according to your needs
QUOTA = 100


def parse_sitemap(site):
    site = f'{site}/sitemap.xml'
    try:
        result = requests.get(site)
        urls = re.findall('<loc>(.*?)</loc>', result.content.decode('utf-8'), re.S)
        return list(urls)
    except:
        print('Please check your URL for errors.')
        print('The correct format should be the complete domain name, including "https://" and without "sitemap.xml", as shown below:')
        print('Correct example: https://example.com')
        print('For more details, please refer to: https://example.com/documentation')


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
            print("Successfully pushed to Bing.")
        elif "ErrorCode" in result:
            print("Error occurred while pushing to Bing. Error message:", result["Message"])
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
            print("Successfully pushed to Baidu.")
        elif "error" in result:
            print("Error occurred while pushing to Baidu. Error message:", result["message"])
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

    # Use the current timestamp as a random seed
    current_timestamp = int(time.time())
    random.seed(current_timestamp)

    if args.url:
        # Parse urls
        urls = parse_sitemap(args.url)
        if urls is not None:
            # Check if the number of urls exceeds the quota, if so, limit it to the quota
            if len(urls) > QUOTA:
                urls = random.sample(urls, QUOTA)
            # Push to Bing
            if args.bing_api_key:
                print('Pushing to Bing, please wait...')
                push_to_bing(args.url, urls, args.bing_api_key)
            # Push to Baidu
            if args.baidu_token:
                print('Pushing to Baidu, please wait...')
                push_to_baidu(args.url, urls, args.baidu_token)
    else:
        print('Please configure the URL in GitHub Action Secrets')
        print('For more details, please refer to: https://ghlcode.cn/fe032806-5362-4d82-b746-a0b26ce8b9d9')
