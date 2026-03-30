
/**
 * Notion 数据格式清理工具
 * 旧版 block:{ value:{}}
 * 新版 block:{ spaceId:{ id:{ value:{} } } }
 * 强制解包成旧版
 * @param {*} blockMap 
 * @returns 
 */
export function adapterNotionBlockMap(blockMap) {
  if (!blockMap) return blockMap;

  const cleanedBlocks = {};
  const cleanedCollection = {};

  for (const [id, block] of Object.entries(blockMap.block || {})) {
    const value = unwrapValue(block);
    if (!value || typeof value !== 'object') continue;
    // react-notion-x/notion-utils 依赖 block.value.id 存在
    // 缺失时会在 uuidToId 内触发 replaceAll 报错
    const normalizedId = typeof value.id === 'string' && value.id ? value.id : id;
    if (!normalizedId) continue;
    cleanedBlocks[id] = { value: { ...value, id: normalizedId } };
  }

  for (const [id, collection] of Object.entries(blockMap.collection || {})) {
    const value = unwrapValue(collection);
    if (!value || typeof value !== 'object') continue;
    const normalizedId = typeof value.id === 'string' && value.id ? value.id : id;
    cleanedCollection[id] = { value: { ...value, id: normalizedId } };
  }

  return {
    ...blockMap,
    block: cleanedBlocks,
    collection: cleanedCollection,
  };
}




function unwrapValue(obj) {
  let cur = obj;
  let guard = 0;

  while (cur?.value && typeof cur.value === 'object' && guard < 5) {
    cur = cur.value;
    guard++;
  }

  return cur;
}
