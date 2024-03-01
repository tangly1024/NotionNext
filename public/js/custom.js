// 这里编写自定义js脚本；将被静态引入到页面中
// 将元素添加到页面中 公告的下面
// 创建 a 元素
var aElement = document.createElement("a");

// 设置 href 属性
aElement.href = "https://slack.com/oauth/v2/authorize?client_id=5125684075586.6718798715717&scope=app_mentions:read,channels:history,chat:write,commands,groups:history,im:history,mpim:history,users:read&user_scope=&state=A06M4PGM1M3";

// 创建 img 元素
var imgElement = document.createElement("img");
imgElement.alt = "Add to Slack";
imgElement.height = "40";
imgElement.width = "139";
imgElement.src = "https://platform.slack-edge.com/img/add_to_slack.png";
imgElement.srcset = "https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x";

// 将 img 元素添加到 a 元素中
aElement.appendChild(imgElement);

// 将 a 元素添加到页面中
document.querySelector('.sticky.top-20').appendChild(aElement);
