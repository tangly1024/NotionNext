import { deepClone } from '@/lib/utils'

export function cleanIds(items?: any[]) {
  if (!Array.isArray(items)) return items
  return deepClone(items.map(i => {
    delete i.id
    return i
  }))
}

export function cleanPages(pages?: any[], tagOptions?: any[]) {
  if (!Array.isArray(pages)) return pages || []
  return pages
}

export function shortenIds(items?: any[]) {
  if (!Array.isArray(items)) return items
  return items
}
