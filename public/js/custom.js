// 这里编写自定义js脚本；将被静态引入到页面中
// 开始引入 Twikoo
var script = document.createElement('script');
script.src = 'https://cdn.bootcdn.net/ajax/libs/twikoo/1.6.29/twikoo.all.min.js';
script.async = true;

document.head.appendChild(script);
// 引入 Twikoo 结束
