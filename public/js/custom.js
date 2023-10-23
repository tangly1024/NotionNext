// 这里编写自定义js脚本；将被静态引入到页面中
// 获取需要添加动画的元素
var element = document.getElementById("myElement");

// 设置初始状态
element.style.opacity = 0;
element.style.position = "absolute";
element.style.left = "50%";
element.style.top = "50%";
element.style.transform = "translate(-50%, -50%)";

// 延迟一定时间后执行动画
setTimeout(function() {
  // 添加飞入动画
  element.style.transition = "all 1s ease-in-out";
  element.style.opacity = 1;
  element.style.transform = "translate(-50%, -50%) scale(1)";
}, 2000); // 延迟2秒后开始执行动画
