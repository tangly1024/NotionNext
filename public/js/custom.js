// 这里编写自定义js脚本；将被静态引入到页面中
document.addEventListener('DOMContentLoaded', function() {
  console.log("\n %c Post-Abstract-AI 开源博客文章摘要AI生成工具 %c https://github.com/zhheo/Post-Abstract-AI \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");

  insertAIDiv(tianliGPT_postSelector);
  checkURLAndRun();
});

function insertAIDiv(selector) {
  removeExistingAIDiv();
  const targetElement = document.querySelector(selector);
  if (!targetElement) {
    return;
  }

  const aiDiv = document.createElement('div');
  aiDiv.className = 'post-TianliGPT';
  targetElement.insertBefore(aiDiv, targetElement.firstChild);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        updateDisplay(mutation.target);
      }
    });
  });

  const aiExplanationDiv = document.createElement('div');
  aiExplanationDiv.className = 'tianliGPT-explanation';
  aiExplanationDiv.innerHTML = '生成中...' + '<span class="blinking-cursor"></span>';
  aiDiv.appendChild(aiExplanationDiv);

  observer.observe(aiExplanationDiv, { childList: true });
}

function removeExistingAIDiv() {
  const existingAIDiv = document.querySelector(".post-TianliGPT");
  if (existingAIDiv) {
    existingAIDiv.parentElement.removeChild(existingAIDiv);
  }
}

function updateDisplay(targetElement) {
  const content = tianliGPT.getTitleAndContent();
  tianliGPT.fetchTianliGPT(content).then(summary => {
    targetElement.innerHTML = summary;
  });
}

var tianliGPT = {
  getTitleAndContent: function() {
    // existing content extraction logic
  },
  
  fetchTianliGPT: async function(content) {
    // existing network request logic
  }
};

function checkURLAndRun() {
  // existing URL checking logic
}
