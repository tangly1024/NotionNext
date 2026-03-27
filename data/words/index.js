// data/words/index.js

/**
 * wordDataMap: 二级分类词库加载器
 * - key: "category/listId"
 * - value: 异步函数，fetch 对应 public/word/... JSON 文件并返回数组
 * 
 * 使用示例：
 * const loader = wordDataMap['hsk/hsk1'];
 * const words = await loader(); // 返回 JSON 数组
 */

export const wordDataMap = {
  // 基础交际
  'jcjj/rcdc': () =>
    fetch('/word/jcjj/rcdc.json')
      .then((res) => {
        if (!res.ok) throw new Error('加载失败：jcjj/rcdc.json');
        return res.json();
      }),

  // HSK
  'hsk/hsk1': () =>
    fetch('/word/hsk/hsk1.json')
      .then((res) => {
        if (!res.ok) throw new Error('加载失败：hsk/hsk1.json');
        return res.json();
      }),
};
