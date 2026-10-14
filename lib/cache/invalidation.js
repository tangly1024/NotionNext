import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import BLOG from '@/blog.config'
import { getNotionCacheRoot } from './build_session'
import { cacheNamespace } from './namespace'
import { redisClient } from './redis_cache'

const generationKey = `${cacheNamespace}:generation`
const generationFile = () => path.join(getNotionCacheRoot(), 'data-generation')
export const GENERATION_CACHE_TTL_MS = 1000
let cachedGeneration
let pendingGeneration
let revision = 0

// The marker is outside data/, so clearing entries cannot revive an old generation.
function localGeneration() {
  try {
    return fs.readFileSync(generationFile(), 'utf8').trim() || '0'
  } catch (error) {
    if (error.code === 'ENOENT') return '0'
    throw error
  }
}

async function readGeneration() {
  if (BLOG.REDIS_URL) {
    try {
      return (await redisClient.get(generationKey)) || '0'
    } catch (error) {
      console.warn(
        '[Cache] Redis generation read failed; using local marker',
        error instanceof Error ? error.name : 'Error'
      )
    }
  }
  return localGeneration()
}

export async function getCacheGeneration() {
  const now = Date.now()
  if (cachedGeneration?.expiresAt > now) return cachedGeneration.value
  if (pendingGeneration?.expiresAt > now) return pendingGeneration.promise

  // Share concurrent reads and expire from the start of the read, so a slow
  // response cannot extend an old marker beyond the propagation window.
  const currentRevision = revision
  const expiresAt = now + GENERATION_CACHE_TTL_MS
  const promise = readGeneration().then(value => {
    if (revision === currentRevision) cachedGeneration = { value, expiresAt }
    return value
  })
  pendingGeneration = { promise, expiresAt }
  try {
    return await promise
  } finally {
    if (pendingGeneration?.promise === promise) pendingGeneration = undefined
  }
}

export async function rotateCacheGeneration() {
  const generation = randomUUID()
  const file = generationFile()
  const temporary = `${file}.${generation}.tmp`
  try {
    fs.writeFileSync(temporary, generation)
    fs.renameSync(temporary, file)
  } finally {
    fs.rmSync(temporary, { force: true })
  }
  if (BLOG.REDIS_URL) await redisClient.set(generationKey, generation)
  revision++
  cachedGeneration = {
    value: generation,
    expiresAt: Date.now() + GENERATION_CACHE_TTL_MS
  }
  pendingGeneration = undefined
  // Other workers may retain the preceding marker for one TTL. Maintenance
  // must wait before regenerating pages on those workers.
  await new Promise(resolve => setTimeout(resolve, GENERATION_CACHE_TTL_MS))
  return generation
}
