#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 解析sitemap.xml， 记得换成你自己的域名，注意检查是否包含‘www’
python baidupush.py 'www.ghlerrix.cn'

# 百度链接推送，换成自己的token和域名
curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=https://www.ghlerrix.cn&token=oUldnU4HZvSTlh0e"

rm -rf urls.txt # 删除文件