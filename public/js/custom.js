// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
var OriginTitile=document.title;
var jiao;
document.addEventListener('visibilitychange',function(){
    if(location.href != "https://你的域名/")(document.hidden){
        document.title="(つェ⊂)誒呀，網站崩潰了";
        clearTimeout(jiao);
    }
    else{
        document.title='(*´∇｀*) 咦,又好了~ '+OriginTitile;
        jiao=setTimeout(function(){
            document.title=OriginTitile;
        },4000);
        window.onload = function () {
        let hour = new Date().getHours()
        let str = ''
        if (hour < 6) {
            str = '修仙中……'
        } else if (hour < 9) {
            str = '早上好！'
        } else if (hour < 12) {
            str = '上午好！'
        } else if (hour < 14) {
            str = '中午好！'
        } else if (hour < 17) {
            str = '下午好！'
        } else if (hour < 19) {
            str = '傍晚好！'
        } else if (hour < 22) {
            str = '晚上好！'
        } else {
            str = '夜深了，要早点休息哦！'
        }
        
        function c () {
            document.title = document[a] ? str + '[' + d + ']' : d
        }
        
        let a = document.title
        let b = document.title
        let d = document.title
        typeof document.hidden !== 'undefined' ? (a = 'hidden', b = 'visibilitychange')
        : typeof document.mozHidden !== 'undefined' ? (a = 'mozHidden', b = 'mozvisibilitychange')
        : typeof document.webkitHidden !== 'undefined' && (a = 'webkitHidden', b = 'webkitvisibilitychange')
        typeof document.addEventListener === 'undefined' && typeof document[a] === 'undefined' || document.addEventListener(b, c, !1)
        }
    }
});

