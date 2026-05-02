
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
    cleanedBlocks[id] = { value: unwrapValue(block) };
  }

  for (const [id, collection] of Object.entries(blockMap.collection || {})) {
    cleanedCollection[id] = { value: unwrapValue(collection) };
  }

  return {
    ...blockMap,
    block: cleanedBlocks,
    collection: cleanedCollection,
  };
}


function unwrapValue(obj) {
  if (!obj) return obj

  // 新格式特征：外层有 role 或 spaceId，value 里才是真实 block（有 id 和 type）
  // { spaceId, value: { value: { id, type, ... }, role } }
  if (obj?.value?.value?.id && obj?.value?.role) {
    return obj.value.value
  }

  // 次新格式：{ value: { id, type, ... }, role }
  if (obj?.value?.id && obj?.role !== undefined) {
    return obj.value
  }

  // 旧格式：{ value: { id, type, ... } } 直接取 value
  if (obj?.value?.id) {
    return obj.value
  }

  // 兜底：原样返回
  return obj?.value ?? obj
}