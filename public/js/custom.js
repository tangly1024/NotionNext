// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        normal_title = document.title;
        document.title = 'QAQ别走好吗...';
    } else document.title = normal_title;
});
