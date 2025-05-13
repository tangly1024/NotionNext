/**
 * 延时
 * @param {*} ms
 * @returns
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取从第1页到指定页码的文章
 * @param pageIndex 第几页
 * @param list 所有文章
 * @param pageSize 每页文章数量
 * @returns {*}
 */
export const getListByPage = function (list, pageIndex, pageSize) {
  return list.slice(0, pageIndex * pageSize)
}