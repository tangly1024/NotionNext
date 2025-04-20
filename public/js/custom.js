// 这里编写自定义js脚本；将被静态引入到页面中
<script async>
(function(){
var fullres = document.createElement('script');
fullres.async = true;
fullres.src = 'https://blog.985864.xyz/fullkaires/blog985864.js?'+(new Date()-new Date()%43200000);
fullres.attributes.siteKeyOverride = 'blog985864';
document.head.appendChild(fullres);
})();
</script>