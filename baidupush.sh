#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 检查是否传入了正确的参数
if [ $# -lt 1 ]; then
  echo "Please provide the your website as an argument."
  exit 1
fi

# 百度链接推送
python baidupush.py $1
# curl -H 'Content-Type:text/plain' --data-binary @urls.txt "http://data.zz.baidu.com/urls?site=https://vuepress.ghlerrix.cn&token=oUldnU4HZvSTlh0e"

rm -rf urls.txt # 删除文件