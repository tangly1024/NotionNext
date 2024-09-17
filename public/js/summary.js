window.onload = function() {
// 这里编写自定义js脚本；将被静态引入到页面中
console.log("\n %c 博客文章摘要AI生成工具 %c 适用于博客的文章摘要生成器 \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");

function insertAIDiv(selector) {
  removeExistingAIDiv();
  const targetElement = document.querySelector(selector);

  if (!targetElement) {
    return;
  }

  const aiDiv = document.createElement('div');
  aiDiv.className = 'post-TianliGPT';

  const aiTitleDiv = document.createElement('div');
  aiTitleDiv.className = 'tianliGPT-title';
  aiDiv.appendChild(aiTitleDiv);

  const aiIcon = document.createElement('i');
  aiIcon.className = 'tianliGPT-title-icon';
  aiTitleDiv.appendChild(aiIcon);

  aiIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 48 48"><title>机器人</title><g fill="none" fill-rule="evenodd"><path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z" fill="#444444"></path></g></svg>`;

  const aiTitleTextDiv = document.createElement('div');
  aiTitleTextDiv.className = 'tianliGPT-title-text';
  aiTitleTextDiv.textContent = 'AI摘要';
  aiTitleDiv.appendChild(aiTitleTextDiv);

  const aiTagDiv = document.createElement('div');
  aiTagDiv.className = 'tianliGPT-tag';
  aiTagDiv.id = 'tianliGPT-tag';
  aiTagDiv.textContent = 'TianliGPT';
  aiTitleDiv.appendChild(aiTagDiv);

  const aiExplanationDiv = document.createElement('div');
  aiExplanationDiv.className = 'tianliGPT-explanation';
  aiExplanationDiv.innerHTML = '生成中...' + '<span class="blinking-cursor"></span>';
  aiDiv.appendChild(aiExplanationDiv);

  targetElement.insertBefore(aiDiv, targetElement.firstChild);
}

function removeExistingAIDiv() {
  const existingAIDiv = document.querySelector(".post-TianliGPT");
  if (existingAIDiv) {
    existingAIDiv.parentElement.removeChild(existingAIDiv);
  }
}

var tianliGPT = {
  getTitleAndContent: function() {
    try {
      const title = document.title;
      const container = document.querySelector(tianliGPT_postSelector);
      if (!container) {
        console.warn('LinYunGPT：找不到文章容器。');
        return '';
      }
      const paragraphs = container.getElementsByTagName('p');
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
      let content = '';

      for (let h of headings) {
        content += h.innerText + ' ';
      }

      for (let p of paragraphs) {
        const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
        content += filteredText;
      }

      const combinedText = title + ' ' + content;
      let wordLimit = 1000;
      if (typeof tianliGPT_wordLimit !== "undefined") {
        wordLimit = tianliGPT_wordLimit;
      }
      const truncatedText = combinedText.slice(0, wordLimit);
      return truncatedText;
    } catch (e) {
      console.error('LinYunGPT错误：获取内容失败。', e);
      return '';
    }
  },

  fetchTianliGPT: async function(content) {
    completeGenerate = false;
    controller = new AbortController();
    signal = controller.signal;

    // if (sessionStorage.getItem('summary')) {
    //   return JSON.parse(sessionStorage.getItem('summary'));
    // }

    try {
      const response = await fetch('https://ai-summary.linyunlink.top/api/summary/?token=1145141919810', {
        signal: signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content })
      });

      completeGenerate = true;

      if (response.status === 429) {
        console.log('请求过于频繁，请稍后再请求AI。');
      }

      if (!response.ok) {
        throw new Error('Response not ok');
      }

      const data = await response.json();
    //   sessionStorage.setItem('summary', JSON.stringify(data));
      console.log('Ai摘要：'+data)
      console.log('Ai摘要：'+data.summary)
      return data.summary;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("请求已被中止");
      } else if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        console.log("请求LinYunGPT出错了，你正在本地进行调试。");
      } else {
        console.log("请求LinYunGPT出错了，请稍后再试。");
      }
      completeGenerate = true;
      return "";
    }
  }
};

function runTianliGPT() {
  insertAIDiv(tianliGPT_postSelector);
  const content = tianliGPT.getTitleAndContent();
  if (!content && content !== '') {
    console.log('LinYunGPT本次提交的内容为：' + content);
  }
  tianliGPT.fetchTianliGPT(content).then(summary => {
    const aiExplanationDiv = document.querySelector('.tianliGPT-explanation');
    aiExplanationDiv.innerHTML = summary;
    // 检查 summary 类型
    if (typeof summary === 'string' && summary.trim() !== '') {
        aiExplanationDiv.innerHTML = summary;  // 确保是字符串
      } else if (summary && typeof summary === 'object') {
        aiExplanationDiv.innerHTML = JSON.stringify(summary);  // 如果是对象，处理为字符串
      } else {
        aiExplanationDiv.innerHTML = "生成摘要时出错，请稍后重试。";
      }
  });
}

function checkURLAndRun() {
  if (typeof tianliGPT_postURL === "undefined") {
    runTianliGPT();
    return;
  }

  try {
    const wildcardToRegExp = (s) => {
      return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
    };

    const regExpEscape = (s) => {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    };

    const urlPattern = wildcardToRegExp(tianliGPT_postURL);
    const currentURL = window.location.href;

    if (urlPattern.test(currentURL)) {
      runTianliGPT();
    } else {
      console.log("LinYunGPT：不符合自定义的链接规则，不执行摘要功能。");
    }
  } catch (error) {
    console.error("LinYunGPT：自定义链接规则解析失败，不执行摘要功能。", error);
  }
}

checkURLAndRun();

};
