// 这里编写自定义js脚本；将被静态引入到页面中
// pages/_app.js
var OriginTitile=document.title;
var jiao;
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState == 'hidden') {
        document.title = '(つェ⊂)诶呀，网站崩溃了;
        clearTimeout(jiao);
    } 
    else {
        document.title = '(*´∇｀*) 咦,又好了~ '+OriginTitile;
        jiao=setTimeout(function(){
            document.title=OriginTitile;
        },4000);
    }
});

onload=function(){
    var click_cnt=0;
    html=document.getElementsByTagName("html")[0];
    $body=document.getElementsByTagName("body")[0];
    $html.onclick=function(e){
        var $elem=document.createElement("b"),$elem.style.color="#FFC0CB",$elem.style.zIndex=9999,$elem.style.position="absolute",$elem.style.select="none";
        var x=e.pageX,y=e.pageY;
        switch($elem.style.left=x-10+"px",$elem.style.top=y-20+"px",clearInterval(anim),++click_cnt){
            case 10:$elem.innerText="OωO";
                break;
            case 20:$elem.innerText="(๑•́ ∀ •̀๑)";
                break;
            case 30:
                $elem.innerText="(๑•́ ₃ •̀๑)";
                break;
            case 40:
                $elem.innerText="(๑•̀_•́๑)";
                break;
            case 50:
                $elem.innerText="（￣へ￣）";
                break;
            case 60:
                $elem.innerText="(╯°口°)╯(┴—┴";
                break;
            case 70:
                $elem.innerText="૮( ᵒ̌皿ᵒ̌ )ა";
                break;
            case 80:
                $elem.innerText="╮(｡>口<｡)╭";
                break;
            case 90:
                $elem.innerText="( ง ᵒ̌皿ᵒ̌)ง⁼³₌₃";
                break;
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
                $elem.innerText="(ꐦ°᷄д°᷅)";
                break;
            default:
                $elem.innerText="🌸"}$elem.style.fontSize=10*Math.random()+8+"px";
    var increase=0,anim;
    setTimeout((function(){
        anim=setInterval((function(){
            150==++increase&&(clearInterval(anim),$body.removeChild($elem)),$elem.style.top=y-20-increase+"px",$elem.style.opacity=(150-increase)/120
        }),8)
    }),70),$body.appendChild($elem)
}
};
