import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import BLOG from '@/blog.config'
import { getNotionCacheRoot } from './build_session'
import { cacheNamespace } from './namespace'
import { redisClient } from './redis_cache'

const generationKey = `${cacheNamespace}:generation`
const generationFile = () => path.join(getNotionCacheRoot(), 'data-generation')

// The marker is outside data/, so clearing entries cannot revive an old generation.
function localGeneration() {
  try {
    return fs.readFileSync(generationFile(), 'utf8').trim() || '0'
  } catch (error) {
    if (error.code === 'ENOENT') return '0'
    throw error
  }
}

export async function getCacheGeneration() {
  if (BLOG.REDIS_URL) {
    try {
      return (await redisClient.get(generationKey)) || '0'
    } catch {
      /* Use the local fallback if Redis is temporarily unavailable. */
    }
  }
  return localGeneration()
}

export async function rotateCacheGeneration() {
  const generation = randomUUID()
  const file = generationFile()
  const temporary = `${file}.${generation}.tmp`
  fs.writeFileSync(temporary, generation)
  fs.renameSync(temporary, file)
  if (BLOG.REDIS_URL) await redisClient.set(generationKey, generation)
  return generation
}
