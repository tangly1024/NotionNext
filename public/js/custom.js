// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
var OriginTitile=document.title;
var jiao;
document.addEventListener('visibilitychange',function(){
    if(location.href != "https://www.zilingheimei.icu/")(document.hidden){
        document.title="(つェ⊂)誒呀，網站崩潰了";
        clearTimeout(jiao);
    }
    else{
        document.title='(*´∇｀*) 咦,又好了~ '+OriginTitile;
        jiao=setTimeout(function(){
            document.title=OriginTitile;
        },4000);
    }
});

