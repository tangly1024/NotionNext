// 创建一个div元素，用来放置爱心图片
var heart = document.createElement('div')
// 设置div元素的样式，如宽度、高度、位置、透明度等
heart.style.width = '50px'
heart.style.height = '50px'
heart.style.position = 'fixed'
heart.style.left = '-100px'
heart.style.top = '-100px'
heart.style.zIndex = '9999'
heart.style.opacity = '0'
// 设置div元素的背景图片为爱心图片
heart.style.backgroundImage = "url('https://i.postimg.cc/xCT9JCRX/fish.png')"
// 将div元素添加到文档中
document.body.appendChild(heart)
// 定义一个函数，用来在鼠标点击时显示和移动爱心图片
function showHeart(e) {
  // 获取鼠标点击的位置
  var x = e.clientX
  var y = e.clientY
  // 将爱心图片移动到鼠标点击的位置，并设置透明度为1
  heart.style.left = x - 25 + 'px'
  heart.style.top = y - 25 + 'px'
  heart.style.opacity = '1'
  // 使用CSS动画来实现爱心图片的缩放和旋转效果
  heart.style.transition = 'all 0.5s'
  heart.style.transform = 'scale(1.2) rotate(45deg)'
  // 使用setTimeout函数来延迟一段时间后，将爱心图片隐藏并恢复原样
  setTimeout(function () {
    heart.style.opacity = '0'
    heart.style.transform = 'scale(1) rotate(0deg)'
    heart.style.transition = 'none'
  }, 500)
}
// 给文档添加一个点击事件监听器，调用showHeart函数
document.addEventListener('click', showHeart)
