<div align="right">
  <a title="English" href="/README.md">English</a>
</div>

<div align="center">

<img src="./source/img/butterfly-icon.png" width="150" height="150" alt="Butterfly Logo" />

# hexo-theme-butterfly

一個適用於 Hexo 的現代化、美觀且功能豐富的主題

![master version](https://img.shields.io/github/package-json/v/jerryc127/hexo-theme-butterfly/master?color=%231ab1ad&label=master)
![dev version](https://img.shields.io/github/package-json/v/jerryc127/hexo-theme-butterfly/dev?label=dev)
![npm version](https://img.shields.io/npm/v/hexo-theme-butterfly?color=%09%23bf00ff)
![hexo version](https://img.shields.io/badge/hexo-5.3.0+-0e83cd)
![license](https://img.shields.io/github/license/jerryc127/hexo-theme-butterfly?color=FF5531)
![GitHub stars](https://img.shields.io/github/stars/jerryc127/hexo-theme-butterfly?style=social)

📢 **在線預覽**: [Butterfly 官方](https://butterfly.js.org/) | [CrazyWong 博客](https://blog.crazywong.com/)

📖 **完整文檔**: [中文文檔](https://butterfly.js.org/posts/21cfbf15/) | [English Docs](https://butterfly.js.org/en/posts/butterfly-docs-en-get-started/)

![Butterfly 主題預覽](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/theme-butterfly-readme.png)

</div>

---

## 🚀 快速開始

### 💾 安裝方式

#### 方式一：Git 安裝（推薦）

> 💡 **提示**: 如果您在中國大陸訪問 GitHub 速度較慢，可以使用 [Gitee 鏡像](https://gitee.com/immyw/hexo-theme-butterfly.git)

在您的 Hexo 博客根目錄下執行：

```bash
# 安裝穩定版本（推薦）
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

```bash
# 安裝開發版本（搶先體驗新功能）
git clone -b dev https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
```

#### 方式二：NPM 安裝

> ⚠️ **注意**: NPM 安裝方式僅支援 Hexo 5.0.0 及以上版本

```bash
npm install hexo-theme-butterfly
```

### ⚙️ 主題配置

1. **啟用主題**: 修改您的 Hexo 配置檔案 `_config.yml`：

```yaml
theme: butterfly
```

2. **安裝依賴**: 如果您尚未安裝 pug 和 stylus 渲染器，請執行：

```bash
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

## ✨ 主題特色

### 🎨 設計風格
- [x] **卡片化設計** - 現代化的卡片式佈局
- [x] **圓角/直角設計** - 支援自訂邊框樣式
- [x] **響應式設計** - 完美適配各種螢幕尺寸
- [x] **雙欄佈局** - 優化的閱讀體驗
- [x] **深色模式** - 護眼的夜間模式

### 📝 內容功能
- [x] **多級選單** - 支援二級導航選單
- [x] **閱讀模式** - 專注的文章閱讀體驗
- [x] **目錄導航** - 電腦和手機雙端支援 TOC
- [x] **字數統計** - 顯示文章字數和閱讀時間
- [x] **相關文章** - 智能推薦相關內容
- [x] **過期提醒** - 自動提示文章更新狀態
- [x] **簡繁轉換** - 支援繁體中文和簡體中文切換
- [x] **標籤外掛** - 豐富的標籤外掛支持

### 🔍 搜尋與導航
- [x] **多種搜尋** - Algolia 搜尋 / 本地搜尋 / Docsearch
- [x] **內建 404** - 美觀的 404 錯誤頁面
- [x] **Pjax 支援** - 流暢的頁面切換體驗

### 🎨 程式碼展示
- [x] **語法高亮** - 內建多種主題（darker/pale night/light/ocean）
- [x] **程式碼功能** - 語言顯示/摺疊展開/複製按鈕/自動換行
- [x] **數學公式** - 支援 Mathjax 和 Katex

### 💬 社交互動
- [x] **多元評論系統** - Disqus/Gitalk/Valine/Waline/Twikoo/Giscus/Artalk 等
- [x] **雙評論支援** - 可同時啟用兩套評論系統
- [x] **分享功能** - Sharejs/Addtoany 分享套件
- [x] **線上客服** - Chatra/Tidio/Crisp 即時聊天

### 📊 數據分析
- [x] **訪問統計** - 不蒜子計數器
- [x] **網站分析** - Google Analytics/百度統計/Cloudflare Analytics/Microsoft Clarity/Umami
- [x] **站長驗證** - 各大搜尋引擎驗證
- [x] **廣告支援** - Google AdSense/自訂廣告位

### 🎪 視覺效果
- [x] **打字特效** - activate_power_mode 動畫
- [x] **背景特效** - 靜態彩帶/動態彩帶/飄帶效果/Canvas Nest
- [x] **滑鼠特效** - 煙花/愛心/文字點擊效果
- [x] **載入動畫** - Preloader 和 pace.js 進度條
- [x] **圖片效果** - Medium Zoom/Fancybox 圖片燈箱
- [x] **懶載入** - 圖片延遲載入優化

### 🛠️ 進階功能
- [x] **PWA 支援** - 漸進式網頁應用
- [x] **複製保護** - 可關閉文字複製/版權資訊追加
- [x] **主題定製** - 自訂網站配色方案
- [x] **圖表支援** - Mermaid 流程圖/Chart.js 數據圖表
- [x] **音樂符號** - ABCJS 音樂記譜法支援
- [x] **音樂播放器** - APlayer/Meting 音樂播放功能
- [x] **系列文章** - 系列文章組織功能
- [x] **Instantpage** - 頁面預載入加速
- [x] **Snackbar** - 優雅的提示訊息

## 🤝 貢獻者

感謝所有為 Butterfly 主題做出貢獻的開發者們！

[![Contributors](https://contrib.rocks/image?repo=jerryc127/hexo-theme-butterfly)](https://github.com/jerryc127/hexo-theme-butterfly/graphs/contributors)

## 📸 主題截圖

<div align="center">

![主題展示](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-1.jpg)

![主題展示](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-2.jpg)

![主題展示](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-3.jpg)

![主題展示](https://cdn.jsdelivr.net/gh/jerryc127/CDN@m2/img/butterfly-readme-screenshots-4.jpg)

</div>


## ⭐ Star 趨勢

[![Star History Chart](https://api.star-history.com/svg?repos=jerryc127/hexo-theme-butterfly&type=Date)](https://star-history.com/#jerryc127/hexo-theme-butterfly&Date)

## 🤝 一起構建更美好的主題

我們相信，**開源的力量來自於每一個人的參與**！無論您是開發者、設計師還是用戶，都可以為 Butterfly 主題的發展貢獻力量。

### 💬 獲取幫助與支援

- 🐛 **發現問題？** → [GitHub Issues](https://github.com/jerryc127/hexo-theme-butterfly/issues) - 讓我們一起解決！
- 💡 **有好想法？** → [GitHub Discussions](https://github.com/jerryc127/hexo-theme-butterfly/discussions) - 分享您的創意想法！
- 📚 **學習使用？** → [官方文檔](https://butterfly.js.org/) - 詳細的使用指南
- 💬 **即時討論？** → [Telegram 群組](https://t.me/bu2fly) - 與社群成員實時交流

### 🎯 參與貢獻

想要讓 Butterfly 變得更好嗎？我們歡迎您的任何形式的貢獻：

- **🔧 代碼貢獻** - 修復 Bug、添加新功能、優化性能
- **📝 文檔完善** - 改進文檔、翻譯內容、撰寫教程
- **🎨 設計建議** - UI/UX 改進、主題配色、圖示設計
- **🧪 測試反饋** - 測試新功能、回報問題、提供使用體驗
- **💰 資金支援** - [贊助項目](https://buy.stripe.com/3cs6rP6YA91sbbG5kk) - 支持長期發展

## 📄 授權條款

本專案採用 [Apache 2.0](LICENSE) 授權條款。

## 🙏 致敬與感謝

本主題基於 [hexo-theme-melody](https://github.com/Molunerfinn/hexo-theme-melody) 進行開發，感謝原作者的精彩創作為我們提供了靈感與基礎！

感謝所有為 Butterfly 主題發展做出貢獻的朋友們，是你們的支持讓這個主題能夠不斷完善與進步。

---

<div align="center">

**✨ 如果這個主題對您有幫助，請給我們一個 ⭐ Star！✨**
</div>
