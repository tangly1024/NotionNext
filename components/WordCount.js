import { useGlobal } from '@/lib/global';
import { useEffect } from 'react';

/**
 * 字数统计
 * @returns
 */
export default function WordCount() {
  const { locale } = useGlobal();

  useEffect(() => {
    countWords();
  }, []);

  return (
    <span id='wordCountWrapper' className='flex gap-3 font-light hidden'>
      <span className='flex whitespace-nowrap items-center'>
        <i className='pl-1 pr-2 fas fa-file-word' />
        <span id='wordCount'>0</span> 字
      </span>
      <span className='flex whitespace-nowrap items-center'>
        <i className='mr-1 fas fa-clock' />
        <span id='readTime'>0</span> {locale.COMMON.MINUTE}
      </span>
    </span>
  );
}

/**
 * 更新字数统计和阅读时间
 */
function countWords() {
  const articleText = deleteHtmlTag(document.getElementById('notion-article')?.innerHTML);
  const wordCount = fnGetCpmisWords(articleText);

  // 阅读速度设置为每分钟400字
  const readTime = Math.ceil(wordCount / 400);

  // 更新字数和阅读时间显示
  document.getElementById('wordCount').innerText = wordCount;
  document.getElementById('readTime').innerText = readTime;

  const wordCountWrapper = document.getElementById('wordCountWrapper');
  wordCountWrapper.classList.remove('hidden');
}

// 去除html标签
function deleteHtmlTag(str) {
  if (!str) {
    return '';
  }
  return str.replace(/<[^>]+>|&[^>]+;/g, '').trim();
}

// 用word方式计算正文字数
function fnGetCpmisWords(str) {
  if (!str) {
    return 0;
  }

  // 保留你的主要逻辑，只简化了一些步骤
  str = str.replace(/(\r\n+|\s+|　+)/g, ' ')
           .replace(/[\x00-\xff]/g, 'm')
           .replace(/m+/g, '*')
           .replace(/龘+/g, '')
           .trim();
  
  return str.length;
}
