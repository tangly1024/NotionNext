// 这里编写自定义js脚本；将被静态引入到页面中
// fitvids.js
// 注意：您需要将该文件与FitVids库一同引入页面中。

(function() {
  var videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/3KZb5fO2m8E';
  videoContainer.appendChild(iframe);
  document.body.appendChild(videoContainer);

  fitVids.init({
    selector: 'video, img', // 这里可以修改为您需要的选择器
    maxWidth: '100%', // 最大宽度，可以设置具体的像素值或百分比
    aspectRatio: 3 / 2, // 长宽比，例如16:9或4:3等
  });
})();
