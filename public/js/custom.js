// 这里编写自定义js脚本；将被静态引入到页面中
document.addEventListener('click', function(event) {
  var shootingStar = document.createElement('div');
  shootingStar.style.position = 'absolute';
  shootingStar.style.top = '0';
  shootingStar.style.left = '50%';
  shootingStar.style.width = '5px';
  shootingStar.style.height = '5px';
  shootingStar.style.backgroundColor = '#fff';
  shootingStar.style.borderRadius = '50%';
  shootingStar.style.animation = 'shooting-star 2s infinite';
  document.body.appendChild(shootingStar);
  var delay = Math.random() * 2000;
  setTimeout(function() {
    shootingStar.style.left = (event.clientX - shootingStar.offsetWidth / 2) + 'px';
    shootingStar.style.top = (event.clientY - shootingStar.offsetHeight / 2) + 'px';
  }, delay);
});
