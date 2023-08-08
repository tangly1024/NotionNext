// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        document.title = 'QAQ别走好吗...';
    } 
    else {
        document.title = 'Hate_fish🐟的鱼缸';
    }
});
