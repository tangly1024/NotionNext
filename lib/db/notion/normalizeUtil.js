
/**
 * 可能由于Notion接口升级导致数据格式变化，这里进行统一处理
 * @param {*} block 
 * @param {*} pageId 
 * @returns 
 */
function normalizeNotionMetadata(block, pageId) {
    const rawValue = block?.[pageId]?.value
    if (!rawValue) return null
    return rawValue.type ? rawValue : rawValue.value ?? null
}

/**
 * 兼容新老 Notion collection 结构 ， 新版会用space_id 包裹一层
 * 统一返回真正的 collection.value（包含 schema 的那一层）
 */
function normalizeCollection(collection) {
    let current = collection

    // 最多剥 3 层，防止死循环
    for (let i = 0; i < 3; i++) {
        if (!current) break

        // 已经是最终形态：有 schema
        if (current.schema) {
            return current
        }

        // 常见包装：{ value: {...}, role }
        if (current.value) {
            current = current.value
            continue
        }

        break
    }

    return current ?? {}
}

/**
 * 兼容 Notion schema
 * 保留原始字段 id 作为 key
 */
/**
 * 兼容 Notion schema
 * 保留原始字段 id 作为 key
 */
function normalizeSchema(schema = {}) {
    const result = {}

    Object.entries(schema).forEach(([key, value]) => {
        result[key] = {
            ...value,
            name: value?.name || '',
            type: value?.type || ''
        }
    })

    return result
}


/**
 * ✅ 终极版：兼容 Notion 新老 Page Block 结构
 * 最终一定返回：{ id, type, properties }
 */
function normalizePageBlock(blockItem) {
    if (!blockItem) return null

    let current = blockItem

    for (let i = 0; i < 5; i++) {
        if (!current) return null

        // 针对 collection 兼容
        if (
            (current.type === 'collection_view_page' || current.type === 'collection_view') &&
            current.collection_id
        ) {
            return current
        }

        if (current.type || current.properties) {
            return current
        }

        if (current.value) {
            current = current.value
            continue
        }

        break
    }

    return null
}

module.exports = {
    normalizeNotionMetadata,
    normalizeCollection,
    normalizeSchema,
    normalizePageBlock
}