const MongoClient = require('mongodb').MongoClient

const DB_URL = process.env.MONGO_DB_URL // e.g. mongodb+srv://mongo_user:[password]@xxx.mongodb.net//?retryWrites=true&w=majority
const DB_NAME = process.env.MONGO_DB_NAME // e.g. tangly1024
const DB_COLLECTION = 'posts'

export async function getCache (key) {
  const client = await MongoClient.connect(DB_URL).catch(err => { console.error(err) })
  const dbo = client.db(DB_NAME)
  const query = { block_id: key }
  const res = await dbo.collection('posts').findOne(query).catch(err => { console.error(err) })
  await client.close()
  return res
}

/**
 * 并发请求写文件异常； Vercel生产环境不支持写文件。
 * @param key
 * @param data
 * @returns {Promise<null>}
 */
export async function setCache (key, data) {
  const client = await MongoClient.connect(DB_URL).catch(err => { console.error(err) })
  const dbo = client.db(DB_NAME)
  data.block_id = key
  const query = { block_id: key }
  const jsonObj = JSON.parse(JSON.stringify(data))

  const updRes = await dbo.collection(DB_COLLECTION).updateOne(query, { $set: jsonObj }).catch(err => { console.error(err) })
  console.log('更新结果', key, updRes)
  if (updRes.matchedCount === 0) {
    const insertRes = await dbo.collection(DB_COLLECTION).insertOne(jsonObj).catch(err => { console.error(err) })
    console.log('插入结果', key, insertRes)
  }
  await client.close()
  return data
}

export async function delCache (key, data) {
  const client = await MongoClient.connect(DB_URL).catch(err => { console.error(err) })
  const dbo = client.db(DB_NAME)
  const query = { block_id: key }
  const res = await dbo.collection('posts').deleteOne(query).catch(err => { console.error(err) })
  console.log('删除结果', key, res)
  await client.close()
  return null
}

export default { getCache, setCache, delCache }
