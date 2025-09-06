// 文件路径: themes/heo/components/LayoutIndexApp.js
// 这是我们为App式首页准备的全新布局文件

/**
 * 自定义的App式首页布局
 */
const LayoutIndexApp = () => {
  return (
    // p-5 是为了让内容和屏幕边缘有点间距
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">
        欢迎来到我的博客
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        这里是您的自定义主页，之后我们会在这里添加卡片式布局。
      </p>

      {/* 
        这里可以放你第一张截图里的内容，例如：
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-pink-100 h-32 rounded-lg">TikTok直播</div>
          <div className="bg-blue-100 h-32 rounded-lg">Facebook</div>
          <div className="bg-red-100 col-span-2 h-48 rounded-lg">视频播放</div>
        </div>
      */}

    </div>
  )
}

export default LayoutIndexApp
