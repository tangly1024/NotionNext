// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
var OriginTitile=document.title,jiao;
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        document.title = '(つェ⊂)诶呀，网站崩溃了';
        clearTimeout(jiao);
    } 
    else {
        document.title = '(*´∇｀*) 咦，又好了~ '+ OriginTitile;
        jiao=setTimeout(function(){
            document.title=OriginTitile;
        },4000);
        // document.title = 'Hate_fish🐟的鱼缸';
    }
});
